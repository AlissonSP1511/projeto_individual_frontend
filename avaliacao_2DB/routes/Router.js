// avaliacao_2DB/routes/Router.js
const express = require('express')
const CartaoCreditoController = require('../controllers/CartaoCreditoController')
const CarteiraInvestimentoController = require('../controllers/CarteiraInvestimentoController')
const CategoriaController = require('../controllers/CategoriaController')
const ContaController = require('../controllers/ContaController')
const FaturaCartaoCreditoController = require('../controllers/FaturaCartaoCreditoController')
const InvestimentoController = require('../controllers/InvestimentoController')
const LancamentoCartaoCreditoController = require('../controllers/LancamentoCartaoCreditoController')
const TransacaoController = require('../controllers/TransacaoController')
const UsuarioController = require('../controllers/UsuarioController')
const router = express.Router();

// // routes/login.js
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs'); // Para comparar senhas criptografadas
// const Usuario = require('../models/Usuario');

// const SECRET_KEY = "sua_chave_secreta"; // Use uma chave secreta forte e armazene-a em variáveis de ambiente

router.get('/', function (req, res) {
    res.json({})
})

//cartaocredito
router.get('/cartaocredito', (req, res) => CartaoCreditoController.getAll(req, res))
router.get('/cartaocredito/:id', (req, res) => CartaoCreditoController.get(req, res))
router.post('/cartaocredito', (req, res) => CartaoCreditoController.create(req, res))
router.delete('/cartaocredito/:id', (req, res) => CartaoCreditoController.delete(req, res))
router.put('/cartaocredito/:id', (req, res) => CartaoCreditoController.update(req, res))

//carteirainvestimento
router.get('/carteirainvestimento', (req, res) =>  CarteiraInvestimentoController.getAll(req, res))
router.get('/carteirainvestimento/:id', (req, res) => CarteiraInvestimentoController.get(req, res))
router.post('/carteirainvestimento', (req, res) => CarteiraInvestimentoController.create(req, res))
router.delete('/carteirainvestimento/:id', (req, res) => CarteiraInvestimentoController.delete(req, res))
router.put('/carteirainvestimento/:id', (req, res) => CarteiraInvestimentoController.update(req, res))

//categoria
router.get('/categoria', (req, res) =>  CategoriaController.getAll(req, res))
router.get('/categoria/:id', (req, res) => CategoriaController.get(req, res))
router.post('/categoria', (req, res) => CategoriaController.create(req, res))
router.delete('/categoria/:id', (req, res) => CategoriaController.delete(req, res))
router.put('/categoria/:id', (req, res) => CategoriaController.update(req, res))

//conta
router.get('/conta', (req, res) =>  ContaController.getAll(req, res))
router.get('/conta/:id', (req, res) => ContaController.get(req, res))
router.post('/conta', (req, res) => ContaController.create(req, res))
router.delete('/conta/:id', (req, res) => ContaController.delete(req, res))
router.put('/conta/:id', (req, res) => ContaController.update(req, res))

//faturacartaocredito
router.get('/faturacartaocredito', (req, res) =>  FaturaCartaoCreditoController.getAll(req, res))
router.get('/faturacartaocredito/:id', (req, res) => FaturaCartaoCreditoController.get(req, res))
router.post('/faturacartaocredito', (req, res) => FaturaCartaoCreditoController.create(req, res))
router.delete('/faturacartaocredito/:id', (req, res) => FaturaCartaoCreditoController.delete(req, res))
router.put('/faturacartaocredito/:id', (req, res) => FaturaCartaoCreditoController.update(req, res))

//investimento
router.get('/investimento', (req, res) =>  InvestimentoController.getAll(req, res))
router.get('/investimento/:id', (req, res) => InvestimentoController.get(req, res))
router.post('/investimento', (req, res) => InvestimentoController.create(req, res))
router.delete('/investimento/:id', (req, res) => InvestimentoController.delete(req, res))
router.put('/investimento/:id', (req, res) => InvestimentoController.update(req, res))

//lancamentocartaocredito
router.get('/lancamentocartaocredito', (req, res) =>  LancamentoCartaoCreditoController.getAll(req, res))
router.get('/lancamentocartaocredito/:id', (req, res) => LancamentoCartaoCreditoController.get(req, res))
router.post('/lancamentocartaocredito', (req, res) => LancamentoCartaoCreditoController.create(req, res))
router.delete('/lancamentocartaocredito/:id', (req, res) => LancamentoCartaoCreditoController.delete(req, res))
router.put('/lancamentocartaocredito/:id', (req, res) => LancamentoCartaoCreditoController.update(req, res))

//transacao
router.get('/transacao', (req, res) =>  TransacaoController.getAll(req, res))
router.get('/transacao/:id', (req, res) => TransacaoController.get(req, res))
router.post('/transacao', (req, res) => TransacaoController.create(req, res))
router.delete('/transacao/:id', (req, res) => TransacaoController.delete(req, res))
router.put('/transacao/:id', (req, res) => TransacaoController.update(req, res))

//usuario
router.get('/usuario', (req, res) =>  UsuarioController.getAll(req, res))
router.get('/usuario/:id', (req, res) => UsuarioController.get(req, res))
router.post('/usuario', (req, res) => UsuarioController.create(req, res))
router.delete('/usuario/:id', (req, res) => UsuarioController.delete(req, res))
router.put('/usuario/:id', (req, res) => UsuarioController.update(req, res))

// //login
// router.post('/login', async (req, res) => {
//     console.log(req.body);
//     console.log("aqui");
//     const { email, senha } = req.body;

//     try {
//         const usuario = await Usuario.findOne({ email });
//         if (!usuario) {
//             return res.status(404).json({ error: "Usuário não encontrado" });
//         }

//         const senhaValida = await bcrypt.compare(senha, usuario.senha);
//         if (!senhaValida) {
//             return res.status(401).json({ error: "Senha incorreta" });
//         }

//         // Gerar token JWT
//         const token = jwt.sign({ userId: usuario._id }, SECRET_KEY, { expiresIn: '1h' });

//         res.json({ token, message: "Login bem-sucedido" });
//     } catch (error) {
//         res.status(500).json({ error: "Erro ao fazer login" });
//     }
// });

module.exports = router