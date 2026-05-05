const loginRoute = require('express').Router()
const passport = require('passport')
const { loginValidation, loginController } = require('../controllers/login.js')

loginRoute.get('/', (req, res) => {
    if(req.isAuthenticated()) {
        return res.redirect('/success')
    }
    const message = req.session.messages?.[0]
    req.session.messages = [];
    res.render('log-in', {
        error: message,
        data: {}
    })
})

loginRoute.post(
    '/', 
    loginValidation, 
    loginController,
    passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect: '/log-in',
    failureMessage: true
})
)




module.exports = loginRoute;