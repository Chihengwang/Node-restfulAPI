
const express = require('express');
const router= express.Router();
const mongoose=require('mongoose');
const User = require('../models/user');
//use bcrypt package to encrypt our password
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const checkAuth= require('../middleware/check-auth')

const UserController= require('../controllers/users');

router.get('/',UserController.user_get_all);

router.post('/signup',UserController.user_signup);

router.post('/login',UserController.user_login);

router.delete('/:userId',checkAuth,UserController.user_delete);

module.exports=router;
