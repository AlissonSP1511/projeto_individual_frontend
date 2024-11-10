// avaliacao_2DB/controllers/CartaoCreditoController.js
const CartaoCredito = require('../models/CartaoCredito'); // Modelo de cartão de crédito

const CartaoCreditoController = {
    getAll: async (req, res) => {
        try {
            const { usuario_id } = req.query;
            const query = usuario_id ? { usuario_id } : {};

            const cartoes = await CartaoCredito.find(query);
            res.json(cartoes);
        } catch (error) {
            console.error('Erro ao buscar cartões:', error);
            res.status(500).json({ error: "Erro ao buscar cartões de crédito" });
        }
    },

    get: async (req, res) => {
        try {
            const { id } = req.params;
            const { usuario_id } = req.query;

            const cartao = await CartaoCredito.findOne({
                _id: id,
                usuario_id: usuario_id
            });

            if (!cartao) {
                return res.status(404).json({ error: "Cartão de crédito não encontrado" });
            }
            res.json(cartao);
        } catch (error) {
            console.error('Erro ao buscar cartão:', error);
            res.status(500).json({ error: "Erro ao buscar o cartão de crédito" });
        }
    },

    create: async (req, res) => {
        try {
            const {
                numero,
                nome,
                bancoEmissor,
                bandeira,
                imagemCartao,
                limite,
                diaFechamento,
                diaVencimento,
                usuario_id
            } = req.body;

            if (!numero || !nome || !bancoEmissor || !bandeira || !limite ||
                !diaFechamento || !diaVencimento || !usuario_id) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios" });
            }

            if (diaFechamento < 1 || diaFechamento > 31 || 
                diaVencimento < 1 || diaVencimento > 31) {
                return res.status(400).json({ 
                    error: "Dias de fechamento e vencimento devem estar entre 1 e 31" 
                });
            }

            const cartaoExistente = await CartaoCredito.findOne({ numero, usuario_id });
            if (cartaoExistente) {
                return res.status(400).json({ error: "Número do cartão já cadastrado para este usuário" });
            }

            const novoCartao = await CartaoCredito.create({
                ...req.body,
                limiteUtilizado: 0,
                comprasParceladas: [],
                comprasAVista: []
            });

            res.status(201).json(novoCartao);
        } catch (error) {
            console.error('Erro ao criar cartão:', error);
            res.status(400).json({ error: "Erro ao criar o cartão de crédito." });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { usuario_id } = req.body;

            if (req.body.diaFechamento) {
                if (req.body.diaFechamento < 1 || req.body.diaFechamento > 31) {
                    return res.status(400).json({ 
                        error: "Dia de fechamento deve estar entre 1 e 31" 
                    });
                }
            }

            if (req.body.diaVencimento) {
                if (req.body.diaVencimento < 1 || req.body.diaVencimento > 31) {
                    return res.status(400).json({ 
                        error: "Dia de vencimento deve estar entre 1 e 31" 
                    });
                }
            }

            const cartaoAtualizado = await CartaoCredito.findOneAndUpdate(
                { _id: id, usuario_id: usuario_id },
                req.body,
                { new: true, runValidators: true }
            );

            if (!cartaoAtualizado) {
                return res.status(404).json({ error: "Cartão de crédito não encontrado" });
            }
            res.json(cartaoAtualizado);
        } catch (error) {
            console.error('Erro ao atualizar cartão:', error);
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
