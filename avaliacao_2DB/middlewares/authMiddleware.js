// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = "sua_chave_secreta"; // Mesma chave secreta do token

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: "Acesso não autorizado" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId; // Associa o ID do usuário autenticado à requisição
        next();
    } catch (error) {
        res.status(401).json({ error: "Token inválido ou expirado" });
    }
};

module.exports = authMiddleware;
