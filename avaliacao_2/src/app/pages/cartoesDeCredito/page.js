'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaEdit, FaTrash, FaCreditCard, FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import Api_avaliacao_2DB from "app/services/Api_avaliacao_2DB";
import Swal from 'sweetalert2';
import Pagina from "app/components/Pagina";

export default function CartoesDeCreditoPage() {
  const [cartoes, setCartoes] = useState([]);

  useEffect(() => {
    carregarCartoes();
  }, []);

  async function carregarCartoes() {
    try {
      const response = await Api_avaliacao_2DB.get('/cartao');
      setCartoes(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar cartões:', error);
      setCartoes([]);
    }
  }

  function excluir(id) {
    Swal.fire({
      title: "Deseja excluir este cartão?",
      text: "Esta ação não poderá ser revertida!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir!"
    }).then((result) => {
      if (result.isConfirmed) {
        Api_avaliacao_2DB.delete(`/cartao/${id}`)
          .then(() => {
            carregarCartoes();
            Swal.fire("Excluído!", "Cartão excluído com sucesso.", "success");
          });
      }
    });
  }

  return (
    <Pagina titulo="Cartões de Crédito">
      <Container fluid>
        <div className="d-flex justify-content-end mb-3">
          <Link href="/pages/cartoesDeCredito/form" className="btn btn-primary">
            <FaPlus className="me-2" />Novo Cartão
          </Link>
        </div>

        <Row>
          {cartoes.map((cartao) => (
            <Col key={cartao._id} md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <div className="position-relative">
                  <div style={{ height: '200px', background: '#f8f9fa' }} className="d-flex align-items-center justify-content-center">
                    <FaCreditCard size={60} className="text-muted" />
                  </div>
                </div>
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-center">
                    {cartao.nome}
                    <div>
                      <Link href={`/pages/cartoesDeCredito/form/${cartao._id}`} className="btn btn-sm btn-warning me-2">
                        <FaEdit />
                      </Link>
                      <button className="btn btn-sm btn-danger" onClick={() => excluir(cartao._id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </Card.Title>
                  <Card.Text>
                    <small className="text-muted">Número: {cartao.numero}</small>
                    <div className="mt-2">
                      <div className="progress mb-2" style={{ height: '20px' }}>
                        <div
                          className="progress-bar bg-success"
                          style={{ width: `${((cartao.limite - cartao.usado) / cartao.limite) * 100}%` }}
                        >
                          Disponível: R$ {(cartao.limite - cartao.usado).toFixed(2)}
                        </div>
                      </div>
                      <div className="progress" style={{ height: '20px' }}>
                        <div
                          className="progress-bar bg-danger"
                          style={{ width: `${(cartao.usado / cartao.limite) * 100}%` }}
                        >
                          Usado: R$ {cartao.usado?.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <strong>Limite Total: R$ {cartao.limite?.toFixed(2)}</strong>
                      <br />
                      <small>Vencimento: {new Date(cartao.vencimento).toLocaleDateString()}</small>
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Pagina>
  );
}