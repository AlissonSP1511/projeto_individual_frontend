"use client"
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Atualização aqui
import Api_avaliacao_2DB from '../services/Api_avaliacao_2DB';

const LoginForm = () => {
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string().email('Email inválido').required('Obrigatório'),
    password: Yup.string().required('Obrigatório')
  });

  const handleSubmit = async (values) => {
    try {
      const response = await Api_avaliacao_2DB.post('/login', values);
      router.push('/pages/receitas');
    } catch (error) {
      console.error('Erro de login:', error);
    }
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
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
