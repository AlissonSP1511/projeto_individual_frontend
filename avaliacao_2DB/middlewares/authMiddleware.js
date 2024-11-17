// avaliacao_2DB/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = "sua_chave_secreta"; // Mesma chave secreta do token
const Usuario = require('../models/Usuario');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: "Token não fornecido" });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;
        
        // Verificar se o usuário ainda existe
        const usuario = await Usuario.findById(decoded.userId);
        if (!usuario) {
            return res.status(401).json({ error: "Usuário não encontrado" });
        }

        next();
    } catch (error) {
        res.status(401).json({ error: "Token inválido ou expirado" });
    }
};

module.exports = authMiddleware;


// const jwt = require('jsonwebtoken');
// const Usuario = require('../models/Usuario');

// // Carregar a chave secreta do arquivo .env
// const SECRET_KEY = process.env.SECRET_KEY || "chave_secreta_padrão"; // Substituir pela chave real no .env

// const authMiddleware = async (req, res, next) => {
//     try {
//         // Verificar o token no cabeçalho Authorization
//         const token = req.header('Authorization')?.replace('Bearer ', '');
//         if (!token) {
//             return res.status(401).json({ error: "Token não fornecido" });
//         }

//         // Decodificar o token
//         const decoded = jwt.verify(token, SECRET_KEY);

//         // Procurar o usuário no banco de dados
//         const usuario = await Usuario.findById(decoded.userId);
//         if (!usuario) {
//             return res.status(401).json({ error: "Usuário não encontrado" });
//         }

//         // Associar os dados do usuário à requisição
//         req.user = usuario;

//         // Passar para o próximo middleware ou rota
//         next();
//     } catch (error) {
//         console.error('Erro na autenticação:', error.message);
//         res.status(401).json({ error: "Token inválido ou expirado" });
//     }
// };

// module.exports = authMiddleware;
