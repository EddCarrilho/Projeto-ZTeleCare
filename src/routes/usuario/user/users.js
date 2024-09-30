require("dotenv").config();
const express = require("express");
const router = express.Router();
const data = require("../../../database/config.js")
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const round = Number(process.env.SALT)
const jwt = require("jsonwebtoken");
const { sendEmail, mailTemplate } = require("../../utilidade/enviarEmail.js");
const con = require("../../../database/config.js");

router.get("/listar",(req,res)=>{
    data.query("select * from usuario", req.params.id, (error,dados)=>{
        if(error){
            return res.status(500).send({msg:"Erro ao selecionar os dados", error})
        }
        return res.status(200).send({msg:"OK",payload:dados})
    });
});

router.post("/cadastrar", (req, res) => {
  let sh = req.body.senha;

  bcrypt.hash(sh, round, (error, crypt) => {
      if (error) {
          return res.status(500).send({ msg: "Erro ao tentar cadastrar", error });
      }
      
      req.body.senha = crypt;
      const { nome, cpf, datadenascimento, telefone, email, senha } = req.body;

      const query = `INSERT INTO usuario (nome, cpf, datadenascimento, telefone, email, senha)
                     VALUES ($1, $2, $3, $4, $5, $6)`;
      const values = [nome, cpf, datadenascimento, telefone, email, req.body.senha];

      data.query(query, values, (error, result) => {
          if (error) {
              return res.status(500).send({ msg: "Erro ao tentar cadastrar", error });
          }
          res.status(201).send({ msg: "Ok", payload: result });
      });
  });
});

router.post("/cadastrar2", (req, res) => {
  let sh = req.body.senha;

  bcrypt.hash(sh, round, (error, crypt) => {
      if (error) {
          return res.status(500).send({ msg: "Erro ao tentar cadastrar", error });
      }
      
      req.body.senha = crypt;
      const { nome, cpf, especialidade, email, telefone, senha } = req.body;

      const query = `INSERT INTO medico (nome, cpf, especialidade, email, telefone, senha)
                     VALUES ($1, $2, $3, $4, $5, $6)`;
      const values = [nome, cpf, especialidade, email, telefone, req.body.senha];

      data.query(query, values, (error, result) => {
          if (error) {
              return res.status(500).send({ msg: "Erro ao tentar cadastrar", error });
          }
          res.status(201).send({ msg: "Ok", payload: result });
      });
  });
});

router.get("/buscarporusuario/:usuario",(req,res)=>{
    const usuario = req.params.usuario
    data.query("select * from usuario where nome=$1", [usuario], (error,dados)=>{
        if(error){
            return res.status(500).send({msg:"Erro ao selecionar os dados"})
        }
        return res.status(200).send({msg:"OK",payload:dados})
    });
});

router.get("/buscarporcpf/:cpf",(req,res)=>{
    const cpf = req.params.cpf;
    data.query("select * from usuario where cpf=$1", [cpf], (error,dados)=>{
        if(error){
            return res.status(500).send({msg:"Erro ao selecionar os dados"})
        }
        return res.status(200).send({msg:"OK",payload:dados})
    });
});

router.get("/buscarporcpf2/:cpf",(req,res)=>{
  const cpf = req.params.cpf;
  data.query("select * from medico where cpf=$1", [cpf], (error,dados)=>{
      if(error){
          return res.status(500).send({msg:"Erro ao selecionar os dados"})
      }
      return res.status(200).send({msg:"OK",payload:dados})
  });
});

router.get("/buscarportelefone/:telefone",(req,res)=>{
  const telefone = req.params.telefone;
    data.query("select * from usuario where telefone=$1", [telefone], (error,dados)=>{
        if(error){
            return res.status(500).send({msg:"Erro ao selecionar os dados"})
        }
        return res.status(200).send({msg:"OK",payload:dados})
    });
});

router.get("/buscarporemail/:email",(req,res)=>{
    const email = req.params.email;
    data.query("select * from usuario where email=$1", [email], (error,dados)=>{
        if(error){
            return res.status(500).send({msg:"Erro ao selecionar os dados"})
        }
        return res.status(200).send({msg:"OK",payload:dados})
    });
});

router.get("/buscarporemail2/:email",(req,res)=>{
  const email = req.params.email;
  data.query("select * from medico where email=$1", [email], (error,dados)=>{
      if(error){
          return res.status(500).send({msg:"Erro ao selecionar os dados"})
      }
      return res.status(200).send({msg:"OK",payload:dados})
  });
});

router.post("/login",(req,res)=>{
    let sh = req.body.senha;
    const email = req.body.email;
    const cpf = req.body.cpf;

    data.query("select * from usuario where email=$1 and cpf=$2",[email, cpf],(error,result)=>{
        if(error || result.rows.length === 0){
            return res.status(400).send({msg:"Email, CPF ou senha incorretos"})
        } 

        bcrypt.compare(sh,result.rows[0].senha,(err, same)=>{
            if(err){
                return res.status(500).send({msg:"Erro ao processar o login"})
            }
            else if(same==false){
                return res.status(400).send({msg:"Email, CPF ou senha incorretos"})
            }
            else{

                let token = jwt.sign({idusuario:result.rows[0].idusuario,nomeusuario:result.rows[0].nomeusuario},
                    process.env.JWT_KEY,{expiresIn:"1d"})


                res.status(200).send({msg:"Autenticado", token:token})
            }
        })
    });
});

router.post("/login2",(req,res)=>{
  let sh = req.body.senha;
  const email = req.body.email;
  const cpf = req.body.cpf;
  data.query("select * from medico where email=$1 and cpf=$2",[email, cpf],(error,result)=>{
      if(error || result.rows.length === 0){
          return res.status(400).send({msg:"Email, CPF ou senha incorretos",})
      } 

      bcrypt.compare(sh,result.rows[0].senha,(err, same)=>{
          if(err){
              return res.status(500).send({msg:"Erro ao processar o login"})   
          }
          else if(same==false){
              return res.status(400).send({msg:"Email, CPF ou senha incorretos"})
          }
          else{

              let token = jwt.sign({idmedico:result.rows[0].idmedico,nomemedico:result.rows[0].nomemedico},
                  process.env.JWT_KEY,{expiresIn:"1d"})


              res.status(200).send({msg:"Autenticado", token:token})
          }
      })
  });
});

router.get("/buscarportoken/:token",(req,res)=>{
  const token = req.params.token
  data.query(`select * from reset_token where token='${token}'`, (error,dados)=>{
      if(error){
          return res.status(500).send({msg:"Erro ao selecionar os dados"})
      }
      return res.status(200).send({msg:"OK",payload:dados})
  });
});

router.post("/esqueceuasenha", async (req, res) => {
    try {
      const email = req.body.email;
      const user = await data.pesquisar_email(email);
  
      if (!user || user.length === 0) {
        res.json({
          success: false,
          message: "Email inválido ou inexistente",
        });
        return res.status(400).send()
      } else {
        const token = crypto.randomBytes(20).toString("hex");
        const resetToken = crypto
          .createHash("sha256")
          .update(token)
          .digest("hex");
        const idUsuario = user[0].idusuario;
        await data.token_esqueceu_senha(idUsuario, resetToken);
  
        const mailOption = {
          email: email,
          subject: "Esqueceu a Senha(NÃO RESPONDA)",
          message: mailTemplate(
            "Você recebeu um link para resetar sua senha, clique no link abaixo para resetar sua senha.",
            `http://127.0.0.1:5510/front/html/resetarsenha.html?id=${user[0].idusuario}&token=${resetToken}`,
            //`${process.env.HOST_NAME}/resetPassword?id=${user[0].id}&token=${resetToken}`,
            "Resetar Senha"
          ),
        };
        await sendEmail(mailOption);
        res.json({
          success: true,
          message: "Um link de redefinição de senha foi enviado para seu e-mail.",
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

  router.post("/resetarsenha", async (req, res) => {
    try {
      const { senha, token, userId } = req.body;
      const userToken = await data.pegar_senha_reset_token(userId);
      if (!res || res.length === 0) {
        res.json({
          success: false,
          message: "Ocorreu um Erro",
        });
        return res.status(500);
      } else {
        const currDateTime = new Date();
        const expiraEm = new Date(userToken.expira_em);
        if (currDateTime > expiraEm) {
          res.json({
            success: false,
            message: "Link está expirado",
          });
          return res.status(400);
        } else if (userToken.token !== token) {
          res.json({
            success: false,
            message: "Link inválido",
          });
          return res.status(400);
        } else {
          await con.atualizar_senha_reset_token(userId);
          const salt = await bcrypt.genSalt(round);
          const hashedPassword = await bcrypt.hash(senha, salt);
          await con.atualizar_user_senha(userId, hashedPassword);
          res.json({
            success: true,
            message: "Sua senha foi resetada!",
          });
          return res.status(200);
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

module.exports = router