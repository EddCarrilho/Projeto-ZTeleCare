const express = require("express");
const data = require("../../database/config.js")
const routerchat = express.Router();

routerchat.post("/mensagem", (req, res) => {
    console.log(req.body);
    data.query("insert into mensagem set $1", req.body, (error, result) => {
        if (error) {
            return res.status(500).send({ msg: "Erro ao tentar cadastrar" })
        }
        res.status(201).send({ msg: "Ok", payload: result });
    });

});

routerchat.get("/listar-mensens", (req, res) => {
    data.query("select * from mensagem", req.params.id, (error, dados) => {
        if (error) {
            return res.status(500).send({ msg: "Erro ao selecionar dos dados" });
        }
        res.status(200).send({ msg: "Ok", payload: dados });
    });
});

routerchat.delete("/deletar_message", (req, res) => {
    data.query(deletar, ('DELETE FROM mensagem  WHERE user_id = $1'), (error, results) => {
        if (error) {
            return res.status(500).send({ msg: "Erro ao tentar encerrar o chat" });
        }
        res.status(200).send({ msg: 'Mensagens deletadas com sucesso', payload: results });
    });
});

module.exports = routerchat