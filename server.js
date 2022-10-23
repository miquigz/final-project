const express = require('express'); //Referencia a funcion.
require('dotenv').config();

const app = express();//
//const app = require('express')();

app.get('/', (req, res)=>{
    res.send('Todo ok');
})

const PORT = process.env.PORT;

app.listen(PORT, err =>{
    if (err) 
    throw new Error('Problema con el servidor', err)
    console.log(`Servidor express escuchando en el puerto: ${PORT}`);
})