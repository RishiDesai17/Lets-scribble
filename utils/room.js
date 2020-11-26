const uuid = require('uuid')
const redis = require('../infra/redis');
const Game = require('../models/game')
const { nextTurn } = require("./game")

exports.createRoom = async ({ socket, host_name, avatar }) => {
    try{
        const roomID = uuid.v4()
        const body = {
            host: socket.id,
            gameStarted: false
        }
        await redis.set(roomID, JSON.stringify(body)) // key: roomID  value: host, game(started or waiting in lobby)
        socket.roomID = roomID
        socket.member = { 
            name: host_name,
            avatar
        }
        socket.score = 0
        socket.join(roomID)
        socket.emit("roomID", roomID)
    }
    catch(err){
        console.log(err)
        socket.emit("something broke")
    }
}

exports.joinRoom = async({ io, socket, roomID, name, avatar }) => {
    try{
        if(!uuid.validate(roomID)){
            console.log("here!")
            socket.emit("invalid room")
            return;
        }
        const room = await redis.get(roomID)
        if(room === null){
            socket.emit("invalid room")
            return;
        }
        socket.join(roomID)
        socket.roomID = roomID
        const member = {
            name,
            avatar
        }
        socket.member = member
        socket.score = 0
        addMemberToDB({ roomID, socketID: socket.id })
        let usersInThisRoom = []
        for(let key in io.sockets.adapter.rooms[roomID].sockets){
            usersInThisRoom.push({
                socketID: key,
                member: io.sockets.connected[key].member
            })
        }
        console.log(usersInThisRoom)
        socket.emit("members in this room", usersInThisRoom)
        socket.broadcast.to(roomID).emit("new member", { socketID: socket.id, member })
        const { gameStarted } = JSON.parse(await redis.get(roomID))
        if(gameStarted){
            socket.emit("game started")
        }
    }
    catch(err){
        console.log(err)
        socket.emit("something broke")
    }
}

const addMemberToDB = async({ roomID, socketID }) => {
    try {
        await Game.findByIdAndUpdate(roomID, {
            $push: {
                'sockets': socketID
            }
        })
    } catch (err) {
        console.log(err)
    }
}

exports.disconnect = async({ io, socket }) => {
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
        const socketID = socket.id
        if(roomData.host === socketID){
            // console.log("new host")
            newHost = members[0]
            roomData.host = newHost
            socket.broadcast.to(newHost).emit("new host")
            await redis.set(roomID, JSON.stringify(roomData))
        }
        if(roomData.gameStarted && members.length === 1){
            // console.log("game over")
            socket.broadcast.to(roomID).emit("game over")
            Promise.all([
                await redis.del(roomID),
                await redis.del(roomID + " round"),
                await Game.findByIdAndDelete(roomID)
            ])
        }
        else{
            socket.broadcast.to(roomID).emit("someone left", socketID)
            if(roomData.gameStarted){
                const { turn } = JSON.parse(await redis.get(roomID + " round"))
                if(socketID === turn){
                    nextTurn({ io, roomID })
                }
                await Game.findByIdAndUpdate(roomID, {
                    $pull: {
                        'sockets': socketID
                    }
                })
            }
        }
        // console.log(await redis.keys('*'))
    }
    catch(err){
        console.log(err)
        socket.emit("something broke")
    }
}