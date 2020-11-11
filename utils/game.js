const redis = require('../infra/redis');
const Game = require('../models/game')

exports.startGame = async(io, socket) => {
    try{
        const roomID = socket.roomID
        let roomData = JSON.parse(await redis.get(roomID))
        if(socket.id === roomData.host) {
            roomData.gameStarted = true
            await redis.set(roomID, JSON.stringify(roomData))
            socket.broadcast.to(roomID).emit("game started")
            const members = io.sockets.adapter.rooms[roomID].sockets
            newGame({
                _id: roomID,
                members,
            })
            turn({ 
                io, 
                socketID: socket.id, 
                roomID
            })
        }
    }
    catch(err){
        console.log(err)
    }
}

const newGame = async({ _id, members }) => {
    try {
        await new Game({
            _id,
            turnIndex: 0,
            sockets: Object.keys(members)
        }).save();
    } catch (err) {
        console.log(err)
    }
}

exports.startGuessing = ({socket, word, roomID}) => {
    socket.broadcast.to(roomID).emit("start guessing", word)
}

const turn = async({ io, socketID, roomID }) => {
    const words = ['cup', 'plate', 'glass']
    io.sockets.in(socketID).emit("turn", words)
    io.sockets.in(roomID).emit("someone choosing word", `${{
        socketID,
        name: io.sockets.connected[socketID].name
    }} is choosing a word`)
}

exports.nextTurn = async({ io, roomID }) => {
    try {
        const roomData = await Game.findById(roomID).select('sockets turnIndex')
        let { sockets, turnIndex } = roomData
        if(turnIndex === sockets.length - 1){
            turnIndex = 0
        }
        else{
            turnIndex += 1
        }
        turn({ io, socketID: sockets[turnIndex], roomID })
        await Game.findByIdAndUpdate(roomID, {
            turnIndex
        })
    } catch (err) {
        console.log(err)
    }
}