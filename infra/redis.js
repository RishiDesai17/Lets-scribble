const redis = require("async-redis")

const redis_url = process.env.REDIS_URL || "redis://127.0.0.1"

const client = redis.createClient(redis_url)

client.on('error', err => {
    console.log(err)
})

module.exports = client