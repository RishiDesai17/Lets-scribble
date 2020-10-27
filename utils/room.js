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

exports.disconnect = async(io, socket) => {
    try{
        const roomID = socket.roomID
        socket.broadcast.to(roomID).emit("member left")
        let roomData = JSON.parse(await redis.get(roomID))
        let members;
        const roomDetails = io.sockets.adapter.rooms[roomID]
        if(roomDetails){
            members = Object.keys(io.sockets.adapter.rooms[roomID].sockets)
        }
        else{ return }
        if(roomData.host === socket.id){
            // console.log("new host")
            newHost = members[0]
            roomData.host = newHost
            socket.broadcast.to(newHost).emit("new host")
        }
        if(roomData.gameStarted && members.length === 1){
            // console.log("game over")
            socket.broadcast.to(roomID).emit("game over")
            await redis.del(roomID)
        }
        else{
            await redis.set(roomID, JSON.stringify(roomData))
        }
        // console.log(await redis.keys('*'))
    }
    catch(err){
        console.log(err)
    }
}