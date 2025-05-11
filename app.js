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

db.connect( (err) => {
    if (err){
        console.log(err)
    }else{
        console.log('Connected to database...')
    }
});



  
app.listen(3000, () => {
    console.log("Server is running on port 3000");
})