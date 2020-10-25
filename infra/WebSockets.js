const http = require("http")
const socket = require("socket.io")

const webSocketsInit = app => {
    const server = http.Server(app)
    const io = socket(server)

    io.on("connection", socket => {
        console.log("New connection: " + socket.id)
        socket.on("drawing", data => {
            console.log(data)
            socket.broadcast.emit("receiveStrokes", data)
        })
    })

    return server
}

module.exports = webSocketsInit