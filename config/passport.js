const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const { getUserByEmail } = require('./db/query.js')
const bcrypt = require('bcryptjs')
const pool = require('./db/pool.js')
const verifyCallback = async (email, password, done) => {
    try {
        const user = await getUserByEmail(email);

        if(!user) {
            return done(null, false, {message: "PASSPORT_EMAIL_NOT_FOUND"})
        }

        const match = await bcrypt.compare(password, user.password)

        if(!match) {
            return done(null, false, {message: "Invalid password"})
        }
        console.log("EMAIL RECEIVED:", email);
        console.log("PASSWORD RECEIVED:", password);
       return done(null, user)

    } catch (err){
        done(err)
    }
}

passport.use(new LocalStrategy({usernameField: 'email'}, verifyCallback))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id])
        const user = rows[0]
        
        return done(null, user)
    } catch (err) {
        return done(err)
    }
})
