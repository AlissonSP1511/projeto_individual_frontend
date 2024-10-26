// avaliacao_2DB/db/Conn.js
const mongoose = require('mongoose');
async function main() {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@avaliacao2db.xutu9.mongodb.net/avaliacao_2DB?retryWrites=true&w=majority&appName=avaliacao2DB`);
        console.log('Conectou ao MongoDB!');
    } catch (error) {
        console.log('Erro ao conectar no MongoDB', error);
    }
}
module.exports = main