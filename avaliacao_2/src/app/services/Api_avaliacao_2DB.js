// // src/services/Api_avaliacao_2DB.js
// import axios from 'axios';

// const Api_avaliacao_2DB = axios.create({
//     baseURL: 'http://192.168.1.45:3001/', // Altere para o IP correto se necessário
//     withCredentials: true, // Habilita o envio de cookies e credenciais
// });

// // Se você quiser adicionar interceptores para tratar erros ou respostas, pode fazê-lo aqui
// Api_avaliacao_2DB.interceptors.response.use(
//     response => response,
//     error => {
//         // Tratar o erro conforme necessário
//         return Promise.reject(error);
//     }
// );

// export default Api_avaliacao_2DB;

// src/services/Api_avaliacao_2DB.js
import axios from 'axios';

const Api_avaliacao_2DB = axios.create({
    baseURL: 'http://192.168.1.45:3001/', // Certifique-se de que o IP está correto
    withCredentials: true, // Habilita o envio de cookies e credenciais
});

// Adiciona o token JWT no cabeçalho das requisições se estiver disponível
Api_avaliacao_2DB.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Obtém o token do localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Adiciona o token ao cabeçalho
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor para tratar erros de resposta
Api_avaliacao_2DB.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Redireciona para a página de login se o token expirar
            alert('Sessão expirada. Faça login novamente.');
            localStorage.removeItem('token'); // Remove o token expirado
            window.location.href = '/login'; // Redireciona para a página de login
        }
        return Promise.reject(error);
    }
);

export default Api_avaliacao_2DB;
