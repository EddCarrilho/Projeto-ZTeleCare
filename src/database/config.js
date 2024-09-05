require("dotenv").config();
const mysql = require("mysql2");

const con = mysql.createConnection({
    host:process.env.HOST_DATABASE,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    port:process.env.DATABASE_PORT,
    database:process.env.DATABASE_NAME
});
module.exports = con;