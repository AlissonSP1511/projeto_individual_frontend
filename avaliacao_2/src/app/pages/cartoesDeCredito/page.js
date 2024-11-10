// avaliacao_2/src/app/pages/cartoesDeCredito/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import { FaPlus, FaCreditCard, FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import Api_avaliacao_2DB from "app/services/Api_avaliacao_2DB";
import Pagina from "app/components/Pagina";
import NomeUsuario from "app/components/NomeUsuario";
import Swal from 'sweetalert2';

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
    return (
      <Pagina titulo="Cartões de Crédito">

      <div className="preloader flex-column justify-content-center align-items-center">
        <img 
          className="animation__shake" 
          src="/dist/img/AdminLTELogo.png" 
          alt="AdminLTELogo" 
          height={60} 
          width={60} 
        />
        <h3 className="mt-3">Carregando...</h3>
        </div>
      </Pagina>
    );
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
          {cartoes.map(cartao => (
            <CardCartao
              key={cartao._id}
              cartao={cartao}
              onExcluir={excluir}
            />
          ))}
          <div className="d-flex justify-content-end mb-4">
            <Link href="/pages/cartoesDeCredito/form" passHref className="btn btn-primary">
              <FaPlus className="me-2" /> Novo Cartão
            </Link>
          </div>
        </Container>
      }
    </Pagina>
  );
}

function CardCartao({ cartao, onExcluir }) {
  const ultimosDigitos = cartao.numero.slice(-4);

  return (
    <Card className="mb-3">
      <Row className="g-0">
        <Col xs={12} md={4} className="d-flex align-items-center justify-content-center p-3">
          {cartao.imagemCartao ? (
            <Image
              src={cartao.imagemCartao}
              alt={`Cartão ${cartao.nome}`}
              className="img-fluid rounded"
              style={{ maxWidth: '200px' }}
            />
          ) : (
            <div className="card-placeholder d-flex align-items-center justify-content-center bg-light rounded"
              style={{ width: '200px', height: '126px' }}>
              <FaCreditCard size={48} className="text-muted" />
            </div>
          )}
        </Col>
        <Col xs={12} md={7}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <Card.Title>{cartao.bancoEmissor}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {cartao.bandeira} •••• {ultimosDigitos}
                </Card.Subtitle>
              </div>
            </div>

            <div className="mt-3">
              <Row>
                <Col xs={6} md={3}>
                  <small className="text-muted d-block">Fechamento</small>
                  <strong>Dia {cartao.diaFechamento}</strong>
                </Col>
                <Col xs={6} md={3}>
                  <small className="text-muted d-block">Vencimento</small>
                  <strong>Dia {cartao.diaVencimento}</strong>
                </Col>
                <Col xs={6} md={3}>
                  <small className="text-muted d-block">Limite Total</small>
                  <strong>R$ {cartao.limite.toFixed(2)}</strong>
                </Col>
                <Col xs={6} md={3}>
                  <small className="text-muted d-block">Comprometido</small>
                  <strong>R$ {cartao.limiteUtilizado.toFixed(2)}</strong>
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Col>
        <Col xs={12} md={1} className="d-flex flex-md-column justify-content-end align-items-center p-3">
          <Link href={`/pages/cartoesDeCredito/form/${cartao._id}`}

            className="btn btn-outline-primary btn-sm mb-md-2 me-2 me-md-0">
            <FaEdit className="me-1" />  Editar
          </Link>
          <Button variant="outline-danger" size="sm"
            onClick={() => onExcluir(cartao._id)}
            className="btn btn-outline-primary btn-sm mb-md-2 me-2 me-md-0">
            <FaTrash className="me-1" /> Excluir
          </Button>
        </Col>
      </Row>
    </Card>
  );
}