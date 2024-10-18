// avaliacao_2DB/index.js
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({
    origin: 'http://localhost:3000', // Permite o acesso apenas do frontend no localhost:3000
    credentials: true, // Se estiver usando cookies ou autenticação baseada em sessão
  }));

const conn = require('./db/Conn');
conn();

const routes = require('./routes/Router');
app.use('/', routes);

app.listen(3001, () => {
    console.log("Servidor iniciado!");
})
