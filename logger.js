const fs = require('fs');

// Logger class to write request logs
class Logger {
    constructor() {
        this.logFile = `${__dirname}/logs/request-log.txt`;
    }

    writeLog(message) {
        let ts = Date.now();
        fs.appendFile(this.logFile, `${ts} ${message}\n`, 'utf8', err => {
            if (err) throw err;
        });
    }
}

module.exports = new Logger();