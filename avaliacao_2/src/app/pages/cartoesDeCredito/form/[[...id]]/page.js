// avaliacao_2/src/app/pages/cartoesDeCredito/form/[[...id]]/page.js
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
  bancoEmissor: Yup.string()
    .required('O banco emissor é obrigatório'),
  bandeira: Yup.string()
    .required('A bandeira é obrigatória'),
  numero: Yup.string()
    .required('O número do cartão é obrigatório')
    .length(16, 'O número do cartão deve ter 16 dígitos'),
  nome: Yup.string()
    .required('O nome no cartão é obrigatório'),
  limite: Yup.number()
    .required('O limite é obrigatório')
    .min(0, 'O limite deve ser maior que zero'),
  diaFechamento: Yup.number()
    .required('O dia de fechamento é obrigatório')
    .min(1, 'O dia deve ser entre 1 e 31')
    .max(31, 'O dia deve ser entre 1 e 31'),
  diaVencimento: Yup.number()
    .required('O dia de vencimento é obrigatório')
    .min(1, 'O dia deve ser entre 1 e 31')
    .max(31, 'O dia deve ser entre 1 e 31'),
  imagemCartao: Yup.string()
});

export default function CartaoCreditoForm({ params }) {
  const route = useRouter();
  const [userName, setUserName] = useState('');
  const [initialUserId, setInitialUserId] = useState('');
  const [cartao, setCartao] = useState({
    numero: '',
    nome: '',
    bancoEmissor: '',
    bandeira: '',
    imagemCartao: '',
    limite: '',
    diaFechamento: '',
    diaVencimento: '',
    limiteUtilizado: 0,
    comprasParceladas: [],
    comprasAVista: [],
    usuario_id: ''
  });

  const id = React.use(params)?.id?.[0] || null;
  console.log('ID recebido nos parâmetros:', id);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setInitialUserId(storedUserId);

    if (!id) {
      console.log('Nenhum ID encontrado - modo criação');
      return;
    }

    const fetchCartao = async () => {
      console.log('Buscando cartão - ID:', id, 'UserID:', storedUserId);

      try {
        const response = await Api_avaliacao_2DB.get(`/cartaocredito/${id}`, {
          params: { usuario_id: storedUserId }
        });

        console.log('Resposta da API:', response.data);

        if (!response.data) {
          console.log('caiu no if !response.data')
          throw new Error('Dados do cartão não encontrados');
        }

        const cartaoData = response.data;
        if (cartaoData.usuario_id !== storedUserId) {
          console.log('caiu no if cartaoData.usuario_id !== storedUserId')
          throw new Error('Acesso não autorizado a este cartão');
        }

        setCartao({
          _id: cartaoData._id,
          numero: cartaoData.numero || '',
          nome: cartaoData.nome || '',
          bancoEmissor: cartaoData.bancoEmissor || '',
          bandeira: cartaoData.bandeira || '',
          imagemCartao: cartaoData.imagemCartao || '',
          limite: Number(cartaoData.limite || 0),
          diaFechamento: Number(cartaoData.diaFechamento || 1),
          diaVencimento: Number(cartaoData.diaVencimento || 1),
          limiteUtilizado: Number(cartaoData.limiteUtilizado || 0),
          comprasParceladas: cartaoData.comprasParceladas || [],
          comprasAVista: cartaoData.comprasAVista || [],
          usuario_id: cartaoData.usuario_id
        });

      } catch (error) {
        let mensagemErro = 'Não foi possível carregar os dados do cartão.';
        if (error.response?.status === 500) {
          mensagemErro = 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
        }

        console.error('Erro ao carregar cartão:', {
          tipo: error.name,
          mensagem: error.message,
          status: error.response?.status,
          resposta: error.response?.data,
          cartaoId: id,
          userId: storedUserId
        });

        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar cartão',
          text: mensagemErro
        });
      }
    };

    fetchCartao();
  }, [id]);

  async function salvar(dados) {
    const usuarioLogado = localStorage.getItem('userId');
    
    if (!usuarioLogado) {
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Usuário não está logado. Por favor, faça login novamente.'
      });
      return;
    }

    const dadosParaSalvar = {
      _id: id ? id : undefined,
      numero: dados.numero,
      nome: dados.nome,
      bancoEmissor: dados.bancoEmissor,
      bandeira: dados.bandeira,
      imagemCartao: dados.imagemCartao,
      limite: Number(dados.limite),
      diaFechamento: Number(dados.diaFechamento),
      diaVencimento: Number(dados.diaVencimento),
      usuario_id: usuarioLogado,
      limiteUtilizado: Number(dados.limiteUtilizado || 0),
      comprasParceladas: dados.comprasParceladas || [],
      comprasAVista: dados.comprasAVista || []
    };

    try {
      const endpoint = id ? `/cartaocredito/${id}` : '/cartaocredito';
      const method = id ? 'put' : 'post';
      const response = await Api_avaliacao_2DB[method](endpoint, dadosParaSalvar);
      
      console.log('Resposta da API:', response.data);

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
      
      // Tratamento específico das mensagens de erro do backend
      let mensagemErro = 'Não foi possível salvar o cartão.';
      
      if (error.response) {
        // Se o backend retornou uma resposta com erro
        if (error.response.data && error.response.data.error) {
          mensagemErro = error.response.data.error;
        } else if (error.response.status === 400) {
          mensagemErro = 'Dados inválidos. Verifique as informações e tente novamente.';
        } else if (error.response.status === 404) {
          mensagemErro = 'Cartão não encontrado.';
        } else if (error.response.status === 403) {
          mensagemErro = 'Você não tem permissão para realizar esta operação.';
        } else if (error.response.status === 500) {
          mensagemErro = 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
        }
      }

      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: mensagemErro,
        confirmButtonText: 'OK'
      });
    }
  }

  return (
    <Pagina titulo={id ? 'Editar Cartão' : 'Novo Cartão'}>
      <Card>
        <Card.Header>
          <Card.Title>{id ? 'Editar Cartão' : 'Novo Cartão'}</Card.Title>
        </Card.Header>
        <Formik
          initialValues={id ? cartao : {
            numero: '',
            nome: '',
            bancoEmissor: '',
            bandeira: '',
            imagemCartao: '',
            limite: '',
            diaFechamento: '',
            diaVencimento: '',
            limiteUtilizado: 0,
            comprasParceladas: [],
            comprasAVista: [],
            usuario_id: initialUserId
          }}
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
                      <Form.Label>Usuário</Form.Label>
                      <Form.Control
                        type="text"
                        value={userName}
                        disabled
                        plaintext
                      />
                      <Form.Control
                        type="hidden"
                        name="usuario_id"
                        value={values.usuario_id}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Banco Emissor</Form.Label>
                      <Form.Control
                        type="text"
                        name="bancoEmissor"
                        value={values.bancoEmissor}
                        onChange={handleChange}
                        isInvalid={touched.bancoEmissor && errors.bancoEmissor}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.bancoEmissor}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bandeira</Form.Label>
                      <Form.Select
                        name="bandeira"
                        value={values.bandeira}
                        onChange={handleChange}
                        isInvalid={touched.bandeira && errors.bandeira}
                      >
                        <option value="">Selecione a bandeira</option>
                        <option value="Visa">Visa</option>
                        <option value="MasterCard">MasterCard</option>
                        <option value="Elo">Elo</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.bandeira}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Número</Form.Label>
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
                      <Form.Label>Nome</Form.Label>
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
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Dia de Fechamento</Form.Label>
                      <Form.Control
                        type="number"
                        name="diaFechamento"
                        value={values.diaFechamento}
                        onChange={handleChange}
                        isInvalid={touched.diaFechamento && errors.diaFechamento}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.diaFechamento}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Dia de Vencimento</Form.Label>
                      <Form.Control
                        type="number"
                        name="diaVencimento"
                        value={values.diaVencimento}
                        onChange={handleChange}
                        isInvalid={touched.diaVencimento && errors.diaVencimento}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.diaVencimento}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Imagem do Cartão (URL)</Form.Label>
                      <Form.Control
                        type="text"
                        name="imagemCartao"
                        value={values.imagemCartao}
                        onChange={handleChange}
                        isInvalid={touched.imagemCartao && errors.imagemCartao}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.imagemCartao}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <div className="d-flex justify-content-between">
                  <Link href="/pages/cartoesDeCredito" className="btn btn-outline-dark">
                    <MdOutlineArrowBack /> Voltar
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    <FaSave /> Salvar
                  </button>
                </div>
              </Card.Footer>
            </Form>
          )}
        </Formik>
      </Card>
    </Pagina>
  );
}
