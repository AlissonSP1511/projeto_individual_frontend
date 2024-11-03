'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaCreditCard, FaPlus } from 'react-icons/fa';

export default function CartoesDeCreditoPage() {
  // Estados
  const [cartoes, setCartoes] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [cartaoSelecionado, setCartaoSelecionado] = useState(null);
  const [novaDespesa, setNovaDespesa] = useState({
    descricao: '',
    valor: '',
    data: '',
    cartaoId: ''
  });
  const [novoCartao, setNovoCartao] = useState({
    numero: '',
    nome: '',
    limite: '',
    vencimento: ''
  });

  // Funções para gerenciar cartões
  const handleAdicionarCartao = () => {
    setCartoes([...cartoes, { ...novoCartao, id: Date.now() }]);
    setNovoCartao({ numero: '', nome: '', limite: '', vencimento: '' });
  };

  const handleEditarCartao = (cartao) => {
    setNovoCartao(cartao);
    const newCartoes = cartoes.filter(c => c.id !== cartao.id);
    setCartoes(newCartoes);
  };

  const handleDeletarCartao = (id) => {
    setCartoes(cartoes.filter(cartao => cartao.id !== id));
  };

  // Funções para gerenciar despesas
  const handleAdicionarDespesa = () => {
    if (cartaoSelecionado) {
      setDespesas([...despesas, { ...novaDespesa, id: Date.now(), cartaoId: cartaoSelecionado }]);
      setNovaDespesa({ descricao: '', valor: '', data: '', cartaoId: '' });
      setShowModal(false);
    }
  };

  return (
    <Container fluid className="p-3">
      <Row>
        {/* Seção de Cartões */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="bg-primary text-white">
              <h4><FaCreditCard className="me-2" />Cartões de Crédito</h4>
            </Card.Header>
            <Card.Body>
              <Form className="mb-3">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Número do Cartão</Form.Label>
                      <Form.Control
                        type="text"
                        value={novoCartao.numero}
                        onChange={(e) => setNovoCartao({...novoCartao, numero: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome no Cartão</Form.Label>
                      <Form.Control
                        type="text"
                        value={novoCartao.nome}
                        onChange={(e) => setNovoCartao({...novoCartao, nome: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Limite</Form.Label>
                      <Form.Control
                        type="number"
                        value={novoCartao.limite}
                        onChange={(e) => setNovoCartao({...novoCartao, limite: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Vencimento</Form.Label>
                      <Form.Control
                        type="date"
                        value={novoCartao.vencimento}
                        onChange={(e) => setNovoCartao({...novoCartao, vencimento: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="success" onClick={handleAdicionarCartao}>
                  <FaPlus className="me-2" />Adicionar Cartão
                </Button>
              </Form>

              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Nome</th>
                    <th>Limite</th>
                    <th>Vencimento</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {cartoes.map((cartao) => (
                    <tr key={cartao.id}>
                      <td>{cartao.numero}</td>
                      <td>{cartao.nome}</td>
                      <td>R$ {cartao.limite}</td>
                      <td>{cartao.vencimento}</td>
                      <td>
                        <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditarCartao(cartao)}>
                          <FaEdit />
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeletarCartao(cartao.id)}>
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Seção de Despesas */}
        <Col md={6}>
          <Card>
            <Card.Header className="bg-success text-white">
              <h4>Despesas</h4>
            </Card.Header>
            <Card.Body>
              <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
                <FaPlus className="me-2" />Nova Despesa
              </Button>

              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Valor</th>
                    <th>Data</th>
                    <th>Cartão</th>
                  </tr>
                </thead>
                <tbody>
                  {despesas.map((despesa) => (
                    <tr key={despesa.id}>
                      <td>{despesa.descricao}</td>
                      <td>R$ {despesa.valor}</td>
                      <td>{despesa.data}</td>
                      <td>{cartoes.find(c => c.id === despesa.cartaoId)?.numero}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para adicionar despesa */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nova Despesa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Cartão</Form.Label>
              <Form.Select
                onChange={(e) => setCartaoSelecionado(e.target.value)}
                value={cartaoSelecionado || ''}
              >
                <option value="">Selecione um cartão</option>
                {cartoes.map((cartao) => (
                  <option key={cartao.id} value={cartao.id}>
                    {cartao.numero} - {cartao.nome}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="text"
                value={novaDespesa.descricao}
                onChange={(e) => setNovaDespesa({...novaDespesa, descricao: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Valor</Form.Label>
              <Form.Control
                type="number"
                value={novaDespesa.valor}
                onChange={(e) => setNovaDespesa({...novaDespesa, valor: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data</Form.Label>
              <Form.Control
                type="date"
                value={novaDespesa.data}
                onChange={(e) => setNovaDespesa({...novaDespesa, data: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAdicionarDespesa}>
            Adicionar Despesa
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
