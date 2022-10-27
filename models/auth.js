const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AuthSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true,
        },
        email: {
            type: String,
            required:true,
            unique: true
        },
        password: {
            type: String,
            required:true
        }
    },
    {
        timestamps:true, //Guardamos fecha de creacion y modificacion
        versionKey: false //Quitamos el versionado de mongoose
    }
)

AuthSchema.methods.passwordEncrypt = async (password) => {
    //generamos SALT
    const salt = await bcrypt.genSalt(10);//Semilla para encriptar
    return await bcrypt.hash(password, salt);
}

AuthSchema.methods.checkPassword = async function( password ) {
    //Comparo password ingresada con el pass del modelo(DB)
    return await bcrypt.compare(password, this.password);//ambas pass encriptadas.
}//Retorna TRUE/FALSE

module.exports = mongoose.model('Auth', AuthSchema);