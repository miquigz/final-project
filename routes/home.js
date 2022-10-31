const express = require('express');
const { showHomeAllPosts, actualizarCondiciones, actualizarTema } = require('../controllers/home');
const routerHome = express.Router()


routerHome.get('/home/', showHomeAllPosts);

routerHome.post('/home/actualizarCondiciones', actualizarCondiciones);

routerHome.post('/home/actualizarTema', actualizarTema);

module.exports = {
    routerHome
}






