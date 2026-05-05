const signupRoute = require('express').Router()
const { signupValidation, signupController } = require('../controllers/signup.js')
signupRoute.get('/', (req, res) => {
    res.render("sign-up")
})
signupRoute.post('/', signupValidation, signupController)

module.exports = signupRoute;