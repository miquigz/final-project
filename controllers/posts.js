const { request, response } = require("express");
const Post = require("../models/posts");

// INDEX
const getPosts = async (req, res = response) => {
  try {
    const postsArray = await Post.find({}).lean(); // Me deja un obj puro de JS

    let posts = postsArray.slice(0, 7);
    const title = "InfoBlog - Listado de Post";

    const paginacion = {
      desde:1,
      hasta:7,
      max:postsArray.length
    }

    res.status(200).render("posts/index", {
      title,
      posts,
      paginacion
    });
  } catch (error) {
    console.log('Error INDEX', error)
  }
};

const getPostsPaginacion = async (req, res = response)=>{
  try {
    //TODO: Acortar busqueda mediante index propio de la db
    const postsArray = await Post.find({}).lean();

    // console.log(typeof(req.query.skip));

    let valor = 5; //Valor a aumentar (de 5 en 5).
    let posts = postsArray.slice(req.query.skip ,req.query.limit);
    //let desde = parseInt(req.query.skip) + 1;
    const paginacion = {
      desde: req.query.skip,
      hasta: req.query.limit,
      maximo: postsArray.length,
      valor
    }
    res.render("posts/index", {
      posts,
      paginacion
    });

  } catch (error) {
      console.log("Error en paginacion", error);
  }

}

// SHOW

const showPost = async (req, res = response) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).lean();
    
    if (post === null) res.redirect("/");

    res.render("posts/show", {
      // title: `InfoBlog - ${post.title}`,
      post,
    })

  } catch (error) {
    console.log('Error SHOW' , error)
  }
};

// DELETE
const deletePost = async (req = request, res = response) => {
    try {
        await Post.findByIdAndDelete(req.params.id)

        console.log(req.headers.referer)
        res.redirect(req.headers.referer);
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
    res.redirect(`/posts/${post.slug}`);
  } catch (error) {
    console.log('Edit ERORR', error)
  }
}

module.exports = {
  showPost,
  deletePost,
  createPost,
  newPost,
  showPostFormEdit,
  editPost,
  getPostsPaginacion
};
