// avaliacao_2DB/models/Investimento.js
const mongoose = require('mongoose');

const InvestimentoSchema = new mongoose.Schema({
  carteira_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CarteiraInvestimento',
    required: true
  },
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  data: {
    type: Date,
    required: true,
    default: Date.now
  },
  tipo_investimento: {
    type: String,
    enum: [
      'Ações',
      'CDB',
      'Debentures',
      'Renda Fixa',
      'Fundos',
      'Tesouro Direto',
      'Cryptomoeda',
      'LCI',
      'LCA',
      'Fundo Imobiliário',
      'ETF',
      'Fundo Multimercado',
      'Poupança',
      'Previdência Privada',
      'Commodities',
      'Moeda Estrangeira'
    ],
    required: true
  },
  descricao: {
    type: String,
    maxlength: 200
  },
  valor_investido: {
    type: Number,
    required: true,
    min: [0, 'O valor investido deve ser positivo.']
  },
  taxa_juros: {
    type: Number,
    required: true,
    min: [0, 'A taxa de juros deve ser positiva.']
  },
  tipo_juros: {
    type: String,
    enum: ['Simples', 'Composto'],
    required: true
  },
  periodo_investimento: {
    type: Number,
    required: false,
    min: [1, 'O período mínimo é 1.'],
    max: [1000, 'O período máximo é 1000.']
  },
  frequencia_juros: {
    type: String,
    enum: ['Diário', 'Mensal', 'Bimestral', 'Trimestral', 'Quadrimestral', 'Semestral', 'Anual'],
    required: true
  }
}, { timestamps: true });

const Investimento = mongoose.model('Investimento', InvestimentoSchema);
module.exports = Investimento;

