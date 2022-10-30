const express = require('express');
const { showHomeAllPosts } = require('../controllers/home');
const routerHome = express.Router()


routerHome.get('/home/', showHomeAllPosts);

module.exports = {
    routerHome
}






