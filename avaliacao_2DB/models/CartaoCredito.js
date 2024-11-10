// avaliacao_2DB/models/CartaoCredito.js
const mongoose = require('mongoose');

const cartaoCreditoSchema = new mongoose.Schema({
    numero: {
        type: String,
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    bancoEmissor: {
        type: String,
        required: true
    },
    bandeira: {
        type: String,
        required: true
    },
    imagemCartao: {
        type: String
    },
    limite: {
        type: Number,
        required: true
    },
    diaFechamento: {
        type: Number,
        required: true,
        min: 1,
        max: 31
    },
    diaVencimento: {
        type: Number,
        required: true,
        min: 1,
        max: 31
    },
    limiteUtilizado: {
        type: Number,
        default: 0
    },
    comprasParceladas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LancamentoCartaoCredito'
    }],
    comprasAVista: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LancamentoCartaoCredito'
    }],
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
}, {
    timestamps: true
});

const CartaoCredito = mongoose.model('CartaoCredito', cartaoCreditoSchema);
 
module.exports = CartaoCredito;



// Explicação:
// numero:

// Tipo String, com as validações maxlength: 16 para assegurar que o número do cartão tenha exatamente 16 dígitos.
// A propriedade unique: true garante que cada número de cartão seja único, similar ao UNIQUE no SQL.
// limite:

// Tipo Number, equivalente ao DECIMAL(10, 2) no SQL, com validação min: 0 para garantir que o limite não seja negativo.
// conta_id:

// Tipo ObjectId, que faz referência ao modelo Conta, vinculando o cartão a uma conta específica.
// Equivale ao INT REFERENCES Contas(id) no SQL.
// Este modelo em MongoDB será responsável por armazenar os dados dos cartões de crédito, incluindo número, limite, e a conta vinculada ao cartão no sistema.
