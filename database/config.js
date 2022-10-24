const mongoose = require('mongoose')

const dbConnection = async () => {

    try {
        
        await mongoose.connect(process.env.DB_LOCAL_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log('Database connected')

    } catch (error) {
        console.log(error)
    }

}

module.exports = {
    dbConnection
}