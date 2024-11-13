// avaliacao_2DB/models/CarteiraInvestimento.js
const mongoose = require('mongoose');

const CarteiraInvestimentoSchema = new mongoose.Schema({
  conta_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conta',
    required: true
  },
  saldo_total: {
    type: Number,
    default: 0
  },
  data_criacao: {
    type: Date,
    default: Date.now
  }
});

const CarteiraInvestimento = mongoose.model('CarteiraInvestimento', CarteiraInvestimentoSchema);

module.exports = CarteiraInvestimento;


// Explicação:
// conta_id:
// Tipo ObjectId, referenciando o modelo Conta. É obrigatório (required: true), representando a associação da carteira de investimentos a uma conta corrente, equivalente à chave estrangeira INT REFERENCES Contas(id) no SQL.
// Esse modelo será usado para armazenar a carteira de investimentos associada a uma conta corrente específica.
