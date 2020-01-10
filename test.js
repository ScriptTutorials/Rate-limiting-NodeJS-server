const request = require('request-promise');

async function performTest(count) {
    for (let step = 0; step < count; step++) {
        try {
            await request(`http://localhost:3000/api/user/${step}`);
        } catch (e) {
            console.error(e);
        }
    }
};

performTest(120);