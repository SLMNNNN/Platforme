const express = require('express');
const authController = require("../controllers/auth");
const router = express.Router();
const { route } = require('./auth');

router.get('/',(req, res) => {
    res.render('index');
});


router.get('/login',(req, res) => {
    res.render('login');
});

router.get('/exam',(req, res) => {
    res.render('exam');
});

router.get('/exam2',(req, res) => {
    res.render('exam2');
});


router.get('/register',(req, res) => {
    res.render('register');
});



router.get('/logout', (req, res) => {
    res.render('logout'); 
});

module.exports = router ;