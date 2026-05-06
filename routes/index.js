const { getUsers, confirmPasscode, adminAddPasscodes, adminAvailabledPasscodes } = require('../config/db/query')
const { indexHomePage, loginSuccess, logOut, applyMembership, membershipPage, adminPageController } = require('../controllers')

const indexRoute = require('express').Router()

indexRoute.get('/', indexHomePage)
indexRoute.get('/success', loginSuccess)
indexRoute.get('/log-out', logOut)
indexRoute.get('/membership', membershipPage)
indexRoute.post('/membership', applyMembership)
indexRoute.get('/admin', adminPageController)
indexRoute.post('/admin', adminAddPasscodes)

module.exports = indexRoute;