const http = require("http")
const socket = require("socket.io")
const uuid = require("uuid")
const { createRoom, joinRoom, disconnect } = require("../utils/room")
const { startGame } = require("../utils/game")

const webSocketsInit = app => {
    const server = http.Server(app)
    const io = socket(server)

    io.on("connection", socket => {
        console.log("New connection: " + socket.id)

        socket.on("create room", async() => {
            createRoom(socket)
        })

        socket.on("join room", roomID => {
            joinRoom(io, socket, roomID)
        })

        socket.on("start game", () => {
            startGame(socket)
        })

        socket.on("drawing", data => {
            console.log(data)
            socket.broadcast.to(socket.roomID).emit("receiveStrokes", data)
        })

        socket.on("disconnect", () => {
            console.log(socket.id + "left")
            disconnect(io, socket)
        })
    })

    return server
}

module.exports = webSocketsInit