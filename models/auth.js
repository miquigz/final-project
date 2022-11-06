const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Post = require("../models/posts");
const { default: slugify } = require('slugify');

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
        },
        desc: {
            type: String,
            required: false,
            unique: false
        },
        slugUser:{
            type: String,
            required: true,
            unique: true
        },
        totalPosts:{
            type: Number,
            required: false,
            unique: false
        },
        totalLikesPosts:{
            type: [String],
            required: false,
            unique: false
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

AuthSchema.pre('validate', function(next) {
    //Generamos un slug que nos permita tener varios usuarios con el mismo nombre:
    if(this.name) {
        this.slugUser = slugify((this.name + ' ' + Date().slice(8, -37) + " " + (Math.random(1) * 0.1).toString().slice(6, -10)) , {lower: true, strict: true})
    }
    console.log(this.slugUser)
    next()
})

module.exports = mongoose.model('Auth', AuthSchema, );