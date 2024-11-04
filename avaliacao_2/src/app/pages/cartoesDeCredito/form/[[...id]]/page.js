'use client'

import React, { useEffect, useState } from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FaSave } from 'react-icons/fa';
import { MdOutlineArrowBack } from 'react-icons/md';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Pagina from "app/components/Pagina";
import Api_avaliacao_2DB from "app/services/Api_avaliacao_2DB";
import Swal from 'sweetalert2';

const validationSchema = Yup.object().shape({
  numero: Yup.string()
    .required('Número do cartão é obrigatório')
    .matches(/^[0-9]{16}$/, 'Número do cartão deve ter 16 dígitos'),
  nome: Yup.string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),
  limite: Yup.number()
    .min(0, 'Limite não pode ser negativo')
    .required('Limite é obrigatório'),
  vencimento: Yup.date()
    .required('Data de vencimento é obrigatória')
    .min(new Date(), 'Data de vencimento deve ser futura'),
});

export default function CartaoCreditoForm({ params }) {
  const route = useRouter();
  const [cartao, setCartao] = useState({
    numero: '',
    nome: '',
    limite: '',
    vencimento: '',
    usado: 0
  });
  const { id } = params?.id ? params : { id: null };

  useEffect(() => {
    if (id) {
      Api_avaliacao_2DB.get(`/cartoes/${id}`)
        .then(result => {
          const cartaoData = result.data;
          cartaoData.vencimento = cartaoData.vencimento ? 
            new Date(cartaoData.vencimento).toISOString().split('T')[0] : '';
          setCartao(cartaoData);
        })
        .catch(error => {
          console.error('Erro ao carregar cartão:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Não foi possível carregar os dados do cartão.'
          });
        });
    }
  }, [id]);

  async function salvar(dados) {
    try {
      const endpoint = id ? `/cartoes/${id}` : '/cartoes';
      const method = id ? 'put' : 'post';

      await Api_avaliacao_2DB[method](endpoint, dados);
      
      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: `Cartão ${id ? 'atualizado' : 'cadastrado'} com sucesso!`,
        showConfirmButton: false,
        timer: 1500
      });

      route.push('/pages/cartoesDeCredito');
    } catch (error) {
      console.error('Erro ao salvar cartão:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: `Não foi possível ${id ? 'atualizar' : 'cadastrar'} o cartão.`
      });
    }
  }

  return (
    <Pagina titulo={id ? 'Editar Cartão' : 'Novo Cartão'}>
      <Card className="card-primary">
        <Card.Header>
          <Card.Title>{id ? 'Editar Cartão' : 'Novo Cartão'}</Card.Title>
        </Card.Header>
        <Formik
          initialValues={cartao}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={values => salvar(values)}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Número do Cartão</Form.Label>
                      <Form.Control
                        type="text"
                        name="numero"
                        value={values.numero}
                        onChange={handleChange}
                        isInvalid={touched.numero && errors.numero}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.numero}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome no Cartão</Form.Label>
                      <Form.Control
                        type="text"
                        name="nome"
                        value={values.nome}
                        onChange={handleChange}
                        isInvalid={touched.nome && errors.nome}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nome}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Limite</Form.Label>
                      <Form.Control
                        type="number"
                        name="limite"
                        value={values.limite}
                        onChange={handleChange}
                        isInvalid={touched.limite && errors.limite}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.limite}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Vencimento</Form.Label>
                      <Form.Control
                        type="date"
                        name="vencimento"
                        value={values.vencimento}
                        onChange={handleChange}
                        isInvalid={touched.vencimento && errors.vencimento}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.vencimento}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer className="text-center">
                <button type="submit" className="btn btn-success me-2">
                  <FaSave /> Salvar
                </button>
                <Link
                  href="/pages/cartoesDeCredito"
                  className="btn btn-danger"
                >
                  <MdOutlineArrowBack /> Voltar
                </Link>
              </Card.Footer>
            </Form>
          )}
        </Formik>
      </Card>
    </Pagina>
  );
}
