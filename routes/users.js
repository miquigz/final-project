const express = require('express');
const { getAllUsers } = require('../controllers/users');
const routerUsers = express.Router();



routerUsers.get('/users', getAllUsers);


module.exports = {
    routerUsers
}