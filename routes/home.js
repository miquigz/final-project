const express = require('express');
const { showHomeAllPosts, showHomePostById } = require('../controllers/home');
const routerHome = express.Router()



routerHome.get('/home/', showHomeAllPosts);
routerHome.get('/home/:id', showHomePostById);

module.exports = {
    routerHome
}






