// avaliacao_2DB/models/Usuario.js
const mongoose = require('mongoose');

const schema = mongoose.Schema({
    nome: {
        type: String,
        maxlength: 100,
        required: true
    },
    email: {
        type: String,
        maxlength: 100,
        required: true,
        unique: true
    }
    
});

const Usuario = mongoose.model('Usuario', schema);

module.exports = Usuario;

// Explicação:
// nome:

// Tipo String, correspondente ao VARCHAR no SQL.
// required: true: o campo é obrigatório.
// maxlength: 100: limite de caracteres como no VARCHAR(100).
// documento:

// Tipo String, correspondente ao VARCHAR no SQL.
// required: true: campo obrigatório.
// unique: true: garantia de unicidade como o UNIQUE no SQL.
// maxlength: 20: limite de caracteres como no VARCHAR(20).
// id:

// O MongoDB já usa um campo _id por padrão, que é equivalente a uma chave primária (PRIMARY KEY) no SQL. Portanto, você não precisa explicitamente definir o id como no SQL.
// Com isso, seu modelo Usuario está pronto para ser usado no MongoDB como a tabela Usuarios no SQL.