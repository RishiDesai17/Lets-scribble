const express = require("express")
const app = express()
const webSocketsInit = require('./infra/WebSockets')
const connectToMongoDB = require('./infra/mongo')
require('dotenv').config({path: __dirname + '/.env'})

app.use(express.json())

const port = 3001

const main = async() => {
    const server = await webSocketsInit(app)
    await connectToMongoDB()
    return server
}

main().then(server => {
    server.listen(port, () => {
        console.log("Server running on port 3001")
    })
})