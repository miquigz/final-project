const isAuthenticated = (req, res, next)=>{
    if (req.isAuthenticated()){
        return next()
    }else{
        req.flash('isAuthenticated_error', "Acceso no autorizado");
        res.redirect('/auth/signin')
    }
}

module.exports = isAuthenticated;