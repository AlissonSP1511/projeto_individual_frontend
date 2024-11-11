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
    },

    addTransacao: async (req, res) => {
        try {
            const conta = await Conta.findOne({
                _id: req.params.id,
                usuario_id: req.userId
            });

            if (!conta) {
                return res.status(404).json({ error: "Conta não encontrada" });
            }

            const novaTransacao = {
                data: req.body.data,
                descricao: req.body.descricao,
                tipo_transacao: req.body.tipo_transacao,
                tipo_pagamento: req.body.tipo_pagamento,
                valor: Number(req.body.valor),
                categoria_id: req.body.categoria_id
            };

            // Atualiza o saldo
            const valorNumerico = Number(novaTransacao.valor);
            if (novaTransacao.tipo_transacao === 'Entrada') {
                conta.saldo = Number(conta.saldo) + valorNumerico;
            } else {
                conta.saldo = Number(conta.saldo) - valorNumerico;
            }

            conta.transacoes.push(novaTransacao);
            await conta.save();

            res.status(201).json(conta);
        } catch (error) {
            console.error('Erro ao adicionar transação:', error);
            res.status(500).json({ error: "Erro ao adicionar transação", details: error.message });
        }
    },

    removeTransacao: async (req, res) => {
        try {
            const conta = await Conta.findOne({
                _id: req.params.contaId,
                usuario_id: req.userId
            });

            if (!conta) {
                return res.status(404).json({ error: "Conta não encontrada" });
            }

            const transacao = conta.transacoes.id(req.params.transacaoId);
            if (!transacao) {
                return res.status(404).json({ error: "Transação não encontrada" });
            }

            // Atualiza o saldo ao remover a transação
            if (transacao.tipo_transacao === 'Entrada') {
                conta.saldo -= transacao.valor;
            } else {
                conta.saldo += transacao.valor;
            }

            conta.transacoes.pull(req.params.transacaoId);
            await conta.save();

            res.json(conta);
        } catch (error) {
            res.status(500).json({ error: "Erro ao remover transação" });
        }
    },

    getTransacoesPorPeriodo: async (req, res) => {
        try {
            const { dataInicial, dataFinal } = req.query;
            const conta = await Conta.findOne({
                _id: req.params.id,
                usuario_id: req.userId
            });

            if (!conta) {
                return res.status(404).json({ error: "Conta não encontrada" });
            }

            const transacoesFiltradas = conta.transacoes.filter(t => {
                const data = new Date(t.data);
                return data >= new Date(dataInicial) && data <= new Date(dataFinal);
            });

            res.json(transacoesFiltradas);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar transações" });
        }
    },
    updateTransacao: async (req, res) => {
        try {
            const conta = await Conta.findOne({
                _id: req.params.id,
                usuario_id: req.userId
            });

            if (!conta) {
                return res.status(404).json({ error: "Conta não encontrada" });
            }

            const transacao = conta.transacoes.id(req.params.transacaoId);
            if (!transacao) {
                return res.status(404).json({ error: "Transação não encontrada" });
            }

            // Reverte o efeito da transação antiga no saldo
            if (transacao.tipo_transacao === 'Entrada') {
                conta.saldo = Number(conta.saldo) - Number(transacao.valor);
            } else {
                conta.saldo = Number(conta.saldo) + Number(transacao.valor);
            }

            // Atualiza os campos da transação
            Object.assign(transacao, {
                data: req.body.data,
                descricao: req.body.descricao,
                tipo_transacao: req.body.tipo_transacao,
                tipo_pagamento: req.body.tipo_pagamento,
                valor: Number(req.body.valor),
                categoria_id: req.body.categoria_id
            });

            // Aplica o efeito da nova transação no saldo
            if (transacao.tipo_transacao === 'Entrada') {
                conta.saldo = Number(conta.saldo) + Number(transacao.valor);
            } else {
                conta.saldo = Number(conta.saldo) - Number(transacao.valor);
            }

            await conta.save();
            res.json(conta);
        } catch (error) {
            console.error('Erro ao atualizar transação:', error);
            res.status(500).json({ error: "Erro ao atualizar transação", details: error.message });
        }
    },
};

module.exports = ContaController;
