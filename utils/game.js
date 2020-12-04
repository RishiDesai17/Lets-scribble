const redis = require('../infra/redis');
const Game = require('../models/game')

exports.startGame = async({ io, socket, round_length, numRounds }) => {
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
                round_length,
                numRounds,
                socket
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
        socket.emit("something broke")
    }
}

const newGame = async({ _id, members, round_length, numRounds, socket }) => {
    try {
        await new Game({
            _id,
            sockets: Object.keys(members),
            numRounds
        }).save();
        await redis.set(_id + " round", JSON.stringify({ round_length }))
    }
    catch(err) {
        console.log(err)
        socket.emit("something broke")
    }
}

exports.startGuessing = async({ socket, word, roomID }) => {
    try{
        const roundData = JSON.parse(await redis.get(roomID + " round"))
        console.log(roundData)
        await redis.set(roomID + " round", JSON.stringify({
            ...roundData,
            word,
            startTime: new Date(),
            turn: socket.id
        }))
        socket.broadcast.to(roomID).emit("start guessing")
    }
    catch(err){
        console.log(err)
        socket.emit("something broke")
    }
}

exports.validateWord = async({ io, socket, word }) => {
    const { word: correctAnswer, startTime, round_length } = JSON.parse(await redis.get(socket.roomID + " round"))
    let color = "red"
    if(socket.currentScore){
        color = "black"
    }
    else if(word === correctAnswer) {
        const score = round_length - ((new Date() - new Date(startTime)) / 1000)
        console.log(score)
        socket.score += score
        socket.currentScore = score
        color = "green"
    }
    io.sockets.in(socket.roomID).emit("guesses", {
        sender: io.sockets.connected[socket.id].memberDetails.name,
        message: word,
        color
    })
}

const turn = async({ io, socketID, roomID }) => {
    const words = ['cup', 'plate', 'glass']
    io.sockets.in(socketID).emit("turn", words)
    io.sockets.in(roomID).emit("someone choosing word", {
        socketID,
        name: io.sockets.connected[socketID].name
    })
}

exports.nextTurn = async({ io, socket }) => {
    try {
        const roomID = socket.roomID
        const { sockets } = await Game.findById(roomID).select('sockets')
        let roundData = JSON.parse(await redis.get(roomID + " round"))
        let turnIndex = sockets.indexOf(roundData.turn)
        if(turnIndex === sockets.length - 1){
            turnIndex = 0
        }
        else{
            turnIndex += 1
        }
        roundData.turn = sockets[turnIndex]
        scoreManagement({ io, roomID })
        turn({ io, socketID: sockets[turnIndex], roomID })
        await redis.set(roomID + " round", JSON.stringify(roundData))
    } catch (err) {
        console.log(err)
        socket.emit("something broke")
    }
}

const scoreManagement = ({ io, roomID }) => {
    const round_wise_scores = []
    for(let key in io.sockets.adapter.rooms[roomID].sockets){
        const socketData = io.sockets.connected[key]
        round_wise_scores.push({
            score: socketData.currentScore,
            name: socketData.name
        })
        io.sockets.connected[key].currentScore = undefined
    }
    io.sockets.in(roomID).emit("round wise scores", round_wise_scores)
}