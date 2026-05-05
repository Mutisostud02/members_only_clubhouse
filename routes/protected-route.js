const protectedRoute = require('express').Router();

const { body, validationResult } = require("express-validator");
const { getAllPosts, addNewPost, getPostById } = require('../config/db/query');
const { protectedRouteUserPage, protectedRouteAddPost, protectedRouteGetPostById } = require('../controllers/protected-route');

protectedRoute.get('/', protectedRouteUserPage)
protectedRoute.post('/', protectedRouteAddPost)
protectedRoute.get('/:id', protectedRouteGetPostById)

module.exports = protectedRoute;