const { default: axios } = require("axios");
const Api_avaliacao_2DB = axios.create({
    baseURL: 'http://localhost:3001/'
})
export default Api_avaliacao_2DB