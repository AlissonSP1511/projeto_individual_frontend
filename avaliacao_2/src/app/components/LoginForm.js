// avaliacao_2/src/app/components/LoginForm.js
"use client";
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Api_avaliacao_2DB from '../services/Api_avaliacao_2DB';
import { TextField, Button, Box, Alert } from '@mui/material';

const LoginForm = () => {
  const router = useRouter();

  // Esquema de validação
  const validationSchema = Yup.object({
    email: Yup.string().email('Email inválido').required('Obrigatório'),
    password: Yup.string().required('Obrigatório')
  });

  const handleLogin = async (values) => {
    try {
      const response = await Api_avaliacao_2DB.post('/login', values);
      console.log('Resposta do login:', response.data); // Verifica se o token é recebido
      localStorage.setItem('token', response.data.token); // Salva o token no localStorage
      Api_avaliacao_2DB.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`; // Configura o token nas próximas requisições
      console.log("Token salvo:", localStorage.getItem('token')); // Verifique o console
      router.push('/pages/dashboard'); // Redireciona para página após login bem-sucedido
    } catch (error) {
      console.error('Erro de login:', error);
      if (error.response && error.response.status === 401) {
        alert('Sessão expirada. Faça login novamente.');
      } else {
        alert('Erro ao fazer login. Verifique suas credenciais.');
      }
    }
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleLogin} // Chama handleLogin ao enviar o formulário
    >
      {({ errors, touched, handleChange, handleBlur }) => (
        <Form>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              name="email"
              label="Email"
              type="email"
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />

            <TextField
              fullWidth
              name="password"
              label="Senha"
              type="password"
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />

            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Entrar
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;


// // Função de login
// const handleLogin = async (values) => {
//   try {
//     const response = await Api_avaliacao_2DB.post('/login', values);
//     localStorage.setItem('token', response.data.token); // Salva o token no localStorage
//     localStorage.setItem('authToken', response.data.token);
//     console.log(response.data);
//     router.push('/pages/dashboard'); // Redireciona após login bem-sucedido
//   } catch (error) {
//     console.error('Erro de login:', error);
//     alert('Erro ao fazer login. Verifique suas credenciais.');
//   }
// };


// const handleLogin = async (values) => {
//   try {
//     const response = await Api_avaliacao_2DB.post('/login', values);
//     console.log('Resposta do login:', response.data); // Verifica se o token é recebido
//     localStorage.setItem('token', response.data.token); // Salva o token no localStorage
//     Api_avaliacao_2DB.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`; // Configura o token nas próximas requisições
//     router.push('/pages/dashboard'); // Redireciona para página após login bem-sucedido
//   } catch (error) {
//     console.error('Erro de login:', error);
//     if (error.response && error.response.status === 401) {
//       alert('Sessão expirada. Faça login novamente.');
//     } else {
//       alert('Erro ao fazer login. Verifique suas credenciais.');
//     }
//   }
// };