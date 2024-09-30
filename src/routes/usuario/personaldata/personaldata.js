require('dotenv').config()
const express = require('express')
const routerPersonal = express.Router()
const data = require('../../../database/config.js')
const verificar = require("../../../middleware/verify_token.js")

routerPersonal.get("/verify",verificar,(req, res) => {
        res.status(200).send({ msg: "Ok", payload: req.user})
    })

routerPersonal.get("/listar/:idusuario",verificar,(req, res) => {
    data.query("select * from usuario where idusuario=?", req.params.idusuario, (error, result) => {
        if (error) {
            return res.status(500).send({ msg: "Erro ao selecionar os dados" })
        }
        res.status(200).send({ msg: "Ok", payload: result })
    })
})

routerPersonal.get("/listar/:cpf",verificar,(req, res) => {
    data.query("select * from usuario where cpf=?", req.params.cpf, (error, result) => {
        if (error) {
            return res.status(500).send({ msg: "Erro ao selecionar os dados" })
        }
        res.status(200).send({ msg: "Ok", payload: result })
    })
})

routerPersonal.put("/atualizar/:idusuario",verificar,(req, res) => {
    data.query("update usuario set ? where idusuario=?",[req.body,req.params.idusuario], (error, result) => {
        if(error){
            return res.status(500).send({msg:"Erro ao tentar atualizar os dados"});
        }
        res.status(200).send({msg: "Ok",payload:result})
    })
})

module.exports = routerPersonal;