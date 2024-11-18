// projeto_individual_frontend/avaliacao_2/src/app/pages/cartoesDeCredito/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Image, Accordion, Badge } from 'react-bootstrap';
import { FaPlus, FaCreditCard, FaEdit, FaTrash, FaReceipt, FaCalendar } from 'react-icons/fa';
import Link from 'next/link';
import Api_avaliacao_2DB from 'services/Api_avaliacao_2DB';
import Pagina from 'components/Pagina';
import Swal from 'sweetalert2';
import { Box } from '@mui/material';
import Carregando from 'components/Carregando';

export default function CartoesDeCredito() {
  const [cartoes, setCartoes] = useState([]);

  useEffect(() => {
    carregarCartoes();
  }, []);

  async function carregarCartoes() {
    try {
      const userId = localStorage.getItem('userId');
      console.log('ID do usuário recuperado:', userId);

      if (!userId) {
        console.error('ID do usuário não encontrado no localStorage');
        return;
      }

      console.log('Iniciando busca de cartões para usuário:', userId);
      const response = await Api_avaliacao_2DB.get('/cartaocredito', {
        params: { usuario_id: userId }
      });

      console.log('Cartões recebidos detalhados:', response.data.map(cartao => ({
        id: cartao._id,
        banco: cartao.bancoEmissor
      })));
      setCartoes(response.data || []);
    } catch (error) {
      console.error('Erro detalhado ao carregar cartões:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Não foi possível carregar os cartões.'
      });
    }
  }

  const [carregando, setCarregando] = useState(true);

  async function carregarDados() {
    try {
      setCarregando(true);
      await carregarCartoes();
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  if (carregando) {
    return <Carregando />;
  }

  if (cartoes.length === 0) {
    return (
      <Pagina titulo="Cartões de Crédito">
        <div className="d-flex flex-column justify-content-center align-items-center text-center p-5">
          <FaCreditCard size={60} className="text-muted mb-4" />
          <h4 className="mb-3">Nenhum cartão encontrado</h4>
          <p className="text-muted mb-4">
            Adicionar cartões ao seu aplicativo de finanças pessoais é um passo importante em direção ao controle total sobre sua vida financeira.
            Imagine ter todos os seus cartões de crédito e débito, com seus limites, datas de vencimento e faturas, organizados em um único lugar.
          </p>
          <p className="text-muted mb-4">
            Ao cadastrar cada cartão, você não apenas tem acesso fácil às informações, mas também ganha uma visão clara e precisa sobre seu fluxo de caixa e gastos.
            Cada novo cartão inserido é uma oportunidade de planejar melhor seus pagamentos e evitar surpresas no fim do mês.
          </p>
          <Link href="/pages/cartoesDeCredito/form" passHref>
            <button className="btn btn-primary">
              <FaPlus className="me-2" /> Adicionar Novo Cartão
            </button>
          </Link>
        </div>
      </Pagina>
    );
  }

  function excluir(id) {
    Swal.fire({
      title: 'Confirmar exclusão?',
      text: "Esta ação não poderá ser revertida!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Api_avaliacao_2DB.delete(`/cartaocredito/${id}`)
          .then(() => {
            carregarCartoes();
            Swal.fire('Excluído!', 'Cartão excluído com sucesso.', 'success');
          })
          .catch(() => {
            Swal.fire('Erro!', 'Não foi possível excluir o cartão.', 'error');
          });
      }
    });
  }

  return (
    <Pagina titulo="Cartões de Crédito">
      {cartoes.length > 0 &&
        <Container>
          <Accordion defaultActiveKey="0">
            {cartoes.map((cartao, index) => (
              <CardCartao
                key={cartao._id}
                cartao={cartao}
                onExcluir={excluir}
                index={index}
              />
            ))}
          </Accordion>
          <div className="d-flex justify-content-end mt-4 mb-4">
            <Link href="/pages/cartoesDeCredito/form" passHref className="btn btn-primary">
              <FaPlus className="me-2" /> Novo Cartão
            </Link>
          </div>
        </Container>
      }
    </Pagina>
  );
}

function CardCartao({ cartao, onExcluir, index }) {
  const ultimosDigitos = cartao.numero.slice(-4);
  const [totaisMes, setTotaisMes] = useState({ parcelado: 0, aVista: 0, total: 0 });
  const mesAtual = new Date().getMonth();
  const anoAtual = new Date().getFullYear();

  useEffect(() => {
    calcularTotalMes();
  }, [cartao]);

  function calcularTotalMes() {
    if (!cartao) return;

    const comprasParceladasMes = cartao.comprasParceladas?.filter(compra => {
      const dataCompra = new Date(compra.dataCompra);
      return dataCompra.getMonth() === mesAtual && dataCompra.getFullYear() === anoAtual;
    }) || [];

    const comprasAVistaMes = cartao.comprasAVista?.filter(compra => {
      const dataCompra = new Date(compra.dataCompra);
      return dataCompra.getMonth() === mesAtual && dataCompra.getFullYear() === anoAtual;
    }) || [];

    const totalParcelado = comprasParceladasMes.reduce((acc, compra) =>
      acc + (compra.valor * compra.parcelas), 0);
    const totalAVista = comprasAVistaMes.reduce((acc, compra) =>
      acc + compra.valor, 0);

    setTotaisMes({
      parcelado: totalParcelado,
      aVista: totalAVista,
      total: totalParcelado + totalAVista
    });
  }

  return (
    <Accordion.Item eventKey={index.toString()}>
      <Accordion.Header>
        <div className="d-flex align-items-center w-100">
          <div className="me-3">
            {cartao.imagemCartao ? (
              <Image
                src={cartao.imagemCartao}
                alt={`Cartão ${cartao.nome}`}
                style={{ width: '60px', height: 'auto' }}
                className="rounded"
              />
            ) : (
              <FaCreditCard size={40} className="text-muted" />
            )}
          </div>
          <div className="flex-grow-1">
            <h5 className="mb-0">{cartao.bancoEmissor}</h5>
            <small className="text-muted">
              {cartao.bandeira} •••• {ultimosDigitos}
            </small>
          </div>
          <div className="text-end me-3">
            <div>Limite Disponível</div>
            <strong>R$ {(cartao.limite - cartao.limiteUtilizado).toFixed(2)}</strong>
          </div>
        </div>
      </Accordion.Header>
      <Accordion.Body>
        <Row>
          <Col md={8}>
            <Card className="mb-3">
              <Card.Header className="bg-light">
                <FaReceipt className="me-2" />
                Resumo do Mês Atual
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <small className="text-muted d-block">Total Parcelado</small>
                    <strong>R$ {totaisMes.parcelado.toFixed(2)}</strong>
                  </Col>
                  <Col md={4}>
                    <small className="text-muted d-block">Total à Vista</small>
                    <strong>R$ {totaisMes.aVista.toFixed(2)}</strong>
                  </Col>
                  <Col md={4}>
                    <small className="text-muted d-block">Total Geral</small>
                    <strong>R$ {totaisMes.total.toFixed(2)}</strong>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header className="bg-light">
                <FaCalendar className="me-2" />
                Informações do Cartão
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <small className="text-muted d-block">Fechamento</small>
                    <strong>Dia {cartao.diaFechamento}</strong>
                  </Col>
                  <Col md={3}>
                    <small className="text-muted d-block">Vencimento</small>
                    <strong>Dia {cartao.diaVencimento}</strong>
                  </Col>
                  <Col md={3}>
                    <small className="text-muted d-block">Limite Total</small>
                    <strong>R$ {cartao.limite.toFixed(2)}</strong>
                  </Col>
                  <Col md={3}>
                    <small className="text-muted d-block">Comprometido</small>
                    <strong>R$ {cartao.limiteUtilizado.toFixed(2)}</strong>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <div className="d-flex flex-column gap-2">
              <Link 
                href={`/pages/cartoesDeCredito/detalhes/${cartao._id}`}
                className="btn btn-primary"
              >
                Ver Detalhes
              </Link>
              <Link 
                href={`/pages/cartoesDeCredito/form/${cartao._id}`}
                className="btn btn-outline-primary"
              >
                <FaEdit className="me-1" /> Editar
              </Link>
              <Button 
                variant="outline-danger"
                onClick={() => onExcluir(cartao._id)}
              >
                <FaTrash className="me-1" /> Excluir
              </Button>
            </div>
          </Col>
        </Row>
      </Accordion.Body>
    </Accordion.Item>
  );
}