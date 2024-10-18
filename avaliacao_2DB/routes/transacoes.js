// routes/transacoes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Transacoes = require('../models/Transacoes');
const router = express.Router();

// Rota protegida para listar transações do usuário autenticado
router.get('/transacoes', authMiddleware, async (req, res) => {
    try {
        const transacoes = await Transacoes.find({ usuarioId: req.userId });
        res.json(transacoes);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar transações" });
    }
});
// routes/transacoes.js

// Rota protegida para criar uma transação associada ao usuário autenticado
router.post('/transacoes', authMiddleware, async (req, res) => {
    const { valor, tipoTransacao, categoriaId } = req.body;

    const novaTransacao = new Transacoes({
        usuarioId: req.userId, // O ID do usuário vem do token JWT
        valor,
        tipoTransacao,
        categoriaId,
        data: new Date(),
    });

    try {
        const transacao = await novaTransacao.save();
        res.status(201).json(transacao);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar transação" });
    }
});


module.exports = router;
