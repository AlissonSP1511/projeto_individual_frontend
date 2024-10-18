// src/controllers/FaturaCartaoCreditoController.js
const FaturasCartaoCredito = require('../models/FaturaCartaoCredito'); // Modelo de fatura de cartão de crédito

const FaturaCartaoCreditoController = {
    getAll: async (req, res) => {
        try {
            const faturas = await FaturasCartaoCredito.find().populate('cartao_credito_id'); // Busca todas as faturas e popula os dados do cartão de crédito
            res.json(faturas);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar faturas de cartão de crédito" });
        }
    },

    get: async (req, res) => {
        try {
            const fatura = await FaturasCartaoCredito.findById(req.params.id).populate('cartao_credito_id'); // Busca fatura pelo ID e popula os dados do cartão de crédito
            if (!fatura) {
                return res.status(404).json({ error: "Fatura não encontrada" });
            }
            res.json(fatura);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar a fatura" });
        }
    },

    create: async (req, res) => {
        const { cartao_credito_id, data_fechamento, valor_fatura } = req.body; // Campos necessários
        if (!cartao_credito_id || !data_fechamento || valor_fatura === undefined) {
            return res.status(400).json({ error: "Os campos cartao_credito_id, data_fechamento e valor_fatura são obrigatórios." });
        }
        try {
            const novaFatura = await FaturasCartaoCredito.create(req.body); // Cria nova fatura
            res.status(201).json(novaFatura);
        } catch (error) {
            res.status(400).json({ error: "Erro ao criar a fatura." });
        }
    },

    update: async (req, res) => {
        try {
            const faturaAtualizada = await FaturasCartaoCredito.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('cartao_credito_id');
            if (!faturaAtualizada) {
                return res.status(404).json({ error: "Fatura não encontrada" });
            }
            res.json(faturaAtualizada);
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar a fatura" });
        }
    },

    delete: async (req, res) => {
        try {
            const faturaDeletada = await FaturasCartaoCredito.findByIdAndDelete(req.params.id);
            if (!faturaDeletada) {
                return res.status(404).json({ error: "Fatura não encontrada" });
            }
            res.json({ message: "Fatura deletada com sucesso" });
        } catch (error) {
            res.status(500).json({ error: "Erro ao deletar a fatura" });
        }
    }
};

module.exports = FaturaCartaoCreditoController;
