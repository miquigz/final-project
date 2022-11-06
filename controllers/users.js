const { response } = require("express");
const Auth = require("../models/auth");
const Posts = require("../models/posts");
let ordenActual = '';
let usersTotalArray;

const sortUsers = async (query, searchByUser = false)=>{
    try {
        let auxTotal = [];
        if (query.alphabet){
            if(searchByUser)
                auxTotal = await Auth.find({name: searchByUser}, { password:0, _id:0 }).sort({name:1}).lean();
            else
                auxTotal = await Auth.find({}, { password:0, _id:0 }).sort({name:1}).lean();
            ordenActual = 'alphabet';
        }else if (query.dateOld){
            if(searchByUser)
                auxTotal = await Auth.find({name: searchByUser}, { password:0, _id:0 }).sort({createdAt: 1}).lean();
            else
                auxTotal = await Auth.find({}, { password:0, _id:0 }).sort({createdAt: 1}).lean();
            ordenActual = 'dateOld';
        }else if (query.dateRecent){
            if(searchByUser)
                auxTotal = await Auth.find({name: searchByUser}, { password:0, _id:0 }).sort({createdAt: -1}).lean();
            else
                auxTotal = await Auth.find({}, { password:0, _id:0 }).sort({createdAt: -1}).lean();
            ordenActual = 'dateRecent';
        }
        else{
            if(searchByUser)
            auxTotal = await Auth.find({name:searchByUser}, { password:0, _id:0 }).lean();
            else
                auxTotal = await Auth.find({}, { password:0, _id:0 }).lean();
        }
        return auxTotal;
    } catch (error) {
        console.log("error en CallBack: sortUsers", error);
    }
}

const getAllUsers = async (req, res = response)=>{
    try {
        usersTotalArray = await sortUsers(req.query, req.query.userName);
        
        if(usersTotalArray.length > 0){
            usersTotalArray.forEach( (ele) =>{
                ele.createdAt = ele.createdAt.toLocaleDateString();
            })
        }
        res.render('users/usersList', {
            users: usersTotalArray,
            title: 'Total Usuarios',
            searchByUser: req.query.userName || null,
            ordenActual,
            searchByUser:req.query.userName
        });
    } catch (error) {
        console.log("ERROR EN getAllUsers", error)
    }
}

const getSpecificUser = async(req, res = response)=>{
    try {
        let slugBuscar = req.params.slug;
        await Auth.find({ slugUser:slugBuscar} , { password:0, _id:0} ).lean().then( async (result)=>{
            result = result.slice()[0];//quitamos array q nos devuelve
            result.createdAt = result.createdAt.toLocaleDateString();
            result.updatedAt = result.updatedAt.toLocaleString();
            let postLikeados = [];
            let misPosts = await Posts.find({user:result.name}).lean();
            if (result.totalLikesPosts){
                postLikeados = await Posts.find({slug: result.totalLikesPosts}).lean();
            }
            res.status(200).render('users/user', {
                user: result,
                title: `${result.name}`,
                editar: res.locals.user.slugUser === result.slugUser,
                postLikeados,
                misPosts
            });
        }).catch( (err)=>{
            console.log("error en busqueda de user", err);
            res.status(400).render('error/error', {
                errDesc:'Reintente de nuevo su busqueda',
                errorTitle: 'Error en busqueda de usuario'
            })
        })
    } catch (error) {
        console.log("ERROR EN getSpecificUser", error)
    }
}

const getEditSpecificUser = async(req, res)=>{
    try {
        await Auth.find({ slugUser:req.params.slug} , { _id:0} ).lean().then( async (result)=>{
            user = result.slice()[0];
            res.status(200).render('users/userEdit', {
                title: `Editar ${user.name}`,
                user
            });
        }).catch( (err)=>{
            console.log("error en mostrar edicion del usuario", err);
            res.status(400).render('error/error', {
                errDesc:'Reintente de nuevo su edicion.',
                errorTitle: "error en mostrar edicion del usuario"
            })
        })
    } catch (error) {
        console.log("ERROR EN getEditSpecificUser", error);
    }
}


const putSpecificUserEdit = async (req, res = response)=>{
    try {
        user = await Auth.findOne({ slugUser:req.params.slug} ).catch( (err)=>{
            console.log("error en edicion de usuario", err);
            res.status(400).render('error/error', {
                errDesc:'Reintente de nuevo su edicion.',
                errorTitle: 'Error en edicion de usuario'
            })
        })
        if (res.locals.user.slugUser === user.slugUser){
            if (req.body.name && req.body.desc){
                user.name = req.body.name;
                user.desc = req.body.desc;
            }else if(req.body.name)
                user.name = req.body.name;
            else if(req.body.desc)
                user.desc = req.body.desc;
            user = await user.save();
        }else{
            res.render('error/error', {
                errDesc:'Incapaz de editar usuario',
                errorTitle: "Asegurese de iniciar sesion"
            })
        }
        res.status(200).redirect(`/user/${user.slugUser}`);
    } catch (error) {
        console.log("ERROR EN putSpecificUserEdit", error)
    }
}

const getSearchUsers = async (req, res)=>{
    try {
        if (ordenActual){
            res.redirect(`/users/?${ordenActual}=true&userName=${req.query.userName}`);
        }else
            res.redirect(`/users/?userName=${req.query.userName}`);
    } catch (error) {
        console.log(`Error en getSearchUsers `, error)
    }
}


module.exports = {
    getAllUsers,
    getSpecificUser,
    getSearchUsers,
    putSpecificUserEdit,
    getEditSpecificUser,
}