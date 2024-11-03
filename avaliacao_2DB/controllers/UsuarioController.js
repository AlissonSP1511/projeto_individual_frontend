// avaliacao_2DB/controllers/UsuarioController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const SECRET_KEY = "sua_chave_secreta"; // A mesma chave usada no middleware de autenticação
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

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

    create: async (req, res) => {
        try {
            // Hash da senha antes de criar o usuário
            req.body.password = await bcrypt.hash(req.body.password, 10);
            res.json(await Usuario.create(req.body));
        } catch (error) {
            res.status(400).json(error);
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
        const { nome, email, password } = req.body;
        const senha = password.trim();
        
        try {
            const hashedPassword = await bcrypt.hash(senha, saltRounds);
            const senhahashed = hashedPassword.trim();
            
            const existingUser = await Usuario.findOne({ email });
            if (existingUser) {
                console.log("O usuário já existe");
                return res.status(409).json({ error: "O usuário já existe" });
            }
    
            const novoUsuario = new Usuario({ nome, email, password: senhahashed });
            await novoUsuario.save();
            
            console.log("Usuário registrado com sucesso:", novoUsuario);
            res.status(201).json({ message: "Usuário registrado com sucesso" });
        } catch (error) {
            console.error("Erro ao registrar o usuário:", error);
            res.status(500).json({ error: "Erro ao registrar o usuário" });
        }
    },
    
    login: async (req, res) => {
        const { email, password } = req.body;
        const senhalogin = password.trim();
        console.log("___Tentativa de login para o e-mail:", email);
        console.log("___Senha fornecida:", senhalogin);
        

        const usuarioEncontrado = await Usuario.findOne({ email }); 
        const senhadb = usuarioEncontrado.password.trim();
        const isPasswordValid = await bcrypt.compare(senhalogin, senhadb);
        console.log("___Comparando a senha armazenada (hash) com a senha fornecida:", isPasswordValid);
        try {
            // Encontrar o usuário pelo e-mail
    
            if (!usuarioEncontrado) {
                console.log("Login falhou: usuário não encontrado");
                return res.status(401).json({ error: "Credenciais inválidas" });
            }
    
            console.log("___Senha armazenada (hash):", senhadb);
    
            // Comparar a senha fornecida com a senha armazenada
            console.log("___Resultado da comparação de senha:", isPasswordValid);
    
            if (!isPasswordValid) {
                console.log("Login falhou: senha incorreta");
                return res.status(401).json({ error: "Credenciais inválidas" });
            }
    
            // Gerar o token de autenticação
            const token = jwt.sign({ userId: usuarioEncontrado._id }, SECRET_KEY, { expiresIn: '1h' });
            console.log("Login bem-sucedido para o usuário:", usuarioEncontrado.email);
            res.json({
                token,
                user: {
                    id: usuarioEncontrado._id,
                    email: usuarioEncontrado.email,
                    nome: usuarioEncontrado.nome
                }
            });
        } catch (error) {
            console.error("Erro no login:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
    
    
};

module.exports = UsuarioController;

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


// // Função de login
// login: async (req, res) => {
    //     const { email, password } = req.body;
    //     console.log("Login:", email, password);
    //     console.log("Chave secreta:", SECRET_KEY);
    //     console.log('req.body:', req.body);
    //     console.log(Usuario);
    
    //     const bcrypt = require('bcrypt');
    //     const password2 = "qwerty";
    //     const hash = "$2b$10$2YKp98eButrSE.UJ30gxLu5ue8omxxqw91txwEZffjiImtNl75VGK"; // hash do MongoDB
    
    //     bcrypt.compare(password2, hash, (err, result) => {
//         if (err) console.error("Erro na comparação:", err);
//         console.log("Resultado da comparação no teste isolado:", result); // Deve ser 'true'
//         console.log("Senha fornecida:", password2);
//         console.log("Senha armazenada (hash):", hash);
//     });

//     try {
//         // const usuario = await Usuario.findOne({ email });
//         const usuario = await Usuario.findOne({ email: req.body.email });
//         console.log("Usuário recuperado:", usuario);
//         console.log("Tipo de senha fornecida:", typeof req.body.password); // Esperado: 'string'

//         if (!usuario) {
//             console.log("Usuário não encontrado");
//             return res.status(401).json({ error: "Usuário não encontrado" });
//         }

//         // Comparar a senha fornecida com a senha criptografada
//         const isPasswordValid = await bcrypt.compare(password, usuario.password);
//         console.log("Senha fornecida:", password);
//         console.log("Senha armazenada (hash):", usuario.password);
//         console.log("Resultado da comparação:", isPasswordValid);

//         bcrypt.compare(req.body.password, usuario.password, (err, isMatch) => {
    //             if (err) {
        //                 console.error("Erro ao comparar senhas:", err);
        //             } else {
//                 console.log("Resultado da comparação:", isMatch);
//             }
//         });
//         const isPasswordValid2 = await bcrypt.compare(password.trim(), usuario.password);
//         console.log('isPasswordValid2:', isPasswordValid2);


//         if (!isPasswordValid) {
    //             return res.status(401).json({ error: "Senha incorreta" });
    //         }
    
    //         // Gerar o token JWT
    //         const token = jwt.sign({ userId: usuario._id }, SECRET_KEY, { expiresIn: '1h' });
    //         res.json({ token });
    //         console.log("Login bem-sucedido para o usuário:", usuario.email);
    //     } catch (error) {
//         console.error("Erro no login:", error);
//         res.status(500).json({ error: "Erro interno do servidor" });
//     }
// },