// // src/controllers/UsuarioController.js
// const Usuario = require('../models/Usuario'); // Modelo de usuários

// const UsuarioController = {
//     getAll: async (req, res) => {
//         try {
//             const usuarios = await Usuario.find(); // Busca todos os usuários
//             res.json(usuarios);
//         } catch (error) {
//             res.status(500).json({ error: "Erro ao buscar usuários" });
//         }
//     },

//     get: async (req, res) => {
//         try {
//             const usuario = await Usuario.findById(req.params.id); // Busca usuário pelo ID
//             if (!usuario) {
//                 return res.status(404).json({ error: "Usuário não encontrado" });
//             }
//             res.json(usuario);
//         } catch (error) {
//             res.status(500).json({ error: "Erro ao buscar o usuário" });
//         }
//     },

//     create: async (req, res) => {
//         const { nome, email } = req.body;
//         try {
//             const novoUsuario = await Usuario.create({ nome, email });
//             // Cria uma conta para o usuário automaticamente após criar o usuário
//             const novaConta = await Conta.create({
//                 usuario_id: novoUsuario._id, // Utiliza o _id gerado automaticamente
//                 saldo: 1000, // Exemplo de saldo inicial
//                 tipo_conta: 'Corrente'
//             });
//             res.status(201).json({ usuario: novoUsuario, conta: novaConta });
//         } catch (error) {
//             res.status(400).json({ error: "Erro ao criar o usuário ou a conta." });
//         }
//     },

//     update: async (req, res) => {
//         try {
//             const usuarioAtualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
//             if (!usuarioAtualizado) {
//                 return res.status(404).json({ error: "Usuário não encontrado" });
//             }
//             res.json(usuarioAtualizado);
//         } catch (error) {
//             res.status(500).json({ error: "Erro ao atualizar o usuário" });
//         }
//     },

//     delete: async (req, res) => {
//         try {
//             const usuarioDeletado = await Usuario.findByIdAndDelete(req.params.id);
//             if (!usuarioDeletado) {
//                 return res.status(404).json({ error: "Usuário não encontrado" });
//             }
//             res.json({ message: "Usuário deletado com sucesso" });
//         } catch (error) {
//             res.status(500).json({ error: "Erro ao deletar o usuário" });
//         }
//     }
// };

// module.exports = UsuarioController;


const { json } = require("express");
const Usuario = require("../models/Usuario")

const UsuarioController = {
    getAll: async (req, res) => {
        const filtros = {}
        const campos = Object.keys(Usuario.schema.paths)

        for(let campo in req.query){
            if(campos.includes(campo)){
                filtros[campo] = {$regex: new RegExp(req.query[campo], 'i') }
            }
        }

        res.json(await Usuario.find(filtros))
    },
    get: async (req, res) => {
        try {
            res.json(await Usuario.findById(req.params.id))
        } catch (error) {
            res.status(404).json({error: 'Registro não encontrado'})
        }
    },
    create: async (req, res) => {
        try {
            res.json(await Usuario.create(req.body))
        } catch (error) {
            res.status(400).json(error)
        }
    },
    update: async (req, res) => {
        try {
            res.json(await Usuario.findByIdAndUpdate(req.params.id, req.body))
        } catch (error) {
            res.status(404).json({error: 'Registro não encontrado'})
        }
    },
    delete: async (req, res) => {
        try {
            res.json(await Usuario.findByIdAndDelete(req.params.id))
        } catch (error) {
            res.status(404).json({error: 'Registro não encontrado'})
        }
    },
}

module.exports = UsuarioController