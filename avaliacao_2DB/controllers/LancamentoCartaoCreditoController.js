// src/controllers/LancamentoCartaoCreditoController.js
const LancamentoCartaoCredito = require('../models/LancamentoCartaoCredito'); // Modelo de lançamentos de cartão de crédito

const LancamentoCartaoCreditoController = {
    getAll: async (req, res) => {
        try {
            const lancamentos = await LancamentoCartaoCredito.find().populate('cartao_credito_id'); // Busca todos os lançamentos e popula os dados do cartão de crédito
            res.json(lancamentos);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar lançamentos de cartão de crédito" });
        }
    },

    get: async (req, res) => {
        try {
            const lancamento = await LancamentoCartaoCredito.findById(req.params.id).populate('cartao_credito_id'); // Busca lançamento pelo ID e popula os dados do cartão de crédito
            if (!lancamento) {
                return res.status(404).json({ error: "Lançamento não encontrado" });
            }
            res.json(lancamento);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar o lançamento" });
        }
    },

    create: async (req, res) => {
        const { cartao_credito_id, descricao, valor } = req.body; // Campos necessários
        if (!cartao_credito_id || !descricao || valor === undefined) {
            return res.status(400).json({ error: "Os campos cartao_credito_id, descricao e valor são obrigatórios." });
        }
        try {
            const novoLancamento = await LancamentoCartaoCredito.create(req.body); // Cria novo lançamento
            res.status(201).json(novoLancamento);
        } catch (error) {
            res.status(400).json({ error: "Erro ao criar o lançamento." });
        }
    },

    update: async (req, res) => {
        try {
            const lancamentoAtualizado = await LancamentoCartaoCredito.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('cartao_credito_id');
            if (!lancamentoAtualizado) {
                return res.status(404).json({ error: "Lançamento não encontrado" });
            }
            res.json(lancamentoAtualizado);
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar o lançamento" });
        }
    },

    delete: async (req, res) => {
        try {
            const lancamentoDeletado = await LancamentoCartaoCredito.findByIdAndDelete(req.params.id);
            if (!lancamentoDeletado) {
                return res.status(404).json({ error: "Lançamento não encontrado" });
            }
            res.json({ message: "Lançamento deletado com sucesso" });
        } catch (error) {
            res.status(500).json({ error: "Erro ao deletar o lançamento" });
        }
    }
};

module.exports = LancamentoCartaoCreditoController;
