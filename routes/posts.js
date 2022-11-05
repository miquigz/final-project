const express = require('express')
const routerPosts = express.Router()
const { newPost, createPost, showPost, deletePost, showPostFormEdit, editPost, getPostsPaginacion, modificarPaginacion } = require('../controllers/posts')
const isAuthenticated = require('../middlewares/isAuthenticated')

// Rutas de Index
// routerPosts.get('/posts', getPosts)

routerPosts.get('/posts/', isAuthenticated,getPostsPaginacion) 
routerPosts.get('/posts/new', isAuthenticated, newPost)
//TODO: Hacer SLUG en vez de ID
routerPosts.get('/posts/edit/:id', isAuthenticated, showPostFormEdit)
routerPosts.get('/posts/:slug', showPost) //Lo utiliza tambien la vista home. 

routerPosts.post('/posts',isAuthenticated ,createPost)
routerPosts.post('/posts/cambiarPaginacion', modificarPaginacion);

routerPosts.put('/posts/:id', isAuthenticated, editPost)

routerPosts.delete('/posts/:id', isAuthenticated, deletePost)


module.exports = {
    routerPosts
}