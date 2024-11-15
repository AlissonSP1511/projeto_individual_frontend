  // projeto_individual_frontend/avaliacao_2/src/components/LoginForm.js
"use client";
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { TextField, Button, Box, Alert } from '@mui/material';
import Api_avaliacao_2DB from 'services/Api_avaliacao_2DB';

const LoginForm = () => {
  const router = useRouter();

  // Esquema de validação
  const validationSchema = Yup.object({
    email: Yup.string().email('Email inválido').required('Obrigatório'),
    password: Yup.string().required('Obrigatório')
  });

  // const handleLogin = async (values) => {
  //   try {
  //     const response = await Api_avaliacao_2DB.post('/login', values);
  //     localStorage.setItem('token', response.data.token);
  //     localStorage.setItem('userId', response.data.user.id);
  //     localStorage.setItem('userName', response.data.user.nome);

  //     Api_avaliacao_2DB.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
  //     router.push('/pages/contasBancarias');
  //   } catch (error) {
  const handleLogin = async (values) => {
    try {
      const response = await Api_avaliacao_2DB.post('/login', values);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('userName', response.data.user.nome);

      Api_avaliacao_2DB.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      router.push('/pages/contasBancarias');
    } catch (error) {

      console.error('Erro de login:', error);
      alert('Erro ao fazer login. Verifique suas credenciais.');
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
              className="bg-primary bg-opacity-50 text-gray text-black fw-bolder fs-6"
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