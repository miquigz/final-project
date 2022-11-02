const { response } = require("express");
const Auth = require("../models/auth");

const getAllUsers = async (req, res = response)=>{
    try {
        let ordenActual = '';
        let usersTotalArray;
        if (req.query.alphabet){
            usersTotalArray = await Auth.find({}, { password:0, _id:0 }).sort({name:1}).lean();
            ordenActual = 'alphabet';
        }else if (req.query.dateOld){
            usersTotalArray = await Auth.find({}, { password:0, _id:0 }).sort({createdAt: 1}).lean();
            ordenActual = 'dateOld'
        }else if (req.query.dateRecent){
            usersTotalArray = await Auth.find({}, { password:0, _id:0 }).sort({createdAt: -1}).lean();
            ordenActual = 'dateRecent'
        }
        else
            usersTotalArray = await Auth.find({}, { password:0, _id:0 }).lean();
        
        usersTotalArray.forEach( (ele) =>{
            ele.createdAt = ele.createdAt.toLocaleDateString();
        })
        res.render('users/usersList', {
            users: usersTotalArray,
            title: 'Total Usuarios',
            ordenActual
        });
    } catch (error) {
        console.log("ERROR EN getAllUsers", error)
    }
}

const getSpecificUser = async(req, res = response)=>{
    try {
        let slugBuscar = req.params.slug;
        Auth.find({ slugUser:slugBuscar} , { password:0, _id:0} ).lean().then( async (result)=>{
            result = result.slice()[0];//quitamos array q nos devuelve
            result.createdAt = result.createdAt.toLocaleDateString();
            result.updatedAt = result.updatedAt.toLocaleString();
            res.status(200).render('users/user', {
                user: result,
                title: `${result.name}`,
                editar: res.locals.user.slugUser === result.slugUser
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


module.exports = {
    getAllUsers,
    getSpecificUser,
    putSpecificUserEdit,
    getEditSpecificUser
}