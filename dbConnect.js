const mongoose = require('mongoose')

const dbConnect = ()=>{
    const connectionParams = {useNewUrlParser: true}
    try{
        mongoose.connect(process.env.MONGO_URL,connectionParams)

        mongoose.connection.on('connected', ()=>{
            console.log('MongoDB connected successfully.')
        })

        mongoose.connection.on('disconnected', ()=>{
            console.log('MongoDB disconnected.')
        })

    }
    catch(err){
        console.log('Error while connecting to MongoDB', err)
    }

}

module.exports = dbConnect