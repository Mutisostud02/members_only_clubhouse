const { Pool } = require('pg')
require('dotenv').config()

module.exports = new Pool({
    host : process.env.DBHOST,
    user : process.env.DBUSER,
    password : process.env.DBPASSWORD,
    port : process.env.DBPORT,
    database : process.env.DB
})