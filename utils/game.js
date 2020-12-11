const redis = require('../infra/redis');
const { words } = require('../words');

exports.startGame = async({ io, socket, round_length, numRounds }) => {
    try{
        const roomID = socket.roomID
        let roomData = JSON.parse(await redis.get(roomID))
        if(socket.id === roomData.host) {
            
            /* boolean to verify whether game has started or not, to check whether players joins later and accordingly deal with */
            roomData.gameStarted = true
            await redis.set(roomID, JSON.stringify(roomData))

            /* send the round length selected by host to the members, along with game started used to navigate them to playground */
            socket.broadcast.to(roomID).emit("game started", round_length) 
            const members = io.sockets.adapter.rooms[roomID].sockets
            
            /* to add to redis the necessary details */
            newGame({
                roomID,
                members,
                round_length,
                numRounds,
                socket
            })
            
            /* allot turn to player no.1 (the host) */
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

const newGame = async({ roomID, members, round_length, numRounds, socket }) => {
    try {
        const sockets = Object.keys(members)
        sockets.unshift(roomID + " members") // add key to the start of members array to produce required format for redis array
        await redis.rpush(sockets)
        
        await redis.set(roomID + " round", JSON.stringify({
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
        /*  check just for safety to check whether word has already been autoselected or not 
            roundData !== null is to prevent execution if players quit before selecting word
        */
        if(roundData !== null && !roundData.word) {
            await redis.set(roomID + " round", JSON.stringify({
                ...roundData,
                word,
                startTime: new Date()
            }))
            /* send only word length to other players */
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

    /* currentScore exists means player has already given the correct answer */
    if(socket.currentScore){
        color = "black"
    }
    else if(word.toLowerCase() === correctAnswer) {
        /* formula to calculate score for a round */
        const score = Math.ceil(round_length - ((new Date() - new Date(startTime)) / 1000))
        socket.currentScore = score /* allot score for current round */
        socket.score += score /* add it to his total score for the game */
        
        /* send the player his score for this round */
        socket.emit("your score", score)
        
        const name = io.sockets.connected[socket.id].memberDetails.name
        /* send the confirmation to player that he was correct */
        socket.emit("guesses", {
            socketID: socket.id,
            sender: name,
            message: word,
            color: "green"
        })
        
        /* Broadcast message to other players that this person got it right */
        socket.broadcast.to(socket.roomID).emit("guesses", {
            sender: "Server",
            message: `${name} got it right!`,
            color: 'black'
        })
        
        const moveToNextTurn = await everyoneAnsweredCorrectly({ io, socket, roomID: socket.roomID })
        if(moveToNextTurn) {
            this.nextTurn({ io, socket })
        }
        
        return
    }
    /* send the word to players when someone enters an incorrect word or enters words after answering correctly */
    io.sockets.in(socket.roomID).emit("guesses", {
        socketID: socket.id,
        sender: io.sockets.connected[socket.id].memberDetails.name,
        message: word,
        color
    })
}

const everyoneAnsweredCorrectly = async({ io, socket, roomID }) => {
    try {
        const { turn, startTime } = JSON.parse(await redis.get(roomID + " round"))
    
        /* if there are less than only 2 sec for round to get over according to the time limit
        we would wait for time limit to get over by itself */
        if(new Date() - new Date(startTime) < 2000) {
            return false
        }
        
        const sockets = Object.keys(io.sockets.adapter.rooms[roomID].sockets)
        for(let socketID of sockets) {
            if(socketID !== turn && !io.sockets.connected[socketID].currentScore) {
                return false
            }
        }
        return true
    }
    catch(err) {
        console.log(err)
        socket.emit("something broke")
    }
}

const turn = async({ io, socketID, roomID, prevWord }) => {
    numTotalWords = words.length
    /*  A Set to store randomly selected words' indices. Set provides constant time lookup 
        which is feasible to verify whether word has already been selected or not
    */
    const selectedIndices = new Set()
    const selectedWords = []
    
    for(let i = 0; i < 3; i++){
        let randomIndex = Math.floor(Math.random() * numTotalWords)
        
        /* to prevent repetition of words */
        while(selectedIndices.has(randomIndex)){
            randomIndex = Math.floor(Math.random() * numTotalWords)
        }
        
        /*  add word index to set for next iteration, add word to array,
            since they passed the uniqueness test(the while loop above)
        */
        selectedIndices.add(randomIndex)
        selectedWords.push(words[randomIndex])
    }
    /* send selected words to person whose turn is next */
    io.sockets.in(socketID).emit("turn", selectedWords)
    
    const sockets = io.sockets.connected
    /* send information about who currently is choosing a word i.e. whose turn it is */
    Object.keys(sockets).forEach(socket_id => {
        if(socketID !== socket_id) {
            io.sockets.in(socket_id).emit("someone choosing word", sockets[socketID].memberDetails.name)
        }
    });
    
    /*  send the correct answer of the previous round
        (the optional prevWord parameter was given to this function indicates that this isnt the first round)
    */
    if(prevWord) {
        io.sockets.in(roomID).emit("guesses", {
            sender: "Server",
            message: `Correct answer: ${prevWord}`,
            color: 'black'
        })
    }
    
    setTimeout(() => {
        autoSelect({ io, roomID, word: selectedWords[0], socketID })
    }, 7500) // if players dosent choose word in 7.5 seconds, autoselect it for him
}

const autoSelect = async({ io, roomID, word, socketID }) => {
    const roundData = JSON.parse(await redis.get(roomID + " round"))
    /*  check just for safety to check whether word has already been chosen or not 
        roundData !== null is to prevent execution if players quit before selecting word
    */
    if(roundData !== null && !roundData.word) {
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
        const sockets = await redis.lrange(roomID + " members", 0, -1)

        let roundData = JSON.parse(await redis.get(roomID + " round"))
        if(roundData === null) return // in case game got over due to only 1 or 0 members remaining in room
        
        let turnIndex = sockets.indexOf(roundData.turn)
        if(turnIndex === sockets.length - 1){
            turnIndex = 0
            let { numRounds, currentRound } = roundData
            
            /* if the last player just was drawing and no. of rounds are done, then game over */
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
        
        this.scoreManagement({ io, socket, roomID })
        turn({ io, socketID: sockets[turnIndex], roomID, prevWord: roundData.word })
        
        roundData.turn = sockets[turnIndex]
        roundData.word = undefined
        await redis.set(roomID + " round", JSON.stringify(roundData))
    
    } catch (err) {
        console.log(err)
        socket.emit("something broke")
    }
}

exports.scoreManagement = ({ io, socket, roomID }) => {
    let scoreSum = 0   // score sum for current round, used to calculate score for member who was drawing
    numMembers = 0
    const sockets = Object.keys(io.sockets.adapter.rooms[roomID].sockets)
    
    for(let socketID of sockets) {
        const currentScore = io.sockets.connected[socketID].currentScore
        
        if(currentScore){
            /* currentScore exists means player has already given the correct answer, so add up */
            scoreSum += currentScore
        }
        
        /* make currentScore attribute undefined for next round */
        io.sockets.connected[socketID].currentScore = undefined
        numMembers += 1
    }
    
    const drawerScore = Math.ceil(scoreSum / numMembers) // calculate score of player who was drawing
    socket.score += drawerScore // add it to his total score for the game
    if(drawerScore > 0){
        /* send to the player his score for this round */
        socket.emit("your score", drawerScore)
    }
    
    /* generate list of updated scorecard */
    let updatedScores = sockets.map(socketID => {
        const socketData = io.sockets.connected[socketID]
        return {
            socketID: socketData.id,
            memberDetails: socketData.memberDetails,
            score: socketData.score
        }
    })
    
    /* arrange scores in descending order i.e. rank wise */
    updatedScores = updatedScores.sort((a, b) => {
        if(a.score > b.score){
            return -1
        }
        return 1
    })
    
    /* send to everyone in the room the updated scorecard */
    io.sockets.in(roomID).emit("updated scores", updatedScores)
    return updatedScores
}