// avaliacao_2DB/controllers/ContaController.js
const Conta = require('../models/Conta'); // Modelo de contas

const ContaController = {
    getAll: async (req, res) => {
        try {
            const contas = await Conta.find({ usuario_id: req.userId }).populate('usuario_id');
            res.json(contas);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar contas" });
        }
    },

    get: async (req, res) => {
        try {
            const conta = await Conta.findOne({
                _id: req.params.id,
                usuario_id: req.userId
            }).populate('usuario_id');
            
            if (!conta) {
                return res.status(404).json({ error: "Conta não encontrada" });
            }
            res.json(conta);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar a conta" });
        }
    },

    create: async (req, res) => {
        try {
            const novaConta = await Conta.create({
                ...req.body,
                usuario_id: req.userId
            });
            res.status(201).json(novaConta);
        } catch (error) {
            res.status(400).json({ error: "Erro ao criar a conta" });
        }
    },

    update: async (req, res) => {
        try {
            const contaAtualizada = await Conta.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('usuario_id');
            if (!contaAtualizada) {
                return res.status(404).json({ error: "Conta não encontrada" });
            }
            res.json(contaAtualizada);
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar a conta" });
        }
    },

    delete: async (req, res) => {
        try {
            const contaDeletada = await Conta.findByIdAndDelete(req.params.id);
            if (!contaDeletada) {
                return res.status(404).json({ error: "Conta não encontrada" });
            }
            res.json({ message: "Conta deletada com sucesso" });
        } catch (error) {
            res.status(500).json({ error: "Erro ao deletar a conta" });
        }
    }
};

module.exports = ContaController;
