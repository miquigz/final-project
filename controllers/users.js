const { response } = require("express");
const Post = require("../models/posts");
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
        
    }
}


module.exports = {
    getAllUsers
}