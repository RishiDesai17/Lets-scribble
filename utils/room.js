const uuid = require('uuid')
const redis = require('../infra/redis');

exports.createRoom = async socketID =>  {
    try{
        const roomID = uuid.v4()
        await redis.set(roomID, socketID) // key: roomID value: host
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