const http = require("http")
const socket = require("socket.io")
const uuid = require("uuid")
const { createRoom } = require("../utils/room")
const { startGame } = require("../utils/game")

const webSocketsInit = app => {
    const server = http.Server(app)
    const io = socket(server)

    io.on("connection", socket => {
        console.log("New connection: " + socket.id)

        socket.on("create room", async() => {
            const response = await createRoom(socket.id)
            if(response.success){
                const roomID = response.roomID
                socket.join(roomID)
                socket.roomID = roomID
                socket.emit("roomID", roomID)
            }
        })

        socket.on("join room", roomID => {
            if(!uuid.validate(roomID)){
                socket.emit("invalid room")
                return;
            }
            const roomData = io.sockets.adapter.rooms[roomID]
            console.log(roomData.sockets)
            if(!roomData){
                socket.emit("invalid room")
                return;
            }
            socket.emit("users in this room", Object.keys(roomData.sockets))
            socket.join(roomID)
            socket.roomID = roomID
            socket.broadcast.to(roomID).emit("new member", socket.id)
        })

        socket.on("start game", () => {
            console.log(socket.roomID)
            startGame(socket)
        })

        socket.on("drawing", data => {
            console.log(data)
            socket.broadcast.to(socket.roomID).emit("receiveStrokes", data)
        })
    })

    return server
}

module.exports = webSocketsInit