require('dotenv').config()
const jwt = require('jsonwebtoken')

const verificar = (req, res, next) => {
    // Const para guardar o token recebido pelo usuário
    // do cabeçalho de requisição
    const token_enviado = req.headers['authorization']?.split(' ')[1];
    if (!token_enviado) {
        return res.status(401).send({ msg: "Não autenticado. Efetue o login." })
    }
    jwt.verify(token_enviado, process.env.JWT_KEY, (error, result) => {
        if (error) {
            return res.status(403).send({ msg: "Autorização negada para este conteúdo" })
        }
        next()
    })
}

module.exports = verificar