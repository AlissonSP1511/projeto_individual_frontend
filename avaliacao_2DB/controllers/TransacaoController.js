// avaliacao_2DB/controllers/TransacaoController.js
const Transacao = require('../models/Transacao'); // Modelo de transações

const TransacaoController = {
    getAll: async (req, res) => {
        try {
            const transacoes = await Transacao.find().populate('conta_id').populate('categoria_id'); // Busca todas as transações e popula os dados da conta e categoria
            res.json(transacoes);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar transações" });
        }
    },

    get: async (req, res) => {
        try {
            const transacao = await Transacao.findById(req.params.id).populate('conta_id').populate('categoria_id'); // Busca transação pelo ID e popula os dados da conta e categoria
            if (!transacao) {
                return res.status(404).json({ error: "Transação não encontrada" });
            }
            res.json(transacao);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar a transação" });
        }
    },

    create: async (req, res) => {
        const { conta_id, valor, tipo_transacao, tipo } = req.body; // Campos necessários
        if (!conta_id || valor === undefined || !tipo_transacao || !tipo) {
            return res.status(400).json({ error: "Os campos conta_id, valor, tipo_transacao e tipo são obrigatórios." });
        }
        try {
            const novaTransacao = await Transacao.create(req.body); // Cria nova transação
            res.status(201).json(novaTransacao);
        } catch (error) {
            res.status(400).json({ error: "Erro ao criar a transação." });
        }
    },

    update: async (req, res) => {
        try {
            const transacaoAtualizada = await Transacao.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('conta_id').populate('categoria_id');
            if (!transacaoAtualizada) {
                return res.status(404).json({ error: "Transação não encontrada" });
            }
            res.json(transacaoAtualizada);
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar a transação" });
        }
    },

    delete: async (req, res) => {
        try {
            const transacaoDeletada = await Transacao.findByIdAndDelete(req.params.id);
            if (!transacaoDeletada) {
                return res.status(404).json({ error: "Transação não encontrada" });
            }
            res.json({ message: "Transação deletada com sucesso" });
        } catch (error) {
            res.status(500).json({ error: "Erro ao deletar a transação" });
        }
    }
};

module.exports = TransacaoController;
