// avaliacao_2DB/models/CartaoCredito.js
const mongoose = require('mongoose');

const CartaoCreditoSchema = new mongoose.Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  numero: {
    type: String,
    required: true,
    unique: true, // O número do cartão de crédito deve ser único
    maxlength: 16, // Limite de 16 caracteres, equivalente ao VARCHAR(16)
    minlength: 16, // Exigindo exatamente 16 dígitos para um número de cartão válido
  },
  limite: {
    type: Number,
    required: true,
    min: 0 // Limite mínimo para o valor do cartão
  },
  conta_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conta', // Referência à coleção Contas
    required: true // O cartão precisa estar vinculado a uma conta
  }
});

const CartaoCredito = mongoose.model('CartaoCredito', CartaoCreditoSchema);

module.exports = CartaoCredito;



// Explicação:
// numero:

// Tipo String, com as validações maxlength: 16 e minlength: 16 para assegurar que o número do cartão tenha exatamente 16 dígitos.
// A propriedade unique: true garante que cada número de cartão seja único, similar ao UNIQUE no SQL.
// limite:

// Tipo Number, equivalente ao DECIMAL(10, 2) no SQL, com validação min: 0 para garantir que o limite não seja negativo.
// conta_id:

// Tipo ObjectId, que faz referência ao modelo Conta, vinculando o cartão a uma conta específica.
// Equivale ao INT REFERENCES Contas(id) no SQL.
// Este modelo em MongoDB será responsável por armazenar os dados dos cartões de crédito, incluindo número, limite, e a conta vinculada ao cartão no sistema.
