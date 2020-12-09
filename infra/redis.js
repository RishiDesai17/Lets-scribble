const redis = require("async-redis")
require('dotenv').config({path: __dirname + '/../.env'})

let redisClient
if(process.env.NODE_ENV === "prod") {
    redisClient = {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
}
else {
    redisClient = "redis://127.0.0.1"
}

const client = redis.createClient(redisClient)

client.auth(process.env.REDIS_PASSWORD, err => {
    if(err) {
        throw err;
    }
    console.log("redis connected")
});

module.exports = client