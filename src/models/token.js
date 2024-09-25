const { DataTypes } = require('sequelize');
const data = require('../database/config.js');

const Token = data.define('Token', {
    userId: {
        type: DataTypes.INTEGER, // Supondo que userId seja um INTEGER no banco de dados
        allowNull: false,
        references: {
            model: 'usuario', // Nome da tabela referenciada (usuário)
            key: 'id' // Chave primária na tabela referenciada
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
}, {
    timestamps: false, // Desativando timestamps automáticos do Sequelize
    tableName: 'tokens', // Nome da tabela no banco de dados
});

// Para definir a expiração do token, você terá que gerenciar isso manualmente. 
// Você pode adicionar um método ou lógica para excluir tokens expirados.

// Exportando o modelo
module.exports = Token;