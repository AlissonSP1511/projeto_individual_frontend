// avaliacao_2DB/index.js
const express = require('express');
const app = express();
const cors = require('cors');
// Middleware para interpretar o corpo da requisição
app.use(express.json());
// Middleware para interpretar o corpo da requisição
app.use(express.urlencoded({ extended: false }));

// Middleware para habilitar o CORS
app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
}));

// Middleware para log dos acessos
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} - ${req.url}`);
    next(); // Passa para a próxima função de middleware
});

const conn = require('./db/Conn');
conn();

const routes = require('./routes/Router');
app.use('/', routes);

app.listen(3001, () => {
    console.log("Servidor iniciado!");
})
