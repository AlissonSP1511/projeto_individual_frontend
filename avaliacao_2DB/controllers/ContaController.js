// avaliacao_2DB/controllers/ContaController.js
const Conta = require('../models/Conta'); // Modelo de contas

const ContaController = {
    getAll: async (req, res) => {
        try {
            const contas = await Conta.find().populate('usuario_id'); // Populando a referência para mostrar dados do usuário
            res.json(contas);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar contas" });
        }
    },

    get: async (req, res) => {
        try {
            const conta = await Conta.findById(req.params.id).populate('usuario_id');
            if (!conta) {
                return res.status(404).json({ error: "Conta não encontrada" });
            }
            res.json(conta);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar a conta" });
        }
    },
    create: async (req, res) => {
        const { usuario_id, saldo, tipo_conta } = req.body; // O usuario_id será o ObjectId gerado automaticamente para o usuário

        if (!usuario_id || saldo === undefined || !tipo_conta) {
            return res.status(400).json({ error: "Os campos usuario_id, saldo e tipo_conta são obrigatórios." });
        }

        try {
            const novaConta = await Conta.create({ usuario_id, saldo, tipo_conta });
            res.status(201).json(novaConta); // Retorna a nova conta criada
        } catch (error) {
            res.status(400).json({ error: "Erro ao criar a conta." });
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
