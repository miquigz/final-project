const { response } = require("express");
const Post = require("../models/posts");

const showHomeAllPosts = async (req, res = response)=>{
    try {
        let postsArray = await Post.find({}).lean(); // Me deja un obj puro de JS
        const title = "Inicio - Posts InfoBlog";
    
        const masRecientes = {
            last: postsArray[postsArray.length - 1],
            last2: postsArray[postsArray.length - 2],
            last3: postsArray[postsArray.length - 3]
        }
        
        const paginacion = {
            desde: req.query.skip,
            hasta: req.query.limit,
            valor: 5
        }
        const posts = postsArray.slice(req.query.skip, req.query.limit);
        
        res.status(200).render("home/home", {
            title,
            posts,
            masRecientes,
            paginacion
        });
    } catch (error) {
        console.log('Error en HOME showHomeAllPosts', error);
    }
}



const showHomePostById = async (res, req = response)=>{


}

module.exports = {
    showHomeAllPosts,
    showHomePostById
}