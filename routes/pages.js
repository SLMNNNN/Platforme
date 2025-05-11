const express = require('express');
const authController = require("../controllers/auth");
const router = express.Router();

router.get('/login',(req, res) => {
    res.render('login');
});

module.exports = router ;