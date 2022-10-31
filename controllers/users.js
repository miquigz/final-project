const { response } = require("express");
const Post = require("../models/posts");
const Auth = require("../models/auth");

const getAllUsers = async (req, res = response)=>{
    try {
        const usersTotalList = await Auth.find({}).lean();

        let usersList = usersTotalList.forEach( (ele)=>{

        });

        forEach(element => {
            element = { name, email};
        });
        

        res.render('users/usersList');
    } catch (error) {
        
    }
}


module.exports = {
    getAllUsers
}