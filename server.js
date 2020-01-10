const http = require('http');
const logger = require('./logger');
const { RateLimiterMemory } = require('rate-limiter-flexible');

// define port
const port = process.env.port || 3000;
const timeout = 60;

// maximum 100 requests per hour
const rateLimiter = new RateLimiterMemory({
    points: 100, // maximum number of points can be consumed over duration
    duration: 3600, // number of seconds before consumed points are reset
    blockDuration: timeout // block for 60 seconds if consumed more than allowed
});

// create new async server
const server = http.createServer(async (req, res) => {
    if (req.url === '/favicon.ico') return; // skip serving favicon

    await rateLimiter.consume(req.socket.remoteAddress) // consume 1 point
    .then((rateLimiterRes) => {

        // write request log
        logger.writeLog(`"${req.url}" ${req.socket.remoteAddress}`);

        // process request normally
        res.writeHead(200);
        res.end(req.url);

    }).catch(err => {
        res.writeHead(429);
        res.end(`Rate limit exceeded. Try again in ${timeout} seconds`);

        // write request log
        logger.writeLog(`REJECTED "${req.url}" ${req.socket.remoteAddress}`);
    });
});

// start listening server port
server.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
});
