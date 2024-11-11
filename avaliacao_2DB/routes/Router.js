// avaliacao_2DB/routes/Router.js
const express = require('express')
const CartaoCreditoController = require('../controllers/CartaoCreditoController')
const CarteiraInvestimentoController = require('../controllers/CarteiraInvestimentoController')
const CategoriaController = require('../controllers/CategoriaController')
const ContaController = require('../controllers/ContaController')
const FaturaCartaoCreditoController = require('../controllers/FaturaCartaoCreditoController')
const InvestimentoController = require('../controllers/InvestimentoController')
const LancamentoCartaoCreditoController = require('../controllers/LancamentoCartaoCreditoController')
const UsuarioController = require('../controllers/UsuarioController')
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas públicas
router.get('/', function (req, res) {
    res.json({})
})

// Rotas de autenticação (públicas)
router.post('/login', UsuarioController.login);
router.post('/register', UsuarioController.register);

// Rotas protegidas - Todas as rotas abaixo requerem autenticação
router.use(authMiddleware); // Aplica o middleware de autenticação para todas as rotas abaixo

// Cartão de crédito
router.get('/cartaocredito', CartaoCreditoController.getAll)
router.get('/cartaocredito/:id', CartaoCreditoController.get)
router.post('/cartaocredito', CartaoCreditoController.create)
router.delete('/cartaocredito/:id', CartaoCreditoController.delete)
router.put('/cartaocredito/:id', CartaoCreditoController.update)

// Carteira de investimento
router.get('/carteirainvestimento', CarteiraInvestimentoController.getAll)
router.get('/carteirainvestimento/:id', CarteiraInvestimentoController.get)
router.post('/carteirainvestimento', CarteiraInvestimentoController.create)
router.delete('/carteirainvestimento/:id', CarteiraInvestimentoController.delete)
router.put('/carteirainvestimento/:id', CarteiraInvestimentoController.update)

// Categoria
router.get('/categoria', CategoriaController.getAll)
router.get('/categoria/:id', CategoriaController.get)
router.post('/categoria', CategoriaController.create)
router.delete('/categoria/:id', CategoriaController.delete)
router.put('/categoria/:id', CategoriaController.update)

// Conta
router.get('/conta', ContaController.getAll)
router.get('/conta/:id', ContaController.get)
router.post('/conta', ContaController.create)
router.delete('/conta/:id', ContaController.delete)
router.put('/conta/:id', ContaController.update)

// Novas rotas para transações
router.post('/conta/:id/transacao', ContaController.addTransacao)
router.delete('/conta/:contaId/transacao/:transacaoId', ContaController.removeTransacao)
router.get('/conta/:id/transacoes', ContaController.getTransacoesPorPeriodo)
router.patch('/conta/:id/transacao/:transacaoId', authMiddleware, ContaController.updateTransacao);

// Fatura cartão de crédito
router.get('/faturacartaocredito', FaturaCartaoCreditoController.getAll)
router.get('/faturacartaocredito/:id', FaturaCartaoCreditoController.get)
router.post('/faturacartaocredito', FaturaCartaoCreditoController.create)
router.delete('/faturacartaocredito/:id', FaturaCartaoCreditoController.delete)
router.put('/faturacartaocredito/:id', FaturaCartaoCreditoController.update)

// Investimento
router.get('/investimento', InvestimentoController.getAll)
router.get('/investimento/:id', InvestimentoController.get)
router.post('/investimento', InvestimentoController.create)
router.delete('/investimento/:id', InvestimentoController.delete)
router.put('/investimento/:id', InvestimentoController.update)

// Lançamento cartão de crédito
router.get('/lancamentocartaocredito', LancamentoCartaoCreditoController.getAll)
router.get('/lancamentocartaocredito/:id', LancamentoCartaoCreditoController.get)
router.post('/lancamentocartaocredito', LancamentoCartaoCreditoController.create)
router.delete('/lancamentocartaocredito/:id', LancamentoCartaoCreditoController.delete)
router.put('/lancamentocartaocredito/:id', LancamentoCartaoCreditoController.update)

// Usuário
router.get('/usuario', UsuarioController.getAll)
router.get('/usuario/:id', UsuarioController.get)
router.put('/usuario/:id', UsuarioController.update)
router.delete('/usuario/:id', UsuarioController.delete)

module.exports = router