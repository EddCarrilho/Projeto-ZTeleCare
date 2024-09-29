require("dotenv").config();
const express = require("express");
const router = express.Router();
const data = require("../../../database/config.js")
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const round = Number(process.env.SALT)
const jwt = require("jsonwebtoken");
const { sendEmail, mailTemplate } = require("../../utilidade/enviarEmail.js");

router.get("/listar",(req,res)=>{
    data.query("select * from dbprojeto.usuario", req.params.id, (error,dados)=>{
        if(error){
            return res.status(500).send({msg:"Erro ao selecionar os dados", error})
        }
        return res.status(200).send({msg:"OK",payload:dados})
    });
});

router.post("/cadastrar",(req,res)=>{
    let sh = req.body.senha;

    bcrypt.hash(sh,round,(error,crypt)=>{
        if(error){
            return res.status(500).send({msg:"Erro ao tentar cadastrar", error})
        }
        req.body.senha = crypt;
        data.query("INSERT INTO dbprojeto.usuario set ?",req.body,(error,result)=>{
            if(error){
                return res.status(500).send({msg:"Erro ao tentar cadastrar", error})
            }
            res.status(201).send({msg:"Ok",payload:result})
        });
    });
});

router.get("/buscarporusuario/:usuario",(req,res)=>{
    data.query("select * from dbprojeto.usuario where nome=?", req.params.usuario, (error,dados)=>{
        if(error){
            return res.status(500).send({msg:"Erro ao selecionar os dados"})
        }
        return res.status(200).send({msg:"OK",payload:dados})
    });
});

router.get("/buscarporcpf/:cpf",(req,res)=>{
    data.query("select * from dbprojeto.usuario where cpf=?", req.params.cpf, (error,dados)=>{
        if(error){
            return res.status(500).send({msg:"Erro ao selecionar os dados"})
        }
        return res.status(200).send({msg:"OK",payload:dados})
    });
});

router.get("/buscarportelefone/:telefone",(req,res)=>{
    data.query("select * from dbprojeto.usuario where telefone=?", req.params.telefone, (error,dados)=>{
        if(error){
            return res.status(500).send({msg:"Erro ao selecionar os dados"})
        }
        return res.status(200).send({msg:"OK",payload:dados})
    });
});

router.get("/buscarporemail/:email",(req,res)=>{
    data.query("select * from dbprojeto.usuario where email=?", req.params.email, (error,dados)=>{
        if(error){
            return res.status(500).send({msg:"Erro ao selecionar os dados"})
        }
        return res.status(200).send({msg:"OK",payload:dados})
    });
});

router.post("/login",(req,res)=>{
    let sh = req.body.senha;
    data.query("select * from dbprojeto.usuario where email=? and cpf=?",[req.body.email,req.body.cpf,],(error,result)=>{
        if(error || result[0]==null){
            return res.status(400).send({msg:"Email, CPF ou senha incorretos"})
        }

        bcrypt.compare(sh,result[0].senha,(err, same)=>{
            if(err){
                return res.status(500).send({msg:"Erro ao processar o login"})
            }
            else if(same==false){
                return res.status(400).send({msg:"Email, CPF ou senha incorretos"})
            }
            else{

                let token = jwt.sign({idusuario:result[0].idusuario,nomeusuario:result[0].nomeusuario},
                    process.env.JWT_KEY,{expiresIn:"1d"})


                res.status(200).send({msg:"Autenticado", token:token})
            }
        })
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
        await data.token_esqueceu_senha(user[0].idusuario, resetToken);
  
        const mailOption = {
          email: email,
          subject: "Esqueceu a Senha(NÃO RESPONDA)",
          message: mailTemplate(
            "Você recebeu um link para resetar sua senha, clique no link abaixo para resetar sua senha.",
            `http://127.0.0.1:4100/resetarSenha?id=${user[0].idusuario}&token=${resetToken}`,
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

  router.post("/resetarSenha", async (req, res) => {
    try {
      const { senha, token, userId } = req.body;
      const userToken = await data.pegar_senha_reset_token(userId);
      if (!res || res.length === 0) {
        res.json({
          success: false,
          message: "Ocorreu um Erro",
        });
      } else {
        const currDateTime = new Date();
        const expiresAt = new Date(userToken[0].expires_at);
        if (currDateTime > expiresAt) {
          res.json({
            success: false,
            message: "Link está expirado",
          });
        } else if (userToken[0].token !== token) {
          res.json({
            success: false,
            message: "Link inválido",
          });
        } else {
          await db.atualizar_senha_reset_token(userId);
          const salt = await bcrypt.genSalt(NumSaltRounds);
          const hashedPassword = await bcrypt.hash(senha, salt);
          await db.atualizar_user_senha(userId, hashedPassword);
          res.json({
            success: true,
            message: "Sua senha foi resetada!",
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

module.exports = router