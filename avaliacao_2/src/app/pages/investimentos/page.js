'use client'

import { useState, useEffect } from 'react';
import {
  Accordion,
  Card,
  Button,
  Modal,
  Form,
  Row,
  Col
} from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Pagina from "app/components/Pagina";
import Api_avaliacao_2DB from "app/services/Api_avaliacao_2DB";
import { FaPlusCircle, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Investimentos() {
  const router = useRouter();
  const [investimentos, setInvestimentos] = useState([]);
  const [carteiras, setCarteiras] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    carteira_investimento_id: '',
    tipo: '',
    valor: '',
    taxa_juros: '',
    tipo_juros: 'Simples',
    prazo_meses: '',
    periodo_taxa: 'ano',
    periodo_prazo: 'mes',
    descricao: ''
  });
  const [showModalCarteira, setShowModalCarteira] = useState(false);
  const [contas, setContas] = useState([]);
  const [carteiraForm, setCarteiraForm] = useState({
    conta_id: ''
  });

  useEffect(() => {
    carregarDados();
    carregarContas();
  }, []);

  async function carregarDados() {
    try {
      const [invResponse, cartResponse] = await Promise.all([
        Api_avaliacao_2DB.get('/investimento'),
        Api_avaliacao_2DB.get('/carteirainvestimento')
      ]);
      
      if (cartResponse.data && Array.isArray(cartResponse.data)) {
        setCarteiras(cartResponse.data);
      } else {
        console.warn('Resposta inválida para carteiras:', cartResponse.data);
        setCarteiras([]);
      }
      
      if (invResponse.data && Array.isArray(invResponse.data)) {
        setInvestimentos(invResponse.data);
      } else {
        console.warn('Resposta inválida para investimentos:', invResponse.data);
        setInvestimentos([]);
      }
    } catch (error) {
      console.error('Erro detalhado:', error.response?.data || error.message);
      setCarteiras([]);
      setInvestimentos([]);
      Swal.fire({
        title: "Erro!",
        text: "Não foi possível carregar os dados. Tente novamente mais tarde.",
        icon: "error"
      });
    }
  }

  const carregarContas = async () => {
    try {
      const response = await Api_avaliacao_2DB.get('/conta');
      setContas(response.data);
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
    }
  };

  const converterTaxaParaAnual = (taxa, periodo) => {
    const taxaDecimal = parseFloat(taxa) / 100;
    switch(periodo) {
      case 'dia': return Math.pow(1 + taxaDecimal, 365) - 1;
      case 'mes': return Math.pow(1 + taxaDecimal, 12) - 1;
      case 'bimestre': return Math.pow(1 + taxaDecimal, 6) - 1;
      case 'trimestre': return Math.pow(1 + taxaDecimal, 4) - 1;
      case 'quadrimestre': return Math.pow(1 + taxaDecimal, 3) - 1;
      case 'semestre': return Math.pow(1 + taxaDecimal, 2) - 1;
      case 'ano': return taxaDecimal;
      default: return taxaDecimal;
    }
  };

  const converterPrazoParaDias = (prazo, periodo) => {
    switch(periodo) {
      case 'dia': return prazo;
      case 'mes': return prazo * 30;
      case 'bimestre': return prazo * 60;
      case 'trimestre': return prazo * 90;
      case 'quadrimestre': return prazo * 120;
      case 'semestre': return prazo * 180;
      case 'ano': return prazo * 365;
      default: return prazo;
    }
  };

  const calcularRendimentoEsperado = (investimento) => {
    const { 
      valor, 
      taxa_juros, 
      tipo_juros, 
      prazo_meses, 
      periodo_taxa = 'ano', 
      periodo_prazo = 'mes' 
    } = investimento;
    
    let valorInicial;
    if (typeof valor === 'object' && valor.$numberDecimal) {
      valorInicial = parseFloat(valor.$numberDecimal);
    } else if (typeof valor === 'number') {
      valorInicial = valor;
    } else {
      valorInicial = 0;
    }

    const taxaAnual = converterTaxaParaAnual(taxa_juros, periodo_taxa);
    const prazoEmDias = converterPrazoParaDias(prazo_meses, periodo_prazo);
    
    if (isNaN(valorInicial) || isNaN(taxaAnual) || isNaN(prazoEmDias)) {
      return 0;
    }
    
    if (tipo_juros === 'Simples') {
      const taxaDiaria = taxaAnual / 365;
      return valorInicial * (1 + taxaDiaria * prazoEmDias);
    } else {
      const taxaDiaria = Math.pow(1 + taxaAnual, 1/365) - 1;
      return valorInicial * Math.pow(1 + taxaDiaria, prazoEmDias);
    }
  };

  const gerarDadosGrafico = (investimento) => {
    const meses = Array.from({length: 12}, (_, i) => i + 1);
    const dados = meses.map(mes => {
      const inv = {...investimento, prazo_meses: mes};
      return calcularRendimentoEsperado(inv);
    });

    return {
      labels: meses.map(mes => `Mês ${mes}`),
      datasets: [
        {
          label: 'Rendimento Esperado',
          data: dados,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const dadosFormatados = {
            ...formData,
            valor: parseFloat(formData.valor),
            taxa_juros: parseFloat(formData.taxa_juros),
            prazo_meses: parseInt(formData.prazo_meses)
        };

        await Api_avaliacao_2DB.post('/investimento', dadosFormatados);
        setShowModal(false);
        carregarDados();
        setFormData({
            carteira_investimento_id: '',
            tipo: '',
            valor: '',
            taxa_juros: '',
            tipo_juros: 'Simples',
            prazo_meses: '',
            periodo_taxa: 'ano',
            periodo_prazo: 'mes',
            descricao: ''
        });
        
        Swal.fire({
            title: "Sucesso!",
            text: "Investimento registrado com sucesso",
            icon: "success"
        });
    } catch (error) {
        console.error('Erro ao salvar:', error.response?.data || error);
        Swal.fire({
            title: "Erro!",
            text: error.response?.data?.error || "Erro ao registrar investimento",
            icon: "error"
        });
    }
  };

  const handleSubmitCarteira = async (e) => {
    e.preventDefault();
    try {
      await Api_avaliacao_2DB.post('/carteirainvestimento', carteiraForm);
      setShowModalCarteira(false);
      carregarDados();
      Swal.fire({
        title: "Sucesso!",
        text: "Carteira criada com sucesso",
        icon: "success"
      });
      setCarteiraForm({ conta_id: '' });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      Swal.fire({
        title: "Erro!",
        text: "Erro ao criar carteira",
        icon: "error"
      });
    }
  };

  const handleEdit = (id) => {
    router.push(`/pages/investimentos/form/${id}`);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: "Esta ação não poderá ser revertida!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await Api_avaliacao_2DB.delete(`/investimento/${id}`);
        carregarDados();
        Swal.fire({
          title: 'Excluído!',
          text: 'O investimento foi excluído com sucesso.',
          icon: 'success'
        });
      } catch (error) {
        console.error('Erro ao excluir:', error);
        Swal.fire({
          title: 'Erro!',
          text: 'Não foi possível excluir o investimento.',
          icon: 'error'
        });
      }
    }
  };

  return (
    <Pagina titulo="Investimentos">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Meus Investimentos</h4>
          <div>
            <Button
              variant="success"
              onClick={() => setShowModalCarteira(true)}
              className="me-2"
            >
              <FaPlusCircle /> Nova Carteira
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
            >
              <FaPlusCircle /> Novo Investimento
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {carteiras.length === 0 ? (
            <div className="text-center p-4">
              <p>Nenhuma carteira de investimentos cadastrada.</p>
              <Button
                variant="success"
                onClick={() => setShowModalCarteira(true)}
              >
                <FaPlusCircle /> Criar Primeira Carteira
              </Button>
            </div>
          ) : (
            <Accordion>
              {investimentos.map((investimento, index) => (
                <Accordion.Item key={investimento._id} eventKey={index.toString()}>
                  <Accordion.Header>
                    <div className="d-flex justify-content-between w-100 me-3">
                      <span>
                        {investimento.tipo} - R$ {
                          typeof investimento.valor === 'object' && investimento.valor.$numberDecimal
                            ? parseFloat(investimento.valor.$numberDecimal).toFixed(2)
                            : typeof investimento.valor === 'number'
                              ? investimento.valor.toFixed(2)
                              : '0.00'
                        }
                      </span>
                      <span>
                        Rendimento Esperado: R$ {calcularRendimentoEsperado(investimento).toFixed(2)}
                      </span>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col md={8}>
                        <Line data={gerarDadosGrafico(investimento)} />
                      </Col>
                      <Col md={4}>
                        <h5>Detalhes do Investimento</h5>
                        <p><strong>Tipo:</strong> {investimento.tipo}</p>
                        <p><strong>Valor:</strong> R$ {
                          typeof investimento.valor === 'object' && investimento.valor.$numberDecimal
                            ? parseFloat(investimento.valor.$numberDecimal).toFixed(2)
                            : typeof investimento.valor === 'number'
                              ? investimento.valor.toFixed(2)
                              : '0.00'
                        }</p>
                        <p><strong>Taxa de Juros:</strong> {investimento.taxa_juros}%</p>
                        <p><strong>Tipo de Juros:</strong> {investimento.tipo_juros}</p>
                        <p><strong>Prazo:</strong> {investimento.prazo_meses} meses</p>
                        <p><strong>Descrição:</strong> {investimento.descricao}</p>
                        <div className="mt-3">
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(investimento._id)}
                          >
                            <FaEdit /> Editar
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(investimento._id)}
                          >
                            <MdDelete /> Excluir
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Novo Investimento</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Carteira</Form.Label>
                  <Form.Select
                    required
                    value={formData.carteira_investimento_id}
                    onChange={(e) => setFormData({...formData, carteira_investimento_id: e.target.value})}
                  >
                    <option value="">Selecione uma carteira</option>
                    {carteiras.map(carteira => (
                      <option key={carteira._id} value={carteira._id}>
                        {carteira.conta_id?.tipo_conta || 'Carteira sem conta'}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Investimento</Form.Label>
                  <Form.Select
                    required
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="Ações">Ações</option>
                    <option value="Renda Fixa">Renda Fixa</option>
                    <option value="Fundos">Fundos</option>
                    <option value="Tesouro Direto">Tesouro Direto</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Valor</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({...formData, valor: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Taxa de Juros (%)</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    step="0.01"
                    value={formData.taxa_juros}
                    onChange={(e) => setFormData({...formData, taxa_juros: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Período Taxa</Form.Label>
                  <Form.Select
                    required
                    value={formData.periodo_taxa}
                    onChange={(e) => setFormData({...formData, periodo_taxa: e.target.value})}
                  >
                    <option value="dia">Dia</option>
                    <option value="mes">Mês</option>
                    <option value="bimestre">Bimestre</option>
                    <option value="trimestre">Trimestre</option>
                    <option value="quadrimestre">Quadrimestre</option>
                    <option value="semestre">Semestre</option>
                    <option value="ano">Ano</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Prazo (meses)</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    min="1"
                    max="480"
                    value={formData.prazo_meses}
                    onChange={(e) => setFormData({...formData, prazo_meses: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Período Prazo</Form.Label>
                  <Form.Select
                    required
                    value={formData.periodo_prazo}
                    onChange={(e) => setFormData({...formData, periodo_prazo: e.target.value})}
                  >
                    <option value="dia">Dias</option>
                    <option value="mes">Meses</option>
                    <option value="bimestre">Bimestres</option>
                    <option value="trimestre">Trimestres</option>
                    <option value="quadrimestre">Quadrimestres</option>
                    <option value="semestre">Semestres</option>
                    <option value="ano">Anos</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Tipo de Juros</Form.Label>
              <Form.Select
                required
                value={formData.tipo_juros}
                onChange={(e) => setFormData({...formData, tipo_juros: e.target.value})}
              >
                <option value="Simples">Juros Simples</option>
                <option value="Composto">Juros Compostos</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showModalCarteira} onHide={() => setShowModalCarteira(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nova Carteira de Investimentos</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitCarteira}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Conta</Form.Label>
              <Form.Select
                required
                value={carteiraForm.conta_id}
                onChange={(e) => setCarteiraForm({...carteiraForm, conta_id: e.target.value})}
              >
                <option value="">Selecione uma conta</option>
                {contas.map(conta => (
                  <option key={conta._id} value={conta._id}>
                    {conta.tipo_conta} - {conta.banco}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModalCarteira(false)}>
              Cancelar
            </Button>
            <Button variant="success" type="submit">
              Criar Carteira
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Pagina>
  );
}