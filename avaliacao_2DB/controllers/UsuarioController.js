// avaliacao_2DB/controllers/UsuarioController.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Usuario = require('../models/Usuario');
const SECRET_KEY = "sua_chave_secreta"; // A mesma chave usada no middleware de autenticação

const UsuarioController = {
    getAll: async (req, res) => {
        const filtros = {};
        const campos = Object.keys(Usuario.schema.paths);

        for (let campo in req.query) {
            if (campos.includes(campo)) {
                filtros[campo] = { $regex: new RegExp(req.query[campo], 'i') };
            }
        }
        res.json(await Usuario.find(filtros));
    },

    get: async (req, res) => {
        try {
            res.json(await Usuario.findById(req.params.id));
        } catch (error) {
            res.status(404).json({ error: 'Registro não encontrado' });
        }
    },

    update: async (req, res) => {
        try {
            res.json(await Usuario.findByIdAndUpdate(req.params.id, req.body));
        } catch (error) {
            res.status(404).json({ error: 'Registro não encontrado' });
        }
    },

    delete: async (req, res) => {
        try {
            res.json(await Usuario.findByIdAndDelete(req.params.id));
        } catch (error) {
            res.status(404).json({ error: 'Registro não encontrado' });
        }
    },
    
    // Função de registro
    register: async (req, res) => {
        try {
            const { nome, email, password } = req.body;
            
            // Verifica se o usuário já existe
            const usuarioExistente = await Usuario.findOne({ email });
            if (usuarioExistente) {
                return res.status(400).json({ error: "Email já cadastrado" });
            }

            // Usando crypto para criar um salt e hash da senha
            const salt = crypto.randomBytes(16).toString('hex');
            const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

            // Criar novo usuário com a senha criptografada
            const novoUsuario = await Usuario.create({
                nome,
                email,
                password: `${salt}:${hash}` // Armazena salt e hash juntos
            });

            console.log("Usuário registrado com sucesso:", novoUsuario.email);
            res.status(201).json({ 
                message: "Usuário registrado com sucesso",
                user: {
                    id: novoUsuario._id,
                    nome: novoUsuario.nome,
                    email: novoUsuario.email
                }
            });
        } catch (error) {
            console.error("Erro ao registrar usuário:", error);
            res.status(500).json({ error: "Erro ao registrar usuário" });
        }
    },
    // login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            
            // Encontrar o usuário pelo email
            const usuario = await Usuario.findOne({ email });
            if (!usuario) {
                console.log("Login falhou: usuário não encontrado");
                return res.status(401).json({ error: "Credenciais inválidas" });
            }

            // Separar salt e hash armazenados
            const [salt, hashArmazenado] = usuario.password.split(':');
            
            // Gerar hash da senha fornecida com o mesmo salt
            const hashFornecido = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
            
            // Verificar se as senhas correspondem
            if (hashArmazenado !== hashFornecido) {
                console.log("Login falhou: senha incorreta");
                return res.status(401).json({ error: "Credenciais inválidas" });
            }

            // Gerar token JWT
            const token = jwt.sign(
                { userId: usuario._id },
                SECRET_KEY,
                { expiresIn: '1h' }
            );
            
            console.log("Login bem-sucedido para o usuário:", usuario.email);
            res.json({
                token,
                user: {
                    id: usuario._id,
                    nome: usuario.nome,
                    email: usuario.email
                }
            });

        } catch (error) {
            console.error("Erro no login:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    },
    
};

module.exports = UsuarioController;