require("dotenv").config();
const fs = require('fs');
const mysql = require('mysql2');

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

con.pesquisar_email = (email) => {
    const query = `SELECT * FROM dbprojeto.usuario where email="${email}";`;
    return con.promise().query(query)
    .then(([results]) => {
      return results;  // Retorna os resultados da consulta
    })
    .catch((error) => {
      console.error("Erro ao executar a consulta:", error);
      throw error;  // Lança o erro para ser tratado em outro lugar
    });
};

con.token_esqueceu_senha = (id, token) => {
  const criadoem = new Date().toISOString();
  const expiraem = new Date(Date.now() + 60 * 60 * 24 * 1000).toISOString();
  const query = `INSERT INTO reset_token(token, criado_em, expira_em, user_id) VALUES('${token}', '${criadoem}', '${expiraem}', ${id})`;
  return con.promise().query(query)
  .then(([results]) => {
    return results;  // Retorna os resultados da consulta
  })
  .catch((error) => {
    console.error("Erro ao executar a consulta:", error);
    throw error;  // Lança o erro para ser tratado em outro lugar
  });
};

con.pegar_senha_reset_token = (id) => {
  const query = `SELECT token, expires_at from reset_tokens WHERE user_id = ${id} ORDER BY created_at DESC LIMIT 1;`;
  return execute(query);
};

con.atualizar_senha_reset_token = (id) => {
  const query = `DELETE FROM reset_tokens WHERE user_id = ${id}`;
  return execute(query);
};

con.atualizar_user_senha = (id, password) => {
  const query = `UPDATE details SET password = '${password}' WHERE id = ${id}`;
  return execute(query);
};

module.exports = con;