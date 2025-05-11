const dotenv = require("dotenv");
const express = require("express");
const mysql = require("mysql");
const path = require("path");
const cookieParser = require("cookie-parser");

dotenv.config({
    path: "./config.env",
})

const app = express();


const db =mysql.createConnection({
    host: process.env.DATABASE_HOST,
    server: process.env.DATABASE_SERVER,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false}));
app.set('view engine', 'hbs')
app.use(express.json());//new
app.use(cookieParser());//new

app.post('/login',()=>{
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token })
})

db.connect( (err) => {
    if (err){
        console.log(err)
    }else{
        console.log('Connected to database...')
    }
});


app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
  
app.listen(3000, () => {
    console.log("Server is running on port 3000");
})