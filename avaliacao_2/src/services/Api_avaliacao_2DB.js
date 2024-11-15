// projeto_individual_frontend/avaliacao_2/src/services/Api_avaliacao_2DB.js
import axios from 'axios';

const Api_avaliacao_2DB = axios.create({
    baseURL: 'http://localhost:3001/', // Certifique-se de que o IP está correto
    withCredentials: true, // Habilita o envio de cookies e credenciais
});
// Interceptor para adicionar o token em todas as requisições
Api_avaliacao_2DB.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Obtém o token do localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Adiciona o token ao cabeçalho
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Interceptor para tratar erros de autenticação
Api_avaliacao_2DB.interceptors.response.use(
    
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Redireciona para a página de login se o token expirar
            alert('Sessão expirada. Faça login novamente.');
            localStorage.removeItem('token'); // Remove o token expirado
            window.location.href = '/pages/login'; // Redireciona para a página de login
        }
        return Promise.reject(error);
    }
);

export default Api_avaliacao_2DB;
