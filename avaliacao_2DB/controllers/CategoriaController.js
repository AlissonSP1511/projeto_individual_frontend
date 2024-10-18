// src/controllers/CategoriaController.js
const Categoria = require('../models/Categoria'); // Modelo de categoria

const CategoriaController = {
    getAll: async (req, res) => {
        try {
            const categorias = await Categoria.find(); // Busca todas as categorias
            res.json(categorias);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar categorias" });
        }
    },

    get: async (req, res) => {
        try {
            const categoria = await Categoria.findById(req.params.id); // Busca categoria pelo ID
            if (!categoria) {
                return res.status(404).json({ error: "Categoria não encontrada" });
            }
            res.json(categoria);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar a categoria" });
        }
    },

    create: async (req, res) => {
        const { descricao } = req.body; // Campo necessário
        if (!descricao) {
            return res.status(400).json({ error: "O campo descricao é obrigatório." });
        }
        try {
            const novaCategoria = await Categoria.create(req.body); // Cria nova categoria
            res.status(201).json(novaCategoria);
        } catch (error) {
            res.status(400).json({ error: "Erro ao criar a categoria." });
        }
    },

    update: async (req, res) => {
        try {
            const categoriaAtualizada = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!categoriaAtualizada) {
                return res.status(404).json({ error: "Categoria não encontrada" });
            }
            res.json(categoriaAtualizada);
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar a categoria" });
        }
    },

    delete: async (req, res) => {
        try {
            const categoriaDeletada = await Categoria.findByIdAndDelete(req.params.id);
            if (!categoriaDeletada) {
                return res.status(404).json({ error: "Categoria não encontrada" });
            }
            res.json({ message: "Categoria deletada com sucesso" });
        } catch (error) {
            res.status(500).json({ error: "Erro ao deletar a categoria" });
        }
    }
};

module.exports = CategoriaController;
