const { request, response } = require("express");
const Auth = require("../models/auth");
const Post = require("../models/posts");
let valor = 5; //Paginacion valor por defecto
let postsArray;
let paginacionBoolean = false;
let mostrarPosts;
// INDEX
const cortarPosts = (posts, desde, hasta)=>{
  let postsCortados = posts.slice(desde, hasta);

  return postsCortados
}

const getPostsPaginacion = async (req, res = response)=>{
  try {
    if (req.query.myPosts){//BUSQUEDA POR USER(actual)
      postsArray = await Post.find( { user: res.locals.user.name }).lean();     
      mostrarPosts = 'myPosts';
    }else if(req.query.editable){//Editables
      postsArray = await Post.find({ $or: [ {user: res.locals.user.name} , {user:{$exists: false}} ] }).lean();
      mostrarPosts = 'editable';
    }else{ //Busqueda comun(total):
      postsArray = await Post.find({}).lean();
      mostrarPosts = '';
    }
    //TODO: hace callback
    
    let postsCortados, desde, hasta;
    postsCortados = cortarPosts(postsArray, req.query.skip, req.query.limit);
    desde = req.query.skip;
    hasta = req.query.limit;
    postsCortados.forEach(element => { element = Object.assign(element, {userActual: req.user.name}); });
    const paginacion = { desde, hasta, maximo: postsArray.length, valor }
    res.status(200).render("posts/index", {
      posts: postsCortados,
      paginacion,
      title: `Edicion / vista de Posts`,
      mostrarPosts
    });

  } catch (error) {
      console.log("Error en paginacion", error);
  }
}

const modificarPaginacion = async(req, res = response)=>{
  try {
    if (req.query.myPosts){//BUSQUEDA POR USER(actual)
      postsArray = await Post.find( { user: res.locals.user.name }).lean();     
      mostrarPosts = 'myPosts';
    }else if(req.query.editable){//Editables
      postsArray = await Post.find({ $or: [ {user: res.locals.user.name} , { user: undefined} ] }).lean();
      mostrarPosts = 'editable';
      
    }else{ //Busqueda comun(total):
      postsArray = await Post.find({}).lean();
      mostrarPosts = '';
    }

    let maximoExcedido = false;
    paginacionBoolean = true;
    if (req.body.paginacionValor){
      if (req.body.paginacionValor > 20){
        valor = 20;
        maximoExcedido = true;
      }else
        valor = req.body.paginacionValor;
    }
    let postsCortados = cortarPosts(postsArray, 0, valor);
    postsCortados.forEach(element => { element = Object.assign(element, {userActual: req.user.name}); });
    const paginacionTwo = { desde:0, hasta:valor, maximo: postsArray.length, valor }
    res.status(200).render("posts/index", {
      posts: postsCortados,
      paginacion: paginacionTwo,
      maximoExcedido,
      mostrarPosts
    } )
  } catch (error) {
    console.log("Error en modificar paginacion.", error);
  }
}

// SHOW

const showPost = async (req, res = response) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).lean();
    if (post === null) res.redirect("/");
    res.render("posts/show", {
      title: `Informacion del Blog: ${post.title}`,
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
        else{
          console.log("No se puede borrar este elemento, verifique su usuario");
          res.status(400).redirect(req.headers.referer);
        }
        res.status(200).redirect(req.headers.referer);
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

const tituloDuplicado = async(titulo) =>{
  try {
    auxBoolean = false;
    // {title: {$regex: titulo, $options 'i'}}
    //Buscamos el titulo, indistintamente si es con mayus o no /{{title}}/i
    await Post.exists({ title: new RegExp(titulo, 'i')}).then( result =>{
      if (result){
        auxBoolean= true;
      }else
        auxBoolean = false;
    }).catch(err=>{ console.log("Error en PROMISE Duplicado",err); return err; })

    return auxBoolean;
    
  } catch (error) {
    console.log("ERROR EN CB TituloDUplicado", error);
  }

}

const actualizarTotal = async (userActual)=>{
    try {
      const userUpdate = await Auth.findOne({name: userActual}).lean();
      console.log(userUpdate);
      await Auth.findOneAndUpdate({name:userActual}, {totalPosts: userUpdate.totalPosts + 1});
    }
    catch (error) {
        console.log(`Error en actualizarTotal `, error)
    }
}

// CREATE
const createPost = async (req = request, res = response) => {
    try {
        let errorTitle= false;
        let errorDuplicado = false;
        let errorBody = false;
        let valorBody, valorTitle;
        valorBody = ''; valorTitle = '';
        let post = new Post();
        //Errores mostrar:
        if (req.body.title == '' && req.body.body == null){
          res.status(400).render('posts/new', {errorTitle:true, errorBody:true, valorBody, valorTitle });
        }else if(req.body.title == ''){
          res.status(400).render('posts/new', {errorDuplicado, errorTitle:true, errorBody, valorBody:req.body.body , valorTitle });
        }else if (req.body.body == ''){
          res.status(400).render('posts/new', {errorDuplicado,  errorTitle, errorBody:true, valorTitle:req.body.title, valorBody });
        }
        if (await tituloDuplicado(req.body.title)){
          res.status(400).render('posts/new', {errorDuplicado:true ,errorTitle, errorBody, valorTitle, valorBody: req.body.body});
        }
//Creacion del POST
        if (req.body.title && req.body.body && !(await tituloDuplicado(req.body.title)) ){
          post.title = req.body.title;
          post.body = req.body.body;
          //Casos opcionales guardar:
            if (req.body.guardarUser){
              post.user = req.user.name;
              await actualizarTotal(req.user.name);
            }if (req.body.guardarFecha)
              post.fecha = "Creado el: " + new Date().toLocaleString();
            if (req.body.emoji)
              post.emoji = req.body.emoji;
          post = await post.save();
          res.status(200).redirect(`/posts/${post.slug}`);
        }
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
          res.status(200).redirect('/home')
        }
    } catch (error) {
        console.log('Show Edit Post', error)
    }
}

const masDeUnTitulo = async(titulo)=>{
  try {
    await Post.find({ title: new RegExp(titulo, 'i')}).then( result =>{
      if (result.length > 1){
        auxBoolean= true;
      }else
        auxBoolean = false;
    }).catch(err=>{ console.log("Error en PROMISE mas de un titulo",err); return err; })    

  } catch (error) {
    console.log("ERROR EN CALLBACK: masdeuntitulo", error);
  }

}

const editPost = async (req, res = response) => {
  try {
    let post = await Post.findById(req.params.id);

    if (post.user == null || post.user === req.user.name){
      if ((post.title != post.body.title) && !( await masDeUnTitulo(req.body.title))){
        post.title = req.body.title;
      }else{
        console.log("TITULOS DUPLICADOS") //ToDo: llevar a alerta en front.
        req.flash('isAuthenticated_error', "TITULOS DUPLICADOS, no se pudo editar");
        res.status(400).redirect('/home')
        // res.redirect(`/posts/edit/${req.params.id}`);
      }
      post.body = req.body.body;

      if (req.body.guardarFecha)
        post.fecha = "Editado el: " + new Date().toLocaleString();
      else
        post.fecha = post.fecha;
      if (req.body.emoji)
        post.emoji = req.body.emoji;
      post = await post.save();
      //res.redirect(`/posts/edit/${post._id}`);
      res.status(200).redirect(`/posts/${post.slug}`);
    }
    else{
      console.log('Incapaz de editar el Post, verifique su usario');
      res.status(400).redirect('/home');
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
  getPostsPaginacion,
  modificarPaginacion
};
