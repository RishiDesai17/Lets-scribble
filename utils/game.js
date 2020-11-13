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
                numRounds
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

const newGame = async({ _id, members, round_length, numRounds }) => {
    try {
        await new Game({
            _id,
            turnIndex: 0,
            sockets: Object.keys(members),
            numRounds
        }).save();
        await redis.set(roomID + " round", { round_length })
    } catch (err) {
        console.log(err)
    }
}

exports.startGuessing = async({ socket, word, roomID }) => {
    const { round_length } = await redis.get(roomID + " round")
    await redis.set(roomID + " round", {
        word,
        startTime: new Date(),
        round_length
    })
    socket.broadcast.to(roomID).emit("start guessing", word)
}

exports.validateWord = async({ io, socket, word }) => {
    const { word: correctAnswer, startTime, round_length } = await redis.get(roomID + " round")
    let color = "#000"
    if(correctAnswer && !socket.currentScore && word === correctAnswer) {
        const score = round_length - ((new Date() - startTime) / 1000)
        socket.score += score
        socket.currentScore = score
        color = "green"
    }
    io.sockets.in(socket.roomID).emit("guesses", {
        sender: io.sockets.connected[socket.id].name,
        message: word,
        color
    })
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
        Promise.all([
            scoreManagement({ io, roomID }),
            turn({ io, socketID: sockets[turnIndex], roomID })
        ])
        await Game.findByIdAndUpdate(roomID, {
            turnIndex
        })
    } catch (err) {
        console.log(err)
    }
}

const scoreManagement = ({ io, roomID }) => {
    round_wise_scores = []
    for(let key in io.sockets.adapter.rooms[roomID].sockets){
        const socketData = io.sockets.connected[key]
        round_wise_score.push({
            score: socketData.currentScore,
            name: socketData.name
        })
        io.sockets.connected[key].currentScore = undefined
    }
    io.sockets.in(roomID).emit("round wise scores", round_wise_scores)
}