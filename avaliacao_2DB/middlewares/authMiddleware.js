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
