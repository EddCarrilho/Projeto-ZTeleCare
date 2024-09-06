require("dotenv").config();
const express = require("express");
const router = express.Router();
const data = require("../../../database/config.js")
const bcrypt = require("bcrypt");
const round = Number(process.env.SALT)
const jwt = require("jsonwebtoken");


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

    console.log(process.env.SALT);


    bcrypt.hash(sh,round,(error,crypt)=>{
        if(error){
            return res.status(500).send({msg:"Erro ao tentar cadastrar"})
        }
        req.body.senha = crypt;
        data.query("insert into usuario set ?",req.body,(error,result)=>{
            if(error){
                return res.status(500).send({msg:"Erro ao tentar cadastrar"})
            }
            res.status(201).send({msg:"Ok",payload:result})
        });

    });
});

router.put("/alterarfoto/:id",(req,res)=>{
    data.query("update usuario set ? where idusuario=?",[req.body,req.params.id],(error,result)=>{
        if(error){
            return res.status(500).send({msg:"Erro ao tentar atualizar a foto"})
        }
        res.status(200).send({msg:"Ok",payload:result})
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
        data.query("update usuario set ? where idusuario=?",[req.body,req.params.id],(error,result)=>{
            if(error){
                return res.status(500).send({msg:"Erro ao tentar atualizar a senha"})
            }
            res.status(200).send({msg:"Ok",payload:result})
        });

    });
});

router.get("/buscarporid/:id",(req,res)=>{

});

router.get("/buscarporusuario/:usuario",(req,res)=>{
    data.query("select * from usuario where nomeusuario=?", req.params.usuario, (error,dados)=>{
        if(error){
            return res.status(500).send({msg:"Erro ao selecionar os dados"})
        }
        return res.status(200).send({msg:"OK",payload:dados})
    });
});

router.post("/login",(req,res)=>{
    let sh = req.body.senha;
    data.query("select * from usuario where nomeusuario=?", req.body.nomeusuario,(error,result)=>{
        console.log(result)
        if(error || result[0]==null){
            return res.status(400).send({msg:"Usuário ou senha incorreto"})
        }

        bcrypt.compare(sh,result[0].senha,(err, same)=>{
            if(err){
                return res.status(500).send({msg:"Erro ao processar o login" + err})
            }
            else if(same==false){
                return res.status(400).send({msg:"Usuário ou senha incorreto"})
            }
            else{

                let token = jwt.sign({idusuario:result[0].idusuario,nomeusuario:result[0].nomeusuario},
                    process.env.JWT_KEY,{expiresIn:"2d"})


                res.status(200).send({msg:"Autenticado", token:token})

            }
        })
    });
});


module.exports = router