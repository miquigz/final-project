const { response } = require("express");
const Post = require("../models/posts");

const showHomeAllPosts = async (req, res = response)=>{
    try {
        let postsArray = await Post.find({}).lean(); // Me deja un obj puro de JS
        const title = "Inicio - Posts";
        let homePagination = false;
        const masRecientes = {
            last: {
                post:postsArray[postsArray.length - 1],
                index:postsArray.length - 1
            },
            last2: {
                post:postsArray[postsArray.length - 2],
                index:postsArray.length - 2
            },
            last3: {
                post:postsArray[postsArray.length - 3],
                index:postsArray.length - 3
            }
        }
        let likesDelUser = {totalUserLikes: []};
        if (req.user)
            likesDelUser = {totalUserLikes: req.user.totalLikesPosts};

        
        if (req.query.skip != null && req.query.limit != null){
            let posts = postsArray.slice(req.query.skip, req.query.limit);
            const paginacion = {
                valor: 6,
                desde: req.query.skip,
                maximo: postsArray.length
            };
            if (req.user){//TODO: Refactor CB
                posts.forEach(ele => {
                    console.log("Condicion:" , ele.slug)
                    ele.slug
                    for (i = 0; i < req.user.totalLikesPosts.length; i++) {
                        if (ele.slug == req.user.totalLikesPosts[i])
                            Object.assign(ele, {liked:true})
                    }
                    Object.assign(ele, {userAct: req.user.name})
                    console.log("Condicion:" , ele.liked);
                });
            }
            homePagination = true;
            console.log(posts);
            res.status(200).render("home/home", {
                title,
                posts,
                masRecientes,
                paginacion,
                homePagination
            });
        }else{
            if (req.user){
                postsArray.forEach(ele => {
                    console.log("Condicion:" , ele.slug)
                    ele.slug
                    for (i = 0; i < req.user.totalLikesPosts.length; i++) {
                        if (ele.slug == req.user.totalLikesPosts[i])
                            Object.assign(ele, {liked:true})
                    }
                    Object.assign(ele, {userAct: req.user.name})
                    console.log("Condicion:" , ele.liked);
                });
            }
            res.status(200).render("home/home", {
                title,
                posts: postsArray,
                masRecientes,
                homePagination,
            });
        }

    } catch (error) {
        console.log('Error en HOME showHomeAllPosts', error);
    }
}

const actualizarCondiciones = async (req, res)=>{
    try {
        let enviarObject = {};
        if (res.app.locals.mostrar){
            enviarObject = res.app.locals.mostrar;
        }
        let objectAux = {
            fecha: req.body.mostrarFechas ? true : false,
            autor: req.body.mostrarAutores ? true : false,
            emoji: req.body.mostrarEmojis ? true : false
        };
        Object.assign(enviarObject, objectAux);
        res.app.locals.mostrar = enviarObject;
        res.redirect(req.headers.referer);
    } catch (error) {
        console.log("ERROR EN: Actualizar condiciones", error);
    }
}

const actualizarTema = async (req, res)=>{
    try {
        let objectAux = {};
        if (res.app.locals.mostrar)
            objectAux = res.app.locals.mostrar;
        Object.assign(objectAux, {tema: req.body.themes});
        res.app.locals.mostrar = objectAux;
        res.redirect(req.headers.referer);
    } catch (error) {
        console.log("ERROR EN ACTUALIZAR TEMA", error);
    }
}

const switchConfig = async(req, res)=>{
    try {
        // res.app.locals.mostrarConfig = res.app.mostrarConfig ? false : true
        if (res.app.locals.mostrarConfig)
            res.app.locals.mostrarConfig = false;
        else
            res.app.locals.mostrarConfig = true;
        res.redirect(req.headers.referer);
    } catch (error) {
        console.log("ERROR EN mostrarConfig", error);
    }
}

const switchCarrousel = async(req, res)=>{
    try {
        if (res.app.locals.mostrarCarrousel)
            res.app.locals.mostrarCarrousel = false;
        else
            res.app.locals.mostrarCarrousel = true;
        res.redirect(req.headers.referer);
    } catch (error) {
        console.log("ERROR EN mostrarConfig", error);
    }
}

const redirectHome = async (req, res)=>{
    try {
        res.redirect('/home')
    } catch (error) {
        console.log(`Error en redirectHome `, error)
    }
}


module.exports = {
    showHomeAllPosts,
    actualizarCondiciones,
    actualizarTema,
    switchConfig,
    switchCarrousel,
    redirectHome
}