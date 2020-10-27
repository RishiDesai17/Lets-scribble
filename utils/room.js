const uuid = require('uuid')
const redis = require('../infra/redis');

exports.createRoom = async socketID => {
    try{
        const roomID = uuid.v4()
        const body = {
            host: socketID,
            gameStarted: false
        }
        await redis.set(roomID, JSON.stringify(body)) // key: roomID  value: host, game(started or waiting in lobby)
        return { 
            success: true, 
            roomID 
        }
    }
    catch(err){
        console.log(err)
        return { 
            success: false, 
            message: "Something went wrong, please try again later" 
        }
    }
}

exports.joinRoom = async(io, socket, roomID) => {
    try{
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
        socket.join(roomID)
        socket.roomID = roomID
        socket.emit("members in this room", Object.keys(io.sockets.adapter.rooms[roomID].sockets))
        socket.broadcast.to(roomID).emit("new member", socket.id)
        const { gameStarted } = JSON.parse(await redis.get(roomID))
        if(gameStarted){
            socket.emit("game started")
        }
    }
    catch(err){
        console.log(err)
    }
}