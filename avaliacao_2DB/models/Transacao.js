// avaliacao_2DB/models/Transacao.js
const mongoose = require('mongoose');

const TransacaoSchema = new mongoose.Schema({
  conta_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conta', // Referência à coleção Contas
    required: true
  },
  valor: {
    type: Number,
    required: true,
    min: 0
  },
  tipo_transacao: {
    type: String,
    enum: ['Entrada', 'Saída'], // Valores permitidos
    required: true
  },
  tipo: {
    type: String,
    required: true,
    maxlength: 100 // Limite de 100 caracteres, equivalente ao VARCHAR(100)
  },
  categoria_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria', // Referência à coleção Categorias
    required: false // Pode ser opcional se não quiser obrigar uma categoria
  },
  data: {
    type: Date,
    default: Date.now // Timestamp equivalente ao DEFAULT CURRENT_TIMESTAMP
  }
});

const Transacao = mongoose.model('Transacao', TransacaoSchema);

module.exports = Transacao;



// Explicação:
// conta_id:

// Tipo ObjectId, que faz referência ao modelo Conta, representando a ligação com a tabela Contas.
// Equivale ao INT REFERENCES Contas(id) no SQL.
// valor:

// Tipo Number, equivalente ao DECIMAL(10, 2) no SQL, com validação min: 0 para evitar valores negativos.
// tipo_transacao:

// Tipo String, com valores restritos a 'Entrada' ou 'Saída', similar ao campo VARCHAR(10) no SQL.
// tipo:

// Tipo String, equivalente ao VARCHAR(100), que armazenará informações como Salário, Doação, Pagamento Boleto, etc.
// categoria_id:

// Tipo ObjectId, que faz referência ao modelo Categoria, representando a relação com a tabela Categorias.
// data:

// Tipo Date, com default: Date.now, equivalente ao TIMESTAMP DEFAULT CURRENT_TIMESTAMP no SQL.
// Esse modelo permitirá unir as entradas e saídas financeiras, categorizá-las e vincular as transações às contas e categorias em seu sistema MongoDB.