require('dotenv').config()
const express = require('express')
const routerPersonal = express.Router()
const data = require('../../../database/config.js')
const verifica = require("../../../middleware/verify_token.js")

routerPersonal.get("/listar",verifica,(req, res) => {
    data.query("select * from dbprojeto.usuario", (error, result) => {
        if (error) {
            return res.status(500).send({ msg: "Erro ao selecionar os dados" })
        }
        res.status(200).send({ msg: "Ok", payload: result })
    })
})

//routerPersonal.get("/listar/:cpf",verifica,(req, res) => {
//    data.query("select * from dadospessoais where iddadospessoais=?", req.params.cpf, (error, result) => {
//        if (error) {
//            return res.status(500).send({ msg: "Erro ao selecionar os dados" })
//        }
//        res.status(200).send({ msg: "Ok", payload: result })
//    })
//})

routerPersonal.post("/cadastrar",verifica,(req, res) => {
    data.query("insert into dadospessoais set ?", req.body, (error, result) => {
        if (error) {
            return res.status(500).send({ msg: "Erro ao cadastrar os dados"})
        }
        res.status(201).send({ msg: "Criado", payload: result })
    })
})
routerPersonal.put("/atualizar/:id",verifica,(req, res) => {
    data.query("update dadospessoais set ? where iddadospessoais=?",[req.body,req.params.id], (error, result) => {
        if(error){
            return res.status(500).send({msg:"Erro ao tentar atualizar os dados"});
        }
        res.status(200).send({msg: "Ok",payload:result})
    })
})

module.exports = routerPersonal;