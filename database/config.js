const mongoose = require('mongoose')

const dbConnection = async () => {

    try {
        
        await mongoose.connect(process.env.DB_REMOTA_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log('-- Database connected!')

    } catch (error) {
        console.log("Error en conexion a la base de datos" ,error)
    }

}

module.exports = {
    dbConnection
}