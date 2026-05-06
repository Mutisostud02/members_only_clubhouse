const Express = require('express')
const app = Express()
const path = require('path')
const session = require('express-session')
const passport = require('passport')
require('dotenv').config()

const pool = require('./config/db/pool.js')
const pgStore = require('connect-pg-simple')(session)

const sessionStore = new pgStore({
    pool: pool,
    tableName: 'session',
    createTableIfMissing: true
})

app.use(session({
    store: sessionStore,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60 * 60 * 1000}
}))

// ❌ saveUninitialized: true → avoid as it makes sessions for every visitor even for a non logged in user
// ❌ Don’t forget to destroy session on logout
//session length is short
require('./config/passport.js')

app.use(passport.session())

const PORT = process.env.PORT || 3000;

app.use(Express.static(path.join(__dirname, 'public')))
app.use(Express.urlencoded({extended: true}))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


const indexRoute = require('./routes/index.js')
const loginRoute = require('./routes/login.js')
const signupRoute = require('./routes/signup.js')
const protectedRoute = require('./routes/protected-route.js')


app.use('/', indexRoute)
app.use('/sign-up', signupRoute)
app.use('/log-in', loginRoute)
app.use('/protected-route', protectedRoute)


app.listen(PORT, (err) => {
    if(err) {
        throw err;
    }

    console.log(`Server running at port ${PORT}`)
})