// avaliacao_2DB/models/LancamentoCartaoCredito.js
const mongoose = require('mongoose');

const LancamentoCartaoCreditoSchema = new mongoose.Schema({
  cartao_credito_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CartaoCredito', // Referência ao modelo CartaoCredito
    required: true
  },
  descricao: {
    type: String,
    required: true,
    maxlength: 255 // Limite máximo de caracteres, equivalente ao VARCHAR(255)
  },
  valor: {
    type: Number,
    required: true,
    min: 0 // Valor não pode ser negativo
  },
  data: {
    type: Date,
    default: Date.now // Define a data atual como padrão
  },
  parcelas: {
    type: Number,
    default: 1, // Define como 1 parcela por padrão
    min: 1 // Número mínimo de parcelas
  },
  parcela_atual: {
    type: Number,
    default: 1, // Define como a primeira parcela por padrão
    min: 1 // Número mínimo de parcela atual
  }
});

const LancamentoCartaoCredito = mongoose.model('LancamentoCartaoCredito', LancamentoCartaoCreditoSchema);

module.exports = LancamentoCartaoCredito;



// Explicação:
// cartao_credito_id:

// Tipo ObjectId, referenciando o modelo CartaoCredito, o que equivale ao INT REFERENCES CartaoCredito(id) no SQL.
// descricao:

// Tipo String, com validação maxlength: 255, que é equivalente ao VARCHAR(255) no SQL, garantindo a descrição da compra.
// valor:

// Tipo Number, equivalente ao DECIMAL(10, 2) no SQL, com validação min: 0 para garantir que o valor não seja negativo.
// data:

// Tipo Date, com default: Date.now para definir a data de criação (compra) automaticamente, semelhante ao TIMESTAMP DEFAULT CURRENT_TIMESTAMP no SQL.
// parcelas:

// Tipo Number, com o valor padrão 1, equivalente ao INT DEFAULT 1 no SQL. Validação min: 1 para garantir que haja no mínimo uma parcela.
// parcela_atual:

// Tipo Number, também com valor padrão 1, para definir que a primeira parcela é a atual. Também tem min: 1 para evitar valores inválidos.
// Esse modelo vai controlar os lançamentos (compras) feitos em um cartão de crédito, com informações como a descrição da compra, valor, data, e parcelamento.