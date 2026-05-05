const { body, validationResult } = require('express-validator')

const loginValidation = [
    body('email')
    .isEmail()
    .withMessage('Invalid email')
    .normalizeEmail(), 
    
    body('password')
    .notEmpty()
    .withMessage('Password is required')
]

function loginController(req, res, next) {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(400).render("log-in", {
            errors: errors.array(),
            data: req.body
        })
    }

    next()
}


module.exports = { loginValidation, loginController }