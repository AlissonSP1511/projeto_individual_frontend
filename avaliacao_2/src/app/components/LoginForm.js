// avaliacao_2/src/app/components/LoginForm.js
"use client";
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Api_avaliacao_2DB from '../services/Api_avaliacao_2DB';

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
      {({ errors, touched }) => (
        <Form>
          <div>
            <label>Email</label>
            <Field name="email" type="email" />
            {errors.email && touched.email ? <div>{errors.email}</div> : null}
          </div>

          <div>
            <label>Senha</label>
            <Field name="password" type="password" />
            {errors.password && touched.password ? <div>{errors.password}</div> : null}
          </div>

          <button type="submit">Entrar</button>
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