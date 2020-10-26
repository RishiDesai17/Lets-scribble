const uuid = require('uuid')
const redis = require('../infra/redis');

exports.createRoom = async socketID => {
    try{
        const roomID = uuid.v4()
        const body = {
            host: socketID,
            gameStarted: false
        }
        await redis.set(roomID, JSON.stringify(body)) // key: roomID  value: host, game started or waiting in lobby
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

exports.joinRoom = () => {

}