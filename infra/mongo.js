const mongoose = require('mongoose')

const connectToMongoDB = async() => {
    try{
        let dbURL
        if(process.env.NODE_ENV === "prod"){
            dbURL = process.env.DBURL
        }
        else{
            dbURL = process.env.LOCAL_DBURL
        }
        await mongoose.connect(dbURL, {
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