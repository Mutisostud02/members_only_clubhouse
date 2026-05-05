const { body, validationResult } = require('express-validator');
const { addUser } = require('../config/db/query.js');
const bcrypt = require('bcryptjs')

const signupValidation = [
  body('firstname')
    .trim()
    .notEmpty()
    .withMessage('Firstname is required')
    .isLength({ min: 2, max: 20 })
    .withMessage('Firstname must be between 2 and 20 characters'),

  body('lastname')
    .trim()
    .notEmpty()
    .withMessage('Lastname is required')
    .isLength({ min: 2, max: 20 })
    .withMessage('Lastname must be between 2 and 20 characters'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Must include a number')
    .matches(/[A-Z]/)
    .withMessage('Must have one uppercase letter')
    .matches(/[!@#$%^&*]/)
    .withMessage('Must have a special character')
];

async function signupController(req, res) {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).render("sign-up", {errors: errors.array(),})
    }

    const { firstname, lastname, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(`Database updated successfully ${firstname} ${lastname}`)
    await addUser(firstname, lastname, email, hashedPassword);
    res.redirect("/log-in")
    //successful
}

module.exports = { signupValidation, signupController }