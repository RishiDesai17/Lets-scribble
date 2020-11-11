const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    turnIndex: {
        type: Number,
        required: true
    },
    sockets: [{
        type: String,
        required: true
    }],
    // scores: [{
    //     type: Number,
    //     required: true
    // }]
})

module.exports = mongoose.model('Game', gameSchema)