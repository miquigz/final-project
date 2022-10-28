const { response } = require("express");
const Post = require("../models/posts");

const showHomeAllPosts = async (req, res = response)=>{
    try {
        const posts = await Post.find({}).lean(); // Me deja un obj puro de JS
        const title = "Home InfoBlog";
        res.status(200).render("home/home", {
            title,
            posts,
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