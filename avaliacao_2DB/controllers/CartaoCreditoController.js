// src/controllers/CartaoCreditoController.js
const CartaoCredito = require('../models/CartaoCredito'); // Modelo de cartão de crédito

const CartaoCreditoController = {
    getAll: async (req, res) => {
        try {
            const cartoes = await CartaoCredito.find().populate('conta_id'); // Populando a referência para mostrar dados da conta
            res.json(cartoes);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar cartões de crédito" });
        }
    },

    get: async (req, res) => {
        try {
            const cartao = await CartaoCredito.findById(req.params.id).populate('conta_id');
            if (!cartao) {
                return res.status(404).json({ error: "Cartão de crédito não encontrado" });
            }
            res.json(cartao);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar o cartão de crédito" });
        }
    },

    create: async (req, res) => {
        const { numero, limite, conta_id } = req.body; // Campos necessários
        if (!numero || limite === undefined || !conta_id) {
            return res.status(400).json({ error: "Os campos numero, limite e conta_id são obrigatórios." });
        }
        try {
            const novoCartao = await CartaoCredito.create(req.body);
            res.status(201).json(novoCartao);
        } catch (error) {
            res.status(400).json({ error: "Erro ao criar o cartão de crédito." });
        }
    },

    update: async (req, res) => {
        try {
            const cartaoAtualizado = await CartaoCredito.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('conta_id');
            if (!cartaoAtualizado) {
                return res.status(404).json({ error: "Cartão de crédito não encontrado" });
            }
            res.json(cartaoAtualizado);
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar o cartão de crédito" });
        }
    },

    delete: async (req, res) => {
        try {
            const cartaoDeletado = await CartaoCredito.findByIdAndDelete(req.params.id);
            if (!cartaoDeletado) {
                return res.status(404).json({ error: "Cartão de crédito não encontrado" });
            }
            res.json({ message: "Cartão de crédito deletado com sucesso" });
        } catch (error) {
            res.status(500).json({ error: "Erro ao deletar o cartão de crédito" });
        }
    }
};

module.exports = CartaoCreditoController;
