// avaliacao_2DB/models/CarteiraInvestimento.js
const mongoose = require('mongoose');

const CarteiraInvestimentoSchema = new mongoose.Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  nome_carteira: {
    type: String,
    maxlength: 50,
    required: true
  },
  objetivo_carteira_descricao: {
    type: String,
    maxlength: 200
  }
}, { timestamps: true });

module.exports = mongoose.model('CarteiraInvestimento', CarteiraInvestimentoSchema);
