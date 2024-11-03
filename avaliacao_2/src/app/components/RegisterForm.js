// components/RegisterForm.js
"use client"
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Api_avaliacao_2DB from '../services/Api_avaliacao_2DB';

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
      router.push('/login'); // Redireciona para a página de login após o cadastro
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
      {({ errors, touched }) => (
        <Form>
          <div>
            <label>Nome</label>
            <Field name="nome" type="text" />
            {errors.nome && touched.nome ? <div>{errors.nome}</div> : null}
          </div>

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

          <button type="submit">Cadastrar</button>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
