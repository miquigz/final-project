const { response } = require("express");
const Post = require("../models/posts");

// INDEX
const getPosts = async (req, res = response) => {
  try {
    const posts = await Post.find({}).lean(); // Me deja un obj puro de JS
    //console.log(posts)
    const title = "InfoBlog - Listado de Post";
    res.status(200).render("posts/index", {
      title,
      posts,
    });
  } catch (error) {
    console.log('Error INDEX', error)
  }
};

// SHOW
const showPost = async (req, res = response) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).lean();
    if (post === null) res.redirect("/");

    res.render("posts/show", {
      title: `InfoBlog - ${post.title}`,
      post,
    })

  } catch (error) {
    console.log('Error SHOW' , error)
  }
};

// DELETE
const deletePost = async (req, res = response) => {
    try {
        await Post.findByIdAndDelete(req.params.id)

        res.redirect('/posts')

    } catch (error) {
        console.log('Error DELETE', error)
    }
}

// NEW
const newPost = (req, res = response) => {
    res.status(200).render('posts/new')
}

// CREATE
const createPost = async (req, res = response) => {

    try {
        // console.log(req.body)
        let post = new Post()

        post.title = req.body.title
        post.body = req.body.body
        if (req.body.guardarFecha){
          post.fecha = "Creado el: " + new Date().toLocaleString();
        }
        post = await post.save()
        
        res.status(200).redirect(`/posts/${post.slug}`);

    } catch (error) {
        console.log('Error CREATE', error)
    }
}

// Show Post Form Edit

const showPostFormEdit = async (req, res = response) => {

    try {
        const post = await Post.findById(req.params.id).lean()

        res.render('posts/edit', {
            title: 'Editando Post',
            post
        })
        
    } catch (error) {
        console.log('Show Edit Post', error)
    }
}

const editPost = async (req, res = response) => {
  try {
    let post = await Post.findById(req.params.id);
    //.lean() si ponemos este metodo no nos reconoce la funcion .save()
      post.title = req.body.title;
      post.body = req.body.body;
      post.fecha = "Editado el: " + new Date().toLocaleString();
    post = await post.save();
    //res.redirect(`/posts/edit/${post._id}`);
    res.redirect(`/posts`);
  } catch (error) {
    console.log('Edit ERORR', error)
  }
}

module.exports = {
  getPosts,
  showPost,
  deletePost,
  createPost,
  newPost,
  showPostFormEdit,
  editPost
};
