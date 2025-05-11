const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({
    path: "./config.env",
})


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    server: process.env.DATABASE_SERVER,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    jwt:process.env.JWT_SECRET
    
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



exports.register = (req, res) => {
    console.log(req.body);

    const { name, prenom, fil, etab, role , sexe , email, password , passwordConfirm} = req.body;

    db.query('SELECT email FROM userss WHERE email = ?', [email], async(err, results) => {
        if (err) {
            console.log(err);
        }
        if (results.length > 0) {
            return res.render('register', {
                message:'cet e-mail est déjà utilisé'
            });
        }else if(password !== passwordConfirm){
            return res.render('register', { 
                message: 'les mots de passe ne correspondent pas'
            });
        }
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        
        db.query('INSERT INTO userss SET ?', { name: name , prenom:prenom , fil:fil, etab:etab , role:role , sexe:sexe , email: email, password: hashedPassword, }, (err, results) =>{
            if (err) {
                console.log(err);
            }else{
                console.log(results)
                return res.render('register',{
                    message: 'Utilisateur crée'
                });
            }
        });
    });
}