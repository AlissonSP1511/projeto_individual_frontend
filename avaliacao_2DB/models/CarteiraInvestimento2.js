// avaliacao_2DB/models/Conta.js
const mongoose = require('mongoose');

const ContaSchema = new mongoose.Schema({
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
  objetivo_carteira: {
    type: String,
    maxlength: 50,
    required: false
  },
  investimentos: [{
    data: { 
      type: Date, 
      required: true 
    },
    data_criacao: {
      type: Date,
      default: Date.now
    },
    tipo_investimento: {
      type: String,
      enum: ['Ações','CDB','Debentures', 'Renda Fixa', 'Fundos', 'Tesouro Direto', 'Cryptomoeda', 'LCI' , 'LCA'],
      required: true
    },
    descricao: { 
      type: String, 
      required: false
    },
    valor: { 
      type: Number, 
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
      max: 1000
    },
    descricao: {
      type: String,
      maxlength: 200
    },
    categoria_investimento_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CategoriaInvestimento',
      required: false
    }
  }]
});

const Conta = mongoose.model('Conta', ContaSchema);

module.exports = Conta;



// Explicação:
// usuario_id:

// Tipo ObjectId: Este é o identificador usado no MongoDB para referenciar um documento de outra coleção. Ele substitui o INT no SQL.
// ref: 'Usuario': Estabelece uma referência à coleção Usuarios, semelhante a uma chave estrangeira no SQL.
// required: true: Campo obrigatório.
// saldo:

// Tipo Number, correspondente ao DECIMAL no SQL.
// min: 0: Define que o valor mínimo do saldo é 0, para evitar valores negativos.
// required: true: Campo obrigatório.
// tipo_conta:

// Tipo String, correspondente ao VARCHAR no SQL.
// maxlength: 50: Limite de caracteres para descrever o tipo de conta (Corrente, Poupança, etc.).
// required: true: Campo obrigatório.
// Assim, com esse esquema em Mongoose, sua tabela Contas no SQL está convertida para uma model em MongoDB, com suporte a múltiplas contas correntes associadas a um usuário.