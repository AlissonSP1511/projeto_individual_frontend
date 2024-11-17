// avaliacao_2DB/controllers/CarteiraInvestimentoController.js
const CarteiraInvestimento = require('../models/CarteiraInvestimento');

const CarteiraInvestimentoController = {
    // Retorna todas as carteiras de investimento de um usuário
    getAll: async (req, res) => {
        try {
            const carteiras = await CarteiraInvestimento.find({ usuario_id: req.userId }); // Considera que o usuário está autenticado e seu ID está em req.userId
            res.json(carteiras);
        } catch (error) {
            console.error('Erro ao buscar carteiras:' + error);
            res.status(500).json({ error: "Erro ao buscar carteiras de investimentos" });
        }
    },

    // Retorna uma carteira específica por ID
    get: async (req, res) => {
        try {
            const carteira = await CarteiraInvestimento.findOne({ 
                _id: req.params.id, 
                usuario_id: req.userId // Verifica que a carteira pertence ao usuário autenticado
            });

            if (!carteira) {
                return res.status(404).json({ error: "Carteira de investimentos não encontrada" });
            }
            res.json(carteira);
        } catch (error) {
            console.error('Erro ao buscar carteira:', error);
            res.status(500).json({ error: "Erro ao buscar a carteira de investimentos" });
        }
    },

    // Cria uma nova carteira de investimento
    create: async (req, res) => {
        const { nome_carteira, objetivo_carteira_descricao } = req.body;

        if (!nome_carteira) {
            return res.status(400).json({ error: "O campo 'nome_carteira' é obrigatório." });
        }

        try {
            const novaCarteira = new CarteiraInvestimento({
                usuario_id: req.userId, // Associa ao usuário autenticado
                nome_carteira,
                objetivo_carteira_descricao
            });

            await novaCarteira.save();
            res.status(201).json(novaCarteira);
        } catch (error) {
            console.error('Erro ao criar carteira:', error);
            res.status(500).json({ error: "Erro ao criar a carteira de investimentos." });
        }
    },

    // Atualiza uma carteira existente
    update: async (req, res) => {
        const { nome_carteira, objetivo_carteira_descricao } = req.body;

        try {
            const carteiraAtualizada = await CarteiraInvestimento.findOneAndUpdate(
                { _id: req.params.id, usuario_id: req.userId }, // Garante que a carteira pertence ao usuário autenticado
                { nome_carteira, objetivo_carteira_descricao },
                { new: true }
            );

            if (!carteiraAtualizada) {
                return res.status(404).json({ error: "Carteira de investimentos não encontrada" });
            }

            res.json(carteiraAtualizada);
        } catch (error) {
            console.error('Erro ao atualizar carteira:', error);
            res.status(500).json({ error: "Erro ao atualizar a carteira de investimentos" });
        }
    },

    // Deleta uma carteira existente
    delete: async (req, res) => {
        try {
            const carteiraDeletada = await CarteiraInvestimento.findOneAndDelete({
                _id: req.params.id,
                usuario_id: req.userId // Garante que a carteira pertence ao usuário autenticado
            });

            if (!carteiraDeletada) {
                return res.status(404).json({ error: "Carteira de investimentos não encontrada" });
            }

            res.json({ message: "Carteira de investimentos deletada com sucesso" });
        } catch (error) {
            console.error('Erro ao deletar carteira:', error);
            res.status(500).json({ error: "Erro ao deletar a carteira de investimentos" });
        }
    }
};

module.exports = CarteiraInvestimentoController;
