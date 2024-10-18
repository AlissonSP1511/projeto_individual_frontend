// avaliacao_2DB/models/Investimento.js
const mongoose = require('mongoose');

const InvestimentoSchema = new mongoose.Schema({
  carteira_investimento_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CarteiraInvestimento', // Referência ao modelo CarteiraInvestimento
    required: true
  },
  tipo: {
    type: String,
    required: true
  },
  valor: {
    type: mongoose.Schema.Types.Decimal128, // Tipo Decimal para valores
    required: true
  },
  data: {
    type: Date,
    default: Date.now // Data da compra do investimento
  },
  rendimento: {
    type: mongoose.Schema.Types.Decimal128, // Tipo Decimal para o rendimento
    default: 0.00
  }
});

const Investimento = mongoose.model('Investimento', InvestimentoSchema);

module.exports = Investimento;


// Explicação:
// carteira_investimentos_id:

// Tipo ObjectId, referenciando o modelo CarteiraInvestimentos, garantindo a ligação entre o investimento e a carteira associada.
// tipo:

// Tipo String, obrigatória, representando o tipo de investimento (ex.: Ações, Renda Fixa).
// valor:

// Tipo Decimal128, utilizado para valores monetários, representando o valor do investimento.
// data:

// Tipo Date, com valor padrão atual (Date.now), para registrar a data da compra do investimento.
// rendimento:

// Tipo Decimal128, para armazenar o rendimento do investimento até o momento, com valor padrão de 0.
