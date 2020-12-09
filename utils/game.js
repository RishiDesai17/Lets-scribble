const redis = require('../infra/redis');
const Game = require('../models/game');
const { words } = require('../words');

exports.startGame = async({ io, socket, round_length, numRounds }) => {
    try{
        const roomID = socket.roomID
        let roomData = JSON.parse(await redis.get(roomID))
        if(socket.id === roomData.host) {
            roomData.gameStarted = true
            await redis.set(roomID, JSON.stringify(roomData))
            socket.broadcast.to(roomID).emit("game started", round_length) // send the round length selected by host to the members
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
                socket,
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
            sockets: Object.keys(members)
        }).save();
        
        await redis.set(_id + " round", JSON.stringify({ 
            round_length,
            numRounds,
            currentRound: 1,
            turn: socket.id
        }))
    }
    catch(err) {
        console.log(err)
        socket.emit("something broke")
    }
}

exports.startGuessing = async({ socket, word, roomID }) => {
    try{
        const roundData = JSON.parse(await redis.get(roomID + " round"))
        if(roundData !== null && !roundData.word) {
            await redis.set(roomID + " round", JSON.stringify({
                ...roundData,
                word,
                startTime: new Date()
            }))
            socket.broadcast.to(roomID).emit("start guessing", word.length)
        }
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
    else if(word.toLowerCase() === correctAnswer) {
        const score = Math.ceil(round_length - ((new Date() - new Date(startTime)) / 1000))
        socket.score += score
        socket.currentScore = score
        socket.emit("your score", score)
        const name = io.sockets.connected[socket.id].memberDetails.name
        socket.emit("guesses", {
            socketID: socket.id,
            sender: name,
            message: word,
            color: "green"
        })
        socket.broadcast.to(socket.roomID).emit("guesses", {
            sender: "Server",
            message: `${name} got it right!`,
            color: 'black'
        })
        return
    }
    io.sockets.in(socket.roomID).emit("guesses", {
        socketID: socket.id,
        sender: io.sockets.connected[socket.id].memberDetails.name,
        message: word,
        color
    })
}

const turn = async({ io, socket, socketID, roomID, prevWord }) => {
    numTotalWords = words.length
    const selectedIndices = new Set()
    const selectedWords = []
    for(let i = 0; i < 3; i++){
        let randomIndex = Math.floor(Math.random() * numTotalWords)
        while(selectedIndices.has(randomIndex)){
            randomIndex = Math.floor(Math.random() * numTotalWords)
        }
        selectedIndices.add(randomIndex)
        selectedWords.push(words[randomIndex])
    }
    io.sockets.in(socketID).emit("turn", selectedWords)
    const sockets = io.sockets.connected
    if(socket) {
        socket.broadcast.to(roomID).emit("someone choosing word", sockets[socketID].memberDetails.name)
    }
    else{
        Object.keys(sockets).forEach(socket_id => {
            if(socketID !== socket_id) {
                io.sockets.in(socket_id).emit("someone choosing word", sockets[socketID].memberDetails.name)
            }
        });
    }
    if(prevWord) {
        io.sockets.in(roomID).emit("guesses", {
            sender: "Server",
            message: `Correct answer: ${prevWord}`,
            color: 'black'
        })
    }
    setTimeout(() => {
        autoSelect({ io, roomID, word: selectedWords[0], socketID })
    }, 7500)
}

const autoSelect = async({ io, roomID, word, socketID }) => {
    const roundData = JSON.parse(await redis.get(roomID + " round"))
    if(roundData !== null && !roundData.word) { /* roundData !== null is to prevent execution if players quit before selecting word */
        await redis.set(roomID + " round", JSON.stringify({
            ...roundData,
            word,
            startTime: new Date(),
            turn: socketID
        }))
        io.sockets.in(roomID).emit("auto-selected", word.length)
    }
}

exports.nextTurn = async({ io, socket }) => {
    try {
        const roomID = socket.roomID
        const { sockets } = await Game.findById(roomID).select('sockets')
        let roundData = JSON.parse(await redis.get(roomID + " round"))
        if(roundData === null) return
        let turnIndex = sockets.indexOf(roundData.turn)
        if(turnIndex === sockets.length - 1){
            turnIndex = 0
            let { numRounds, currentRound } = roundData
            if(numRounds === currentRound){
                const scores = this.scoreManagement({ io, socket, roomID })
                io.sockets.in(roomID).emit("game over", scores)
                return
            }
            currentRound += 1
            roundData.currentRound = currentRound
        }
        else{
            turnIndex += 1
        }
        roundData.turn = sockets[turnIndex]
        this.scoreManagement({ io, socket, roomID })
        turn({ io, socketID: sockets[turnIndex], roomID, prevWord: roundData.word })
        roundData.word = undefined
        await redis.set(roomID + " round", JSON.stringify(roundData))
    } catch (err) {
        console.log(err)
        socket.emit("something broke")
    }
}

exports.scoreManagement = ({ io, socket, roomID }) => {
    let scoreSum = 0   // score sum for current round, used to calculate score for member who was drawing
    let numMembers = 0
    const sockets = io.sockets.adapter.rooms[roomID].sockets
    
    for(let key in sockets){
        const currentScore = io.sockets.connected[key].currentScore
        if(currentScore){
            scoreSum += currentScore
        }
        io.sockets.connected[key].currentScore = undefined
        numMembers += 1
    }
    
    const drawerScore = Math.ceil(scoreSum / numMembers)
    socket.score += drawerScore
    if(drawerScore > 0){
        socket.emit("your score", drawerScore)
    }
    
    let updatedScores = []
    for(let key in io.sockets.adapter.rooms[roomID].sockets){
        const socketData = io.sockets.connected[key]
        updatedScores.push({
            socketID: socketData.id,
            memberDetails: socketData.memberDetails,
            score: socketData.score
        })
    }
    
    updatedScores = updatedScores.sort((a, b) => {
        if(a.score > b.score){
            return -1    // arrange scores in descending order
        }
        return 1
    })
    
    io.sockets.in(roomID).emit("updated scores", updatedScores)
    return updatedScores
}