const redis = require('../infra/redis');

exports.startGame = async(socket) => {
    try{
        const roomID = socket.roomID
        let roomData = JSON.parse(await redis.get(roomID))
        if(socket.id === roomData.host){
            roomData.gameStarted = true
            await redis.set(roomID, JSON.stringify(roomData))
            socket.broadcast.to(roomID).emit("game started")
        }
    }
    catch(err){
        console.log(err)
    }
}