const uuid = require('uuid')
const redis = require('../infra/redis');
const { nextTurn, scoreManagement } = require("./game")

exports.createRoom = async ({ socket, host_name, avatar }) => {
    try{
        const roomID = uuid.v4()
        const body = {
            host: socket.id,
            gameStarted: false
        }
        await redis.set(roomID, JSON.stringify(body)) // key: roomID  value: host, game(started or waiting in lobby)
        socket.roomID = roomID
        socket.memberDetails = { 
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
        const memberDetails = {
            name,
            avatar
        }
        socket.memberDetails = memberDetails
        socket.score = 0
        
        let usersInThisRoom = []
        for(let key in io.sockets.adapter.rooms[roomID].sockets){
            usersInThisRoom.push({
                socketID: key,
                memberDetails: io.sockets.connected[key].memberDetails,
                score: io.sockets.connected[key].score
            })
        }
        socket.broadcast.to(roomID).emit("new member", { socketID: socket.id, memberDetails, score: 0 })

        const { gameStarted } = JSON.parse(await redis.get(roomID))        
        if(gameStarted){
            const { word, startTime, round_length, turn } = JSON.parse(await redis.get(roomID + " round"))
            let wordLength = 0
            if(word) {
                wordLength = word.length
            }
            
            /*  send also the round length selected by host to the members 
                since client wouldnt have that info if he joins after game starts
            */
            socket.emit("members in this room", usersInThisRoom, { wordLength, startTime, round_length }) 
            addMemberToDB({ roomID, socket }) // add member directly to db since he joined after game started

            if(!word) { 
                /*  this occurs when someone joins a room when some player is choosing a word, 
                    it should happen after emitting "members in the room" event, so that client is able to listen to this
                */
                socket.emit("someone choosing word", io.sockets.connected[turn].memberDetails.name)
            }
        }
        else{
            socket.emit("members in this room", usersInThisRoom)
        }
    }
    catch(err){
        console.log(err)
        socket.emit("something broke")
    }
}

const addMemberToDB = async({ roomID, socket }) => {
    try {
        await redis.rpushx(roomID + " members", socket.id)
    } catch (err) {
        console.log(err)
        socket.emit("something broke")
    }
}

exports.disconnect = async({ io, socket }) => {
    try{
        const roomID = socket.roomID
        if(!roomID) return
        
        socket.broadcast.to(roomID).emit("member left")
        
        let roomData = JSON.parse(await redis.get(roomID))
        const roomDetails = io.sockets.adapter.rooms[roomID]
        if(!roomDetails){ // just in case a disconnect event triggered after room was deleted
            deleteRoom({ roomID, socket })
            return
        }
        const members = Object.keys(io.sockets.adapter.rooms[roomID].sockets)
        const socketID = socket.id
        if(roomData.gameStarted){
            /* if game started and only 1 member is left, it means that everyone else left, so end the game */
            if(members.length === 1) {
                const scores = scoreManagement({ io, socket, roomID })
                socket.broadcast.to(roomID).emit("game over", scores)
                deleteRoom({ roomID, socket })
                return
            }
            socket.broadcast.to(roomID).emit("someone left", socketID)
            const { turn } = JSON.parse(await redis.get(roomID + " round"))
            /* if a player left the game while he was choosing a word, transfer turn to next player */
            if(socketID === turn){
                nextTurn({ io, socket })
            }
            await redis.lrem(roomID + " members", 1, socketID)
        }
        else{
            /* if game not started, an members length in room is now zero, means host left and no body else had joined */
            if(members.length === 0){
                deleteRoom({ roomID, socket })
                return
            }
            socket.broadcast.to(roomID).emit("someone left", socketID)
        }
        /* allot a new host if host leaves */
        if(roomData.host === socketID){
            allotNewHost({ newHost: members[0], roomData, socket })
        }
    }
    catch(err){
        console.log(err)
        socket.emit("something broke")
    }
}

const allotNewHost = async({ newHost, roomData, socket }) => {
    try{
        roomData.host = newHost
        socket.broadcast.to(newHost).emit("new host")
        await redis.set(socket.roomID, JSON.stringify(roomData))
    }
    catch(err){
        console.log(err)
        socket.emit("something broke")
    }
}

const deleteRoom = async({ roomID, socket }) => {
    try{
        redis.del(roomID)
        redis.del(roomID + " round")
        redis.del(roomID + " members")
    }
    catch(err){
        console.log(err)
        socket.emit("something broke")
    }
}