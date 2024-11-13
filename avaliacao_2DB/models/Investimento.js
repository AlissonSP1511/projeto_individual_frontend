// avaliacao_2DB/models/Investimento.js
const mongoose = require('mongoose');

const InvestimentoSchema = new mongoose.Schema({
  carteira_investimentos_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CarteiraInvestimento',
    required: true
  },
  tipo: {
    type: String,
    required: true,
    enum: ['Ações', 'Renda Fixa', 'Fundos', 'Tesouro Direto']
  },
  valor: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },
  taxa_juros: {
    type: Number,
    required: true
  },
  tipo_juros: {
    type: String,
    enum: ['Simples', 'Composto'],
    required: true
  },
  prazo_meses: {
    type: Number,
    required: true,
    min: 1,
    max: 480
  },
  descricao: {
    type: String,
    maxlength: 200
  },
  data_criacao: {
    type: Date,
    default: Date.now
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
// taxa_juros:

// Tipo Number, obrigatória, representando a taxa de juros do investimento.
// tipo_juros:

// Tipo String, obrigatória, representando o tipo de juros do investimento.
// prazo_meses:

// Tipo Number, obrigatória, representando o prazo do investimento em meses.
// descricao:

// Tipo String, opcional, representando a descrição do investimento.
// data_criacao:

// Tipo Date, com valor padrão atual (Date.now), para registrar a data da compra do investimento.
