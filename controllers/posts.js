const { request, response } = require("express");
const Post = require("../models/posts");

// INDEX
const getPostsPaginacion = async (req, res = response)=>{
  try {
    const postsArray = await Post.find({}).lean();

    // console.log(typeof(req.query.skip));

    const valor = 5; //Valor a aumentar (de 5 en 5).
    let postsCortados = postsArray.slice(req.query.skip ,req.query.limit);

    
    postsCortados.forEach(element => {
      element = Object.assign(element, {userActual:req.user.name});
    });
    const posts = postsCortados;
    // console.log(posts);
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
    console.log(post.body);
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
        let postAborrar = await Post.findById(req.params.id);
        if (postAborrar.user == null || postAborrar.user === req.user.name)
          await Post.findByIdAndDelete(req.params.id)
        else
          console.log("No se puede borrar este elemento, verifique su usuario");
        res.redirect(req.headers.referer);
        // console.log(req.headers.referer)
    } catch (error) {
        console.log('Error DELETE', error)
    }
}

// NEW
const newPost = async (req, res = response) => {
  try {
    res.status(200).render('posts/new')
  } catch (error) {
    console.log("error en show(vista): new post", error);
  }
}

// CREATE
const createPost = async (req, res = response) => {
    try {
        let post = new Post();

        post.title = req.body.title;
        post.body = req.body.body;

        if (req.body.guardarUser)
          post.user = req.user.name;
        if (req.body.guardarFecha){
          post.fecha = "Creado el: " + new Date().toLocaleString();
        }

        post = await post.save()
        res.status(200).redirect(`/posts/${post.slug}`);
    } catch (error) {
        console.log('Error en CREATE Post', error);
    }
}

// Show Post Form Edit

const showPostFormEdit = async (req, res = response) => {

    try {
        const post = await Post.findById(req.params.id).lean();
        if (post.user == null || post.user === req.user.name){
          res.render('posts/edit', {
            title: 'Editando Post',
            post
          })
        }else{
          req.flash('isAuthenticated_error', "Acceso no autorizado, POST de otro usuario");
          res.redirect('/home')
        }
    } catch (error) {
        console.log('Show Edit Post', error)
    }
}

const editPost = async (req, res = response) => {
  try {
    let post = await Post.findById(req.params.id);
    if (post.user == null || post.user === req.user.name){
      post.title = req.body.title;
      post.body = req.body.body;
      if (post.user)
        post.user = post.user;
      if (req.body.guardarUser){
        post.user = req.body.user;
      }else{
        post.user = null;
      }
      if (req.body.guardarFecha)
        post.fecha = "Editado el: " + new Date().toLocaleString();
      post = await post.save();
      //res.redirect(`/posts/edit/${post._id}`);
      res.redirect(`/posts/${post.slug}`);
    }else{
      console.log('Incapaz de editar el Post, verifique su usario');
    }
      
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
