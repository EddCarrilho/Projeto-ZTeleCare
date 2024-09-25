require("dotenv").config();
const express = require("express");
const router = express.Router();
const data = require("../../../database/config.js")
const bcrypt = require("bcrypt");
const round = Number(process.env.SALT)
const jwt = require("jsonwebtoken");
const Joi = require('joi');
const sendEmail = require("../../utilidade/enviarEmail.js");
const crypto = require("crypto");
const { User } = require("../../../models/user.js");
const Token = require("../../../models/token.js");


router.get("/listar",(req,res)=>{
    data.query("select * from dbprojeto.usuario", req.params.id, (error,dados)=>{
        if(error){
            return res.status(500).send({msg:"Erro ao selecionar os dados"})
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

router.put("/alterarsenha/:id",(req,res)=>{
    let sh = req.body.senha;

    console.log(process.env.SALT);

    bcrypt.hash(sh,round,(error,crypt)=>{
        if(error){
            return res.status(500).send({msg:"Erro ao tentar atualizar a senha"})
        }
        
        req.body.senha = crypt;
        data.query("update dbprojeto.usuario set ? where idusuario=?",[req.body,req.params.id],(error,result)=>{
            if(error){
                return res.status(500).send({msg:"Erro ao tentar atualizar a senha"})
            }
            res.status(200).send({msg:"Ok",payload:result})
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

router.post("/resetsenha", async (req, res) => {
    try {
        const schema = Joi.object({ email: Joi.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const [user] = await User.findAll({
            where: { email: req.body.email }
        });

        if (!user) {
            return res.status(400).send("Usuário não encontrado");
        }

        let token = await Token.findOne({ where: { idusuario: user.id } }); 

        if (!token) {
            token = await Token.create({
                idusuario: user.id,
                token: crypto.randomBytes(32).toString("hex"),
            });
        }

        const baseUrl = "http://localhost:5510"; 
        const link = `${baseUrl}/password-reset/${user.id}/${token.token}`;

        await sendEmail(user.email, "Resete sua senha:", link);

        res.send("Um link foi enviado para o seu email.");
    } catch (error) {
        res.send("Ocorreu um Erro");
        console.log(error);
    }
});

module.exports = router