const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    sockets: [{
        type: String,
        required: true
    }]
})

module.exports = mongoose.model('Game', gameSchema)