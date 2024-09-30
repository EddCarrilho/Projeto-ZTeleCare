require("dotenv").config();
const fs = require('fs');
const { Client } = require('pg');

const sslCert = fs.readFileSync(process.env.SSL_CA_PATH);

// Configurar a conexão ao MySQL
const con = new Client({
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
    console.log('Conectado ao banco de dados');
  });

con.pesquisar_email = async (email) => {
    const query = `SELECT * FROM usuario where email=$1;`;
    try {
      const { rows } = await con.query(query, [email]);
      return rows;
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      throw error; 
    }
};

con.token_esqueceu_senha = async (user_id, token) => {
  const criadoem = new Date().toISOString();
  const expiraem = new Date(Date.now() + 60 * 60 * 24 * 1000).toISOString();
  const query = `INSERT INTO reset_token(token, criado_em, expira_em, user_id) VALUES($1, $2, $3, $4)`;
  try {
    const results = await con.query(query, [token, criadoem, expiraem, user_id]);
    return results; 
  } catch (error) {
    console.error("Erro ao executar a consulta:", error);
    throw error; 
  }

};

con.pegar_senha_reset_token = async (user_id) => {
  const query = `SELECT token, expira_em from reset_token WHERE user_id = $1 ORDER BY criado_em DESC LIMIT 1;`;
  try {
    const result = await con.query(query, [user_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Erro ao executar a consulta:", error);
    throw error;
  }
};

con.atualizar_senha_reset_token = async (user_id) => {
  const query = `DELETE FROM reset_token WHERE user_id = $1`;
  try {
    await con.query(query, [user_id]);
  } catch (error) {
    console.error("Erro ao executar a consulta:", error);
    throw error; // Lança o erro para ser tratado em outro lugar
  }
};

con.atualizar_user_senha = async (idusuario, senha) => {
  const query = `UPDATE usuario SET senha = $1 WHERE idusuario = $2`;
  try {
    await con.query(query, [senha, idusuario]);
  } catch (error) {
    console.error("Erro ao executar a consulta:", error);
    throw error; // Lança o erro para ser tratado em outro lugar
  }
};

module.exports = con;