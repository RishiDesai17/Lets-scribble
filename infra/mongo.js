const mongoose = require('mongoose')

const connectToMongoDB = async() => {
    try{
        await mongoose.connect(process.env.LOCAL_DBURL || process.env.DBURL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        });
        console.log("Database connected!")
    }
    catch(err){
        console.log("Cannot connect to the Database")
    }
}

module.exports = connectToMongoDB