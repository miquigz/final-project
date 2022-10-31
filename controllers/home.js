const { response } = require("express");
const Post = require("../models/posts");

const showHomeAllPosts = async (req, res = response)=>{
    try {
        let postsArray = await Post.find({}).lean(); // Me deja un obj puro de JS
        const title = "Inicio - Posts InfoBlog";
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

        if (req.query.skip != null && req.query.limit != null){
            let posts = postsArray.slice(req.query.skip, req.query.limit);
            const paginacion = {
                valor: 6,
                desde: req.query.skip,
                maximo: postsArray.length
            };
            homePagination = true;
            res.status(200).render("home/home", {
                title,
                posts,
                masRecientes,
                paginacion,
                homePagination
            });
        }else{
            homePagination = false;
            res.status(200).render("home/home", {
                title,
                posts: postsArray,
                masRecientes,
                homePagination
            });
        }

    } catch (error) {
        console.log('Error en HOME showHomeAllPosts', error);
    }
}

const actualizarCondiciones = async (req, res)=>{
    try {
        const objAux = {
            fecha: req.body.mostrarFechas ? true : false,
            autor: req.body.mostrarAutores ? true : false,
            emoji: req.body.mostrarEmojis ? true : false
        };
        // Object.assign(objAux, {fecha: );
        // Object.assign(objAux, {});
        // Object.assign(objAux, {});
        res.app.locals.mostrar = objAux;
        console.log(objAux);
        console.log(res.app.locals.mostrar);
        res.redirect('/home');
    } catch (error) {
        console.log("ERROR EN: Actualizar condiciones", error);
    }
}

const actualizarTema = async (req, res)=>{
    try {
        console.log(req.body);
        res.redirect('/home');
    } catch (error) {
        
    }
}

module.exports = {
    showHomeAllPosts,
    actualizarCondiciones,
    actualizarTema
}