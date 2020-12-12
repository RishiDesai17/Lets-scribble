const http = require("http")
const socket = require("socket.io")
const uuid = require("uuid")
const { createRoom, joinRoom, disconnect } = require("../utils/room")
const { startGame, nextTurn, startGuessing, validateWord } = require("../utils/game")

const webSocketsInit = app => {
    const server = http.Server(app)
    const io = socket(server)

    io.on("connection", socket => {
        console.log("New connection: " + socket.id)

        socket.on("create room", async({ host_name, avatar }) => {
            createRoom({ socket, host_name, avatar })
        })

        socket.on("join room", ({ roomID, name, avatar }) => {
            joinRoom({ io, socket, roomID, name, avatar })
        })

        socket.on("start game", ({ round_length, numRounds }) => {
            startGame({ io, socket, round_length, numRounds })
        })

        socket.on("drawing", data => {
            socket.broadcast.to(socket.roomID).emit("receiveStrokes", data)
        })

        socket.on("send full canvas", ({ sourceCanvas, recipient }) => {
            socket.broadcast.to(recipient).emit("full canvas", sourceCanvas)
        })

        socket.on("next turn", () => {
            nextTurn({ io, socket })
        })

        socket.on("chosen word", word => {
            startGuessing({ roomID: socket.roomID, word, socket })
        })

        socket.on("guess", word => {
            validateWord({ io, socket, word })
        })

        socket.on("disconnect", () => {
            console.log(socket.id + "left")
            disconnect({ io, socket })
        })
    })

    return server
}

module.exports = webSocketsInit