// avaliacao_2DB/controllers/InvestimentoController.js
const Investimento = require('../models/Investimento'); // Modelo de investimentos

const InvestimentoController = {
    getAll: async (req, res) => {
        try {
            const investimentos = await Investimento.find().populate('carteira_investimentos_id'); // Busca todos os investimentos e popula os dados da carteira de investimentos
            res.json(investimentos);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar investimentos" });
        }
    },

    get: async (req, res) => {
        try {
            const investimento = await Investimento.findById(req.params.id).populate('carteira_investimentos_id'); // Busca investimento pelo ID e popula os dados da carteira de investimentos
            if (!investimento) {
                return res.status(404).json({ error: "Investimento não encontrado" });
            }
            res.json(investimento);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar o investimento" });
        }
    },

    create: async (req, res) => {
        const { carteira_investimentos_id, tipo, valor } = req.body; // Campos necessários
        if (!carteira_investimentos_id || !tipo || valor === undefined) {
            return res.status(400).json({ error: "Os campos carteira_investimentos_id, tipo e valor são obrigatórios." });
        }
        try {
            const novoInvestimento = await Investimento.create(req.body); // Cria novo investimento
            res.status(201).json(novoInvestimento);
        } catch (error) {
            res.status(400).json({ error: "Erro ao criar o investimento." });
        }
    },

    update: async (req, res) => {
        try {
            const investimentoAtualizado = await Investimento.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('carteira_investimentos_id');
            if (!investimentoAtualizado) {
                return res.status(404).json({ error: "Investimento não encontrado" });
            }
            res.json(investimentoAtualizado);
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar o investimento" });
        }
    },

    delete: async (req, res) => {
        try {
            const investimentoDeletado = await Investimento.findByIdAndDelete(req.params.id);
            if (!investimentoDeletado) {
                return res.status(404).json({ error: "Investimento não encontrado" });
            }
            res.json({ message: "Investimento deletado com sucesso" });
        } catch (error) {
            res.status(500).json({ error: "Erro ao deletar o investimento" });
        }
    }
};

module.exports = InvestimentoController;
