const { response } = require("express");
const Auth = require("../models/auth");
const passport = require('passport');

const showAuthFormSignUp  = (req, res = response) => {
    res.render('auth/signup');
}
const signUp = async (req, res = response) => {
    const errors = [];
    const { name, email, password, confirmPassword } = req.body;

    if ( password !== confirmPassword){
        errors.push({ msg: 'Password do not match'});
        console.log("Password do not match");
    }

    if (password.length < 4 || confirmPassword.length < 4){
        console.log("Password must be at least 4 characters")
        errors.push({ msg: 'Password must be at least 4 characters'} );
    }

    if(errors.length > 0){
        return res.render('auth/signup', {
            errors,
            name,
            email
        });
    }

    const userFound = await Auth.findOne({ email:email });
    if (userFound){
        req.flash('signup_userExist', "El e-mail ingresado ya esta actualmente registrado.")
        return res.redirect('/auth/signup');
    }

    const newUser = new Auth({name, email, password});
    //Encriptamos el password q escribe el usuario para registrarse(signUp)
    newUser.password = await newUser.passwordEncrypt(password);
    await newUser.save()

    req.flash("signup_bien", "Se registro correctamente!")
    
    // await newUser.update()  otras opciones
    // await newUser.insertOne
    res.redirect('/auth/signin'); //finalmente registramos el user
}

const showAuthFormSignIn = (req, res = response) => {
    res.render('auth/signin');
}

const signin = passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/auth/signin' //Si falla redirigo de nuevo al signin
    // ,failureFlash: true,
})

const logout = async(req, res = response, next) => {
    await req.logout((err)=>{
        if(err) return next();
        res.redirect('/auth/signin');
    })
}






module.exports = {
    showAuthFormSignUp,
    signUp,
    showAuthFormSignIn,
    signin,
    logout
}