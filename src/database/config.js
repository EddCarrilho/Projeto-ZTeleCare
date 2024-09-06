require("dotenv").config();
const fs = require('fs');
const mysql = require('mysql2'); // ou use 'mysql' se for a biblioteca que você já usa

// Carregar o certificado SSL para a conexão MySQL
const sslCert = fs.readFileSync(process.env.SSL_CA_PATH);

// Configurar a conexão ao MySQL com SSL
const con = mysql.createConnection({
    host: process.env.HOST_DATABASE,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
    ssl: {
      ca: sslCert // Carrega o certificado SSL
    }
  });

// Verificar a conexão ao banco de dados
con.connect((err) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err.stack);
      return;
    }
    console.log('Conectado ao banco de dados como ID ' + con.threadId);
  });

module.exports = con;