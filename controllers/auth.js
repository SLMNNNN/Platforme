const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    server: process.env.DATABASE_SERVER,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: 'test',
    
});

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).render('login', {
                message: "veuillez fournir un email et mot de pass"
            });
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).render('login', { message: 'Server error' });
            }

            if (!results || results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
                return res.status(401).render('login', {
                    message: 'Email ou mot de passe est  incorrect'
                });
            }

            const { id, role } = results[0];
            const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });

            const cookieExpiresInDays = parseInt(process.env.JWT_COOKIE_EXPIRES, 10) || 7;
            const cookieOptions = {
                expires: new Date(Date.now() + cookieExpiresInDays * 24 * 60 * 60 * 1000),
                httpOnly: true
            };

            res.cookie('userSave', token, cookieOptions);

            // Redirect based on role
            if (role === 'enseignant') {
                return res.redirect('/exam'); // adjust to your route
            } else {
                return res.redirect('/exam2'); // student default
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).render('login', { message: 'quelque chose s\'est mal passé' });
    }
}