// components/RegisterForm.js
"use client"
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Api_avaliacao_2DB from '../services/Api_avaliacao_2DB';
import { TextField, Button, Box, Alert } from '@mui/material';

const RegisterForm = () => {
  const router = useRouter();

  const validationSchema = Yup.object({
    nome: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    password: Yup.string().min(6, 'A senha deve ter pelo menos 6 caracteres').required('Senha é obrigatória')
  });

  const handleSubmit = async (values) => {
    try {
      await Api_avaliacao_2DB.post('/register', values);
      alert('Usuário cadastrado com sucesso!');
      router.push('/pages/login'); // Redireciona para a página de login após o cadastro
    } catch (error) {
      console.error('Erro no cadastro:', error);
      alert('Erro ao cadastrar o usuário');
    }
  };

  return (
    <Formik
      initialValues={{ nome: '', email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, handleChange, handleBlur }) => (
        <Form>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              name="nome"
              label="Nome"
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.nome && Boolean(errors.nome)}
              helperText={touched.nome && errors.nome}
            />

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
              Cadastrar
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
