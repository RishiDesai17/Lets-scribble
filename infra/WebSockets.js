const http = require("http")
const socket = require("socket.io")
const { createRoom } = require("../utils/room")

const webSocketsInit = app => {
    const server = http.Server(app)
    const io = socket(server)

    io.on("connection", socket => {
        console.log("New connection: " + socket.id)

        socket.on("create room", async() => {
            const response = await createRoom(socket.id)
            if(response.success){
                socket.join(response.roomID)
                socket.emit("roomID", response.roomID)
            }
        })

        socket.on("drawing", data => {
            console.log(data)
            socket.broadcast.emit("receiveStrokes", data)
        })
    })

    return server
}

module.exports = webSocketsInit