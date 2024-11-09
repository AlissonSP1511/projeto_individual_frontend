// avaliacao_2DB/models/Conta.js
const mongoose = require('mongoose');

const ContaSchema = new mongoose.Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId, // O ObjectId será gerado automaticamente no MongoDB para o usuário
    ref: 'Usuario', // Referencia o model 'Usuario
  },
  saldo: {
    type: Number,
    min: 0 // O saldo não pode ser negativo
  },
  nome_banco: {
    type: String,
    maxlength: 50 // Ex: Corrente, Poupança, Investimentos, etc.
  },
  tipo_conta: {
    type: String,
    maxlength: 50 // Ex: Corrente, Poupança, Investimentos, etc.
  }
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