const express = require('express');
const { showHomeAllPosts, actualizarCondiciones, actualizarTema, switchConfig, switchCarrousel, redirectHome } = require('../controllers/home');
const routerHome = express.Router()


routerHome.get('/home/', showHomeAllPosts);
routerHome.get('/home/switchConfig', switchConfig);
routerHome.get('/home/switchCarrousel', switchCarrousel);
routerHome.get('/', redirectHome)

routerHome.post('/home/actualizarCondiciones', actualizarCondiciones);
routerHome.post('/home/actualizarTema', actualizarTema);

module.exports = {
    routerHome
}






