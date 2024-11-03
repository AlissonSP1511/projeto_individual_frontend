// avaliacao_2DB/models/Usuario.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    },
    password: {
        type: String,
        required: true
    }
});

// Middleware para hash da senha antes de salvar o usuário
schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para validar a senha
schema.methods.isValidPassword = function(password) {
    return bcrypt.compare(password, this.password);
};

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