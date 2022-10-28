// const app = require('express')()
const express = require('express')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
require('dotenv').config()
require('./config/passport')

const { dbConnection } = require('./database/config')
const { routerAuth } = require('./routes/auth')
const { routerDev } = require('./routes/db')
const { routerPosts } = require('./routes/posts')

// Inicializo la aplicación de express
const app = express()

// Conectar a la DB
dbConnection()

// Template Engine
// app.engine('hbs', ))
// app.set('view engine', 'hbs')
// app.set('views', './views')

// const { engine } = require('express-handlebars')




let hbs = require('express-handlebars');
const { routerHome } = require('./routes/home')
// hbs.create({
//     helpers: {
//         isInRange: function (value) {
//             return (value >= rangeFirst && value <= rangeLast);
//         },
//         sayHello: function(){
//             return alert('hello')
//         }
//     }
// });
// app.engine('handlebars', hbs.create({
//     helpers:{
//     math: function(lvalue, operator, rvalue) {lvalue = parseFloat(lvalue){
//         rvalue = parseFloat(rvalue);
//         return {
//             "+": lvalue + rvalue,
//             "-": lvalue - rvalue,
//             "*": lvalue * rvalue,
//             "/": lvalue / rvalue,
//             "%": lvalue % rvalue
//         }[operator];
//     }
//     }
// }}));

const helpers = require('handlebars-helpers')();
app.engine('hbs', hbs.engine({
    helpers: helpers,
    extname: '.hbs'
}));
app.set('view engine', 'hbs')
app.set('views', './views')




// Middlewares
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: process.env.DB_LOCAL_URI})
    })
)
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/', routerAuth);
app.use('/', routerDev); // Solo para desarrollo
app.use('/', routerPosts);
app.use('/', routerHome);


const PORT = process.env.PORT;
app.listen(PORT, err => {
    if ( err )
        throw new Error('Ocurrió un problema con el servidor: ', err);
    console.log(`-- Servidor express escuchando en el puerto ${PORT}`);
})
