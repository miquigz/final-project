const express = require('express');
const routerAuth = express.Router();

const { showAuthFormSignUp, signUp,showAuthFormSignIn, signin, logout } = require('../controllers/auth')
//Routes

routerAuth.get('/auth/signup', showAuthFormSignUp);
routerAuth.post('/auth/signup', signUp);

routerAuth.get('/auth/signin', showAuthFormSignIn);
routerAuth.post('/auth/signin', signin);

routerAuth.get('/auth/logout', logout);

module.exports = {
    routerAuth
}