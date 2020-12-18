const express = require("express")
const app = express()
const webSocketsInit = require('./infra/WebSockets')
const enforce = require('express-sslify');
require('dotenv').config({path: __dirname + '/.env'})

app.use(express.json())

const port = process.env.PORT || 3001

if(process.env.NODE_ENV === "prod") {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));

    app.use(express.static("react-client/build"));

    app.get("*", (req, res) => {
        res.sendFile(__dirname + "/react-client/build/index.html");
    });
}

const main = async() => {
    const server = await webSocketsInit(app)
    return server
}

main().then(server => {
    server.listen(port, () => {
        console.log("Server running on port 3001")
    })
})
