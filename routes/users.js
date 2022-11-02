const express = require('express');
const { getAllUsers, getSpecificUser, putSpecificUserEdit, getEditSpecificUser } = require('../controllers/users');
const routerUsers = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated')


routerUsers.get('/users', getAllUsers);
routerUsers.get('/user/:slug', isAuthenticated, getSpecificUser);
routerUsers.get('/user/edit/:slug', isAuthenticated, getEditSpecificUser);

routerUsers.put('/user/edit/:slug', isAuthenticated, putSpecificUserEdit)

module.exports = {
    routerUsers
}