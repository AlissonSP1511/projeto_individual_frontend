//avaliacao_2DB/controllers/InvestimentoController.js
const Investimento = require('../models/Investimento');

const InvestimentoController = {
    getAll: async (req, res) => {
        try {
            // Buscar todos os investimentos relacionados ao usuário autenticado
            const investimentos = await Investimento.find({ usuario_id: req.userId })
                .populate('carteira_id');
            res.json(investimentos);
        } catch (error) {
            console.error('Erro ao buscar investimentos:', error.message);
            res.status(500).json({ error: "Erro ao buscar investimentos." });
        }
    },

    get: async (req, res) => {
        try {
            // Buscar o investimento pelo ID e verificar se pertence ao usuário
            const investimento = await Investimento.findOne({ 
                _id: req.params.id, 
                usuario_id: req.userId 
            }).populate('carteira_id');
            
            if (!investimento) {
                return res.status(404).json({ error: "Investimento não encontrado ou não pertence ao usuário." });
            }

            res.json(investimento);
        } catch (error) {
            console.error('Erro ao buscar o investimento:', error.message);
            res.status(500).json({ error: "Erro ao buscar o investimento." });
        }
    },

    create: async (req, res) => {
        const {
            carteira_id,
            data,
            tipo_investimento,
            descricao,
            valor_investido,
            taxa_juros,
            tipo_juros,
            periodo_investimento,
            frequencia_juros,
        } = req.body;

        if (!carteira_id || !tipo_investimento || !valor_investido || !taxa_juros || !tipo_juros || !frequencia_juros) {
            return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
        }

        try {
            const novoInvestimento = await Investimento.create({
                carteira_id,
                data: data || Date.now(),
                tipo_investimento,
                descricao,
                valor_investido,
                taxa_juros,
                tipo_juros,
                periodo_investimento,
                frequencia_juros,
                usuario_id: req.userId, // Associar ao usuário autenticado
            });

            const investimentoPopulado = await Investimento.findById(novoInvestimento._id).populate('carteira_id');
            res.status(201).json(investimentoPopulado);
        } catch (error) {
            console.error('Erro ao criar o investimento:', error.message);
            res.status(400).json({ error: "Erro ao criar o investimento." });
        }
    },

    update: async (req, res) => {
        try {
            // Atualizar somente se o investimento pertence ao usuário
            const investimentoAtualizado = await Investimento.findOneAndUpdate(
                { _id: req.params.id, usuario_id: req.userId },
                req.body,
                { new: true }
            ).populate('carteira_id');

            if (!investimentoAtualizado) {
                return res.status(404).json({ error: "Investimento não encontrado ou não pertence ao usuário." });
            }

            res.json(investimentoAtualizado);
        } catch (error) {
            console.error('Erro ao atualizar o investimento:', error.message);
            res.status(500).json({ error: "Erro ao atualizar o investimento." });
        }
    },

    delete: async (req, res) => {
        try {
            // Deletar somente se o investimento pertence ao usuário
            const investimentoDeletado = await Investimento.findOneAndDelete({
                _id: req.params.id,
                usuario_id: req.userId,
            });

            if (!investimentoDeletado) {
                return res.status(404).json({ error: "Investimento não encontrado ou não pertence ao usuário." });
            }

            res.json({ message: "Investimento deletado com sucesso." });
        } catch (error) {
            console.error('Erro ao deletar o investimento:', error.message);
            res.status(500).json({ error: "Erro ao deletar o investimento." });
        }
    },
};

module.exports = InvestimentoController;
