// avaliacao_2DB/models/Categoria.js
const mongoose = require('mongoose');

const CategoriaSchema = new mongoose.Schema({
  descricao: {
    type: String,
    required: true,
    maxlength: 100 // Limite de 100 caracteres para a descrição
  }
});

const Categoria = mongoose.model('Categoria', CategoriaSchema);

module.exports = Categoria;


// Explicação:
// descricao:
// Tipo String, equivalente ao VARCHAR no SQL.
// required: true: Campo obrigatório, pois no SQL o campo foi definido como NOT NULL.
// maxlength: 100: Limite de 100 caracteres, conforme definido no SQL (VARCHAR(100)).
// Esse modelo permitirá classificar receitas e despesas com diferentes categorias em seu projeto de controle financeiro.