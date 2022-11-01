const express = require('express');
const { showHomeAllPosts, actualizarCondiciones, actualizarTema, switchConfig, switchCarrousel } = require('../controllers/home');
const routerHome = express.Router()


routerHome.get('/home/', showHomeAllPosts);
routerHome.get('/home/switchConfig', switchConfig);
routerHome.get('/home/switchCarrousel', switchCarrousel);

routerHome.post('/home/actualizarCondiciones', actualizarCondiciones);
routerHome.post('/home/actualizarTema', actualizarTema);

module.exports = {
    routerHome
}






