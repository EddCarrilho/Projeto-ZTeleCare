const { DataTypes } = require('sequelize');
const data = require('../database/config.js');

const User = data.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Garantir que o email seja único
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true, // Adiciona createdAt e updatedAt
    tableName: 'usuario' // Nome da tabela no banco de dados
});

// Função de validação
const validate = (user) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    return schema.validate(user);
};

module.exports = { User, validate };