// projeto_individual_frontend/avaliacao_2/src/app/pages/cartoesDeCredito/detalhes/[id]/page.js
'use client'

import React, { useEffect, useState } from 'react';
import { Card, Container, Table, Badge, Row, Col, Modal, Form, Button } from 'react-bootstrap';
import { FaCreditCard, FaCalendar, FaReceipt, FaPlus, FaSave } from 'react-icons/fa';
import { MdOutlineArrowBack } from 'react-icons/md';
import Link from 'next/link';
import Pagina from 'components/Pagina';
import Api_avaliacao_2DB from 'services/Api_avaliacao_2DB';
import Swal from 'sweetalert2';
import { Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  descricao: Yup.string()
    .required('A descrição é obrigatória')
    .min(3, 'A descrição deve ter pelo menos 3 caracteres'),
  valor: Yup.number()
    .required('O valor é obrigatório')
    .min(0.01, 'O valor deve ser maior que zero'),
  tipo: Yup.string()
    .required('O tipo de compra é obrigatório')
    .oneOf(['AVista', 'Parcelada'], 'Tipo de compra inválido'),
  parcelas: Yup.number()
    .required('Número de parcelas é obrigatório')
    .min(1, 'Mínimo de 1 parcela')
    .max(24, 'Máximo de 24 parcelas')
});

export default function DetalhesCartao({ params }) {
  const { id } = React.use(params);
  const [cartao, setCartao] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mesAtual, setMesAtual] = useState(new Date().getMonth());
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());

  useEffect(() => {
    carregarCartao();
  }, [id]);

  async function carregarCartao() {
    try {
      const userId = localStorage.getItem('userId');
      console.log('ID do usuário recuperado:', userId);
      const response = await Api_avaliacao_2DB.get(`/cartaocredito/${id}`, {
        params: { usuario_id: userId }
      });
      setCartao(response.data);
    } catch (error) {
      console.error('Erro ao carregar cartão:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Não foi possível carregar os detalhes do cartão.'
      });
    }
  }

  function formatarData(data) {
    return new Date(data).toLocaleDateString();
  }

  function calcularTotalMes() {
    if (!cartao) return { parcelado: 0, aVista: 0, total: 0 };

    const comprasParceladasMes = cartao.comprasParceladas.filter(compra => {
      const dataCompra = new Date(compra.dataCompra);
      return dataCompra.getMonth() === mesAtual && dataCompra.getFullYear() === anoAtual;
    });

    const comprasAVistaMes = cartao.comprasAVista.filter(compra => {
      const dataCompra = new Date(compra.dataCompra);
      return dataCompra.getMonth() === mesAtual && dataCompra.getFullYear() === anoAtual;
    });

    const totalParcelado = comprasParceladasMes.reduce((acc, compra) =>
      acc + (compra.valor * compra.parcelas), 0);
    const totalAVista = comprasAVistaMes.reduce((acc, compra) =>
      acc + compra.valor, 0);

    return {
      parcelado: totalParcelado,
      aVista: totalAVista,
      total: totalParcelado + totalAVista
    };
  }

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  async function handleSubmit(valores, { resetForm }) {
    try {
      const userId = localStorage.getItem('userId');
      const valorTotal = valores.tipo === 'Parcelada' 
        ? valores.valor * valores.parcelas 
        : valores.valor;

      if (valorTotal > (cartao.limite - cartao.limiteUtilizado)) {
        throw new Error('Compra excede o limite disponível do cartão');
      }

      const novaCompra = {
        descricao: valores.descricao,
        valor: Number(valores.valor),
        dataCompra: new Date(),
        tipo: valores.tipo,
        parcelas: valores.tipo === 'Parcelada' ? Number(valores.parcelas) : 1
      };

      await Api_avaliacao_2DB.post(`/cartaocredito/${id}/compra`, {
        compra: novaCompra,
        usuario_id: userId
      });

      await carregarCartao();
      handleClose();
      resetForm();

      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Compra registrada com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao registrar compra:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: error.message || 'Não foi possível registrar a compra.'
      });
    }
  }

  const CompraModal = () => (
    <Modal show={showModal} onHide={handleClose} size="lg">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <FaPlus className="me-2" />
          Nova Compra
        </Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{
          descricao: '',
          valor: '',
          tipo: 'AVista',
          parcelas: 1
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          touched,
          errors,
          setFieldValue
        }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control
                      type="text"
                      name="descricao"
                      value={values.descricao}
                      onChange={handleChange}
                      isInvalid={touched.descricao && errors.descricao}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.descricao}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Valor</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="valor"
                      value={values.valor}
                      onChange={handleChange}
                      isInvalid={touched.valor && errors.valor}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.valor}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de Compra</Form.Label>
                    <Form.Select
                      name="tipo"
                      value={values.tipo}
                      onChange={(e) => {
                        handleChange(e);
                        if (e.target.value === 'AVista') {
                          setFieldValue('parcelas', 1);
                        }
                      }}
                      isInvalid={touched.tipo && errors.tipo}
                    >
                      <option value="AVista">À Vista</option>
                      <option value="Parcelada">Parcelada</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.tipo}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Número de Parcelas</Form.Label>
                    <Form.Control
                      type="number"
                      name="parcelas"
                      value={values.parcelas}
                      onChange={handleChange}
                      isInvalid={touched.parcelas && errors.parcelas}
                      min={values.tipo === 'AVista' ? "1" : "2"}
                      max="24"
                      disabled={values.tipo === 'AVista'}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.parcelas}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                <FaSave className="me-2" />
                Salvar
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );

  if (!cartao) return <div>Carregando...</div>;

  const totaisMes = calcularTotalMes();

  return (
    <Pagina titulo={`Detalhes do Cartão - ${cartao.nome}`}>
      <Container>
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <FaCreditCard className="me-2" />
                Informações do Cartão
              </div>
              <div>
                <Badge bg="light" text="dark">
                  Fechamento: Dia {cartao.diaFechamento}
                </Badge>
                <Badge bg="light" text="dark" className="ms-2">
                  Vencimento: Dia {cartao.diaVencimento}
                </Badge>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <h6>Limite Total</h6>
                <p>R$ {cartao.limite.toFixed(2)}</p>
              </Col>
              <Col md={4}>
                <h6>Limite Utilizado</h6>
                <p>R$ {cartao.limiteUtilizado.toFixed(2)}</p>
              </Col>
              <Col md={4}>
                <h6>Limite Disponível</h6>
                <p>R$ {(cartao.limite - cartao.limiteUtilizado).toFixed(2)}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <FaReceipt className="me-2" />
                Resumo do Mês Atual
              </div>
              <div>
                <Button 
                  onClick={handleShow}
                  className="btn btn-light btn-sm"
                >
                  <FaPlus className="me-1" />
                  Nova Compra
                </Button>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <h6>Total Parcelado</h6>
                <p>R$ {totaisMes.parcelado.toFixed(2)}</p>
              </Col>
              <Col md={4}>
                <h6>Total à Vista</h6>
                <p>R$ {totaisMes.aVista.toFixed(2)}</p>
              </Col>
              <Col md={4}>
                <h6>Total Geral</h6>
                <p>R$ {totaisMes.total.toFixed(2)}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>


        <Card>
          <Card.Header className="bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <FaCalendar className="me-2" />
                Faturas do Mês
              </div>
              <div>
                <select
                  className="form-select form-select-sm"
                  value={mesAtual}
                  onChange={(e) => setMesAtual(Number(e.target.value))}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      {new Date(2024, i).toLocaleString('pt-BR', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Tipo</th>
                </tr>
              </thead>
              <tbody>
                {cartao.comprasParceladas
                  .filter(compra => {
                    const data = new Date(compra.dataCompra);
                    return data.getMonth() === mesAtual &&
                      data.getFullYear() === anoAtual;
                  })
                  .map((compra, index) => (
                    <tr key={`parcelada-${index}`}>
                      <td>{formatarData(compra.dataCompra)}</td>
                      <td>{compra.descricao}</td>
                      <td>R$ {(compra.valor * compra.parcelas).toFixed(2)}</td>
                      <td>
                        <Badge bg="info">
                          Parcelado {compra.parcelas}x
                        </Badge>
                      </td>
                    </tr>
                  ))}
                {cartao.comprasAVista
                  .filter(compra => {
                    const data = new Date(compra.dataCompra);
                    return data.getMonth() === mesAtual &&
                      data.getFullYear() === anoAtual;
                  })
                  .map((compra, index) => (
                    <tr key={`avista-${index}`}>
                      <td>{formatarData(compra.dataCompra)}</td>
                      <td>{compra.descricao}</td>
                      <td>R$ {compra.valor.toFixed(2)}</td>
                      <td>
                        <Badge bg="success">À Vista</Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2"><strong>Total do Mês</strong></td>
                  <td colSpan="2">
                    <strong>R$ {totaisMes.total.toFixed(2)}</strong>
                  </td>
                </tr>
              </tfoot>
            </Table>
          </Card.Body>
        </Card>

        <CompraModal />

        <div className="text-center mt-3">
          <Link href="/pages/cartoesDeCredito" className="btn btn-danger">
            <MdOutlineArrowBack /> Voltar
          </Link>
        </div>
      </Container>
    </Pagina>
  );
} 