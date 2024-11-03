// avaliacao_2/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async headers() {
      return [
        {
          // Definindo as permissões CORS para todas as rotas
          source: '/(.*)',
          headers: [
            { key: 'Access-Control-Allow-Credentials', value: 'true' },
            { key: 'Access-Control-Allow-Origin', value: 'http://192.168.1.45:3000'}, // Ou substitua '*' pelo IP específico, ex: 'http://192.168.1.45:3000'
            { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
            { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, Content-Type, Authorization' },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  