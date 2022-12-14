const mongoose = require('mongoose')
const { default: slugify } = require('slugify')

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true,
            unique: false
        },
        fecha: {
            type: String,
            required: false,
            unique: false
        },
        user: {
            type:String,
            required: false
        },
        emoji: {
            type:String,
            unique:false,
            required:false
        },
        img:{
            type: String,
            unique: false,
            required: false
        },
        likes:{
            type: Number,
            unique:false,
            required:false
        }
    },
    {
        versionKey: false
    }
)

// Middleware .pre()
// TODO: Llevar este middleware a un archivo separado
postSchema.pre('validate', function(next) {
    if(this.title) {
        this.slug = slugify(this.title, {lower: true, strict: true})
    }
    next()
})

module.exports = mongoose.model('Post', postSchema)