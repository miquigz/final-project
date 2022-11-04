// const app = require('express')()
const express = require('express')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
require('dotenv').config()
require('./config/passport')

const flash = require('connect-flash');

const { dbConnection } = require('./database/config')
const { routerAuth } = require('./routes/auth')
const { routerDev } = require('./routes/db')
const { routerPosts } = require('./routes/posts')
const { routerHome } = require('./routes/home')


// Inicializo la aplicación de express
const app = express()

// Conectar a la DB
dbConnection()

//----- HANDLEBARS & Helpers
let hbs = require('express-handlebars');
const { routerUsers } = require('./routes/users')

const helpers = require('handlebars-helpers')();

app.engine('hbs', hbs.engine({
    helpers: {
        helpers
    },
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
        store: MongoStore.create({ mongoUrl: process.env.DB_REMOTA_URI})
    })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req, res, next)=>{
    if (req.user){
        res.locals.usuario = {
            name: req.user.name,
            slug: req.user.slugUser
        }
    }else
        res.locals.usuario = null;
    next();
})

//Variables de entorno (Globales)
app.use((req, res, next)=>{
    res.locals.signup_bien  = req.flash('signup_bien');
    res.locals.signup_userExist = req.flash('signup_userExist');
    res.locals.isAuthenticated_error = req.flash('isAuthenticated_error');
    //User Variables
    res.locals.user = req.user || null; //si esto logged(existe req.user), guardo variable, sino null.
    //Configuraciones ocultar/mostrar
    res.locals.mostrar;
    res.locals.mostrarConfig;
    res.locals.mostrarCarrousel;
    res.locals.signin_error = req.flash('error');
    next();
})

// Routes
app.use('/', routerAuth);
app.use('/', routerDev); // Solo para desarrollo
app.use('/', routerPosts);
app.use('/', routerHome);
app.use('/', routerUsers);



const PORT = process.env.PORT;
app.listen(PORT, err => {
    if ( err )
        throw new Error('Ocurrió un problema con el servidor: ', err);
    console.log(`-- Servidor express escuchando en el puerto ${PORT}`);
})
