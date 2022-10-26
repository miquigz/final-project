const express = require('express')
const routerPosts = express.Router()

const { getPosts, newPost, createPost, showPost, deletePost, showPostFormEdit, editPost } = require('../controllers/posts')

// Rutas de Index
routerPosts.get('/posts', getPosts)
routerPosts.get('/posts/new', newPost)
routerPosts.get('/posts/edit/:id', showPostFormEdit)
routerPosts.get('/posts/:slug', showPost)

routerPosts.post('/posts', createPost)

routerPosts.put('/posts/:id', editPost);

routerPosts.delete('/posts/:id', deletePost)


module.exports = {
    routerPosts
}