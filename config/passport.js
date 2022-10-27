//TODO: Traer config de DATABASE a la carpeta config


//Estrategia/config de password.
const passport = require('passport');
// const {Strategy as LocalStrategy} 
const { Strategy } = require('passport-local');
const Auth = require('../models/auth');

passport.use(
    new Strategy(
        {
            usernameField: 'email',
        },
        async(email, password, done) =>{
//TODO: Evitar repetir return, utilizar variable aux (Repetir)

            const user = await Auth.findOne({ email:email })
            if (!user){
                return done(null, false, { message: 'User not found!!'});
            }
            //envio el password que escribio el usuario para hacer un check de match(si son iguales)
            const isMatch = await user.checkPassword(password);
            if (!isMatch){
                return done(null, false, {message: 'PASSWORD ERROR'})
            }

            return done(null, user);
        }
    )
)

//Metodos, definimos donde va a buscar passport(lo utiliza passport)
passport.serializeUser((user,done) =>{
    done(null, user.id);
})

passport.deserializeUser((id,done)=>{
    Auth.findById(id, (err, user)=>{
        done(err, user);
    })
})
