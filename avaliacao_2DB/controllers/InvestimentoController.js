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
        const { carteira_investimento_id, tipo, valor, taxa_juros, tipo_juros, prazo_meses } = req.body;
        
        if (!carteira_investimento_id || !tipo || !valor || !taxa_juros || !tipo_juros || !prazo_meses) {
            return res.status(400).json({ 
                error: "Todos os campos obrigatórios devem ser preenchidos." 
            });
        }
        
        try {
            const novoInvestimento = await Investimento.create({
                carteira_investimentos_id: carteira_investimento_id, // Convertendo para o nome correto do campo
                tipo,
                valor,
                taxa_juros,
                tipo_juros,
                prazo_meses,
                descricao: req.body.descricao || ''
            });
            
            const investimentoPopulado = await Investimento.findById(novoInvestimento._id)
                .populate('carteira_investimentos_id');
                
            res.status(201).json(investimentoPopulado);
        } catch (error) {
            console.error('Erro ao criar investimento:', error);
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
