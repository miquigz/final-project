const express = require('express')
const Post = require('../models/posts')
const routerPosts = express.Router()


// Rutas de INDEX
routerPosts.get('/posts', async (req, res) => {
    
    try {
    
        const posts = await Post.find({})

        res.render('get',
            {
                title,
                posts
            }
        )

    } catch (error) {
        console.log(error)
    }
})

module.exports = {
    routerPosts
}