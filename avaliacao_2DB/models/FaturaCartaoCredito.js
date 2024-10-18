// avaliacao_2DB/models/FaturaCartaoCredito.js
const mongoose = require('mongoose');

const FaturaCartaoCreditoSchema = new mongoose.Schema({
  cartao_credito_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CartaoCredito', // Referência ao modelo CartaoCredito
    required: true
  },
  data_fechamento: {
    type: Date,
    required: true // Equivalente a NOT NULL no SQL
  },
  data_pagamento: {
    type: Date // Não obrigatório, pois pode ser preenchido apenas quando a fatura for paga
  },
  valor_fatura: {
    type: Number,
    required: true, // Valor da fatura não pode ser nulo
    min: 0 // Valor mínimo deve ser 0 ou maior
  },
  status: {
    type: String,
    enum: ['Aberta', 'Fechada', 'Paga'], // Define os valores possíveis para o status
    default: 'Aberta' // Valor padrão é 'Aberta'
  }
});

const FaturaCartaoCredito = mongoose.model('FaturaCartaoCredito', FaturaCartaoCreditoSchema);

module.exports = FaturaCartaoCredito;



// Explicação:
// cartao_credito_id:

// Tipo ObjectId, referenciando o modelo CartaoCredito. É obrigatório (required: true), equivalente à chave estrangeira INT REFERENCES CartaoCredito(id) no SQL.
// data_fechamento:

// Tipo Date, obrigatório (required: true), equivalente ao DATE NOT NULL no SQL. Representa a data de fechamento da fatura.
// data_pagamento:

// Tipo Date, não obrigatório, pois será preenchido quando a fatura for paga. Corresponde à coluna opcional data_pagamento no SQL.
// valor_fatura:

// Tipo Number, obrigatório (required: true), equivalente ao DECIMAL(10, 2) NOT NULL no SQL, representando o valor total da fatura.
// status:

// Tipo String, com validação enum que restringe os valores possíveis para 'Aberta', 'Fechada' ou 'Paga'. O valor padrão é 'Aberta', assim como no SQL.
// Este modelo vai armazenar as faturas associadas aos cartões de crédito, com campos como data de fechamento, data de pagamento, valor da fatura e o status atual da fatura (aberta, fechada ou paga).