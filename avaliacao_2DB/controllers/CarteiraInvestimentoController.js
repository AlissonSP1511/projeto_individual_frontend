// avaliacao_2DB/controllers/CarteiraInvestimentosController.js
const CarteiraInvestimento = require('../models/CarteiraInvestimento'); // Modelo de carteira de investimentos

const CarteiraInvestimentoController = {
    getAll: async (req, res) => {
        try {
            const carteiras = await CarteiraInvestimento.find().populate('conta_id'); // Populando a referência para mostrar dados da conta
            res.json(carteiras);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar carteiras de investimentos" });
        }
    },

    get: async (req, res) => {
        try {
            const carteira = await CarteiraInvestimento.findById(req.params.id).populate('conta_id');
            if (!carteira) {
                return res.status(404).json({ error: "Carteira de investimentos não encontrada" });
            }
            res.json(carteira);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar a carteira de investimentos" });
        }
    },

    create: async (req, res) => {
        const { conta_id } = req.body; // Campo necessário
        if (!conta_id) {
            return res.status(400).json({ error: "O campo conta_id é obrigatório." });
        }
        try {
            const novaCarteira = await CarteiraInvestimento.create(req.body);
            res.status(201).json(novaCarteira);
        } catch (error) {
            res.status(400).json({ error: "Erro ao criar a carteira de investimentos." });
        }
    },

    update: async (req, res) => {
        try {
            const carteiraAtualizada = await CarteiraInvestimento.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('conta_id');
            if (!carteiraAtualizada) {
                return res.status(404).json({ error: "Carteira de investimentos não encontrada" });
            }
            res.json(carteiraAtualizada);
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar a carteira de investimentos" });
        }
    },

    delete: async (req, res) => {
        try {
            const carteiraDeletada = await CarteiraInvestimento.findByIdAndDelete(req.params.id);
            if (!carteiraDeletada) {
                return res.status(404).json({ error: "Carteira de investimentos não encontrada" });
            }
            res.json({ message: "Carteira de investimentos deletada com sucesso" });
        } catch (error) {
            res.status(500).json({ error: "Erro ao deletar a carteira de investimentos" });
        }
    }
};

module.exports = CarteiraInvestimentoController;
