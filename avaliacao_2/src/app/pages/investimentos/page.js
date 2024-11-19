// projeto_individual_frontend/avaliacao_2/src/app/pages/investimentos/page.js
'use client'

import { CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import Carregando from 'components/Carregando';
import Pagina from 'components/Pagina';
import PeriodoSelector from 'components/PeriodoSelector';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Accordion, Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { FaEdit, FaPlusCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Api_avaliacao_2DB from 'services/Api_avaliacao_2DB';
import Swal from 'sweetalert2';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Formik } from 'formik';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const useDebouncedState = (initialValue, delay = 300) => {
    const [value, setValue] = useState(initialValue);
    const [debouncedValue, setDebouncedValue] = useState(initialValue);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return [debouncedValue, setValue];
};

// Estilos CSS para melhorar a aparência do slider

export default function Investimentos() {
    const router = useRouter();
    const [investimentos, setInvestimentos] = useState([]);
    const [carteiras, setCarteiras] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        carteira_id: '',
        tipo_investimento: '',
        valor_investido: '',
        taxa_juros: '',
        tipo_juros: 'Simples',
        data: '',
        frequencia_juros: 'Mensal',
        periodo_investimento: '1',
        descricao: ''
    });
    const [showModalCarteira, setShowModalCarteira] = useState(false);
    const [novaCarteira, setNovaCarteira] = useState({
        usuario_id: '',
        nome_carteira: '',
        objetivo_carteira_descricao: ''
    });
    const [periodoVisualizacao, setPeriodoVisualizacao] = useDebouncedState(12);
    const [unidadeTempo, setUnidadeTempo] = useState('meses');
    const [carregando, setCarregando] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [carteiraSelecionadaId, setCarteiraSelecionadaId] = useState('');
    const [nomeCarteiraSelecionada, setNomeCarteiraSelecionada] = useState('');

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            setCarregando(true);
            const [invResponse, cartResponse] = await Promise.all([
                Api_avaliacao_2DB.get('/investimento'),
                Api_avaliacao_2DB.get('/carteirainvestimento')
            ]);

            const investimentosData = Array.isArray(invResponse?.data) ? invResponse.data : [];
            console.log('Investimentos:', invResponse.data);
            const carteirasData = Array.isArray(cartResponse?.data) ? cartResponse.data : [];
            console.log('Carteiras:', cartResponse.data);

            setInvestimentos(investimentosData);
            setCarteiras(carteirasData);

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setInvestimentos([]);
            setCarteiras([]);
        } finally {
            setCarregando(false);
        }
    }

    if (carregando) {
        return <Carregando />;
    }



    const calcularRendimentoEsperado = (investimento) => {

        if (!investimento) {
            console.warn('Investimento inválido ou nulo');
            return 0;
        }

        const {
            valor_investido,
            taxa_juros,
            tipo_juros,
            data,
        } = investimento;

        const valorInicial = parseFloat(
            typeof valor_investido === 'object' && valor_investido.$numberDecimal
                ? valor_investido.$numberDecimal
                : typeof valor_investido === 'string'
                    ? valor_investido
                    : typeof valor_investido === 'number'
                        ? valor_investido.toString()
                        : '0'
        );

        if (isNaN(valorInicial) || !taxa_juros || !data) {
            console.warn('Dados inválidos para cálculo');
            return 0;
        }

        // Taxa mensal em decimal
        const taxaMensal = parseFloat(taxa_juros) / 100;

        let rendimentoFinal;

        if (tipo_juros === 'Simples') {
            // Juros Simples: M = P * (1 + i * t)
            rendimentoFinal = valorInicial * (1 + taxaMensal * data);
        } else {
            // Juros Compostos: M = P * (1 + i)^t
            rendimentoFinal = valorInicial * Math.pow(1 + taxaMensal, data);
        }

        return rendimentoFinal;
    };

    const converterParaMeses = (valor_investido, unidade) => {
        return unidade === 'anos' ? valor_investido * 12 : valor_investido;
    };

    const gerarDadosGrafico = (investimento) => {

        const totalMeses = converterParaMeses(periodoVisualizacao, unidadeTempo);
        const meses = Array.from({ length: totalMeses }, (_, i) => i + 1);

        const valorInicial = parseFloat(
            typeof investimento.valor_investido === 'object' && investimento.valor_investido.$numberDecimal
                ? investimento.valor_investido.$numberDecimal
                : typeof investimento.valor_investido === 'string'
                    ? investimento.valor_investido
                    : typeof investimento.valor_investido === 'number'
                        ? investimento.valor_investido.toString()
                        : '0'
        );

        const dados = meses.map(mes => {
            const inv = {
                ...investimento,
                data: mes
            };
            const rendimento = calcularRendimentoEsperado(inv);
            const rendimentoLiquido = rendimento - valorInicial;
            return rendimentoLiquido;
        });

        return {
            labels: meses.map(mes => {
                if (unidadeTempo === 'anos') {
                    const ano = Math.floor((mes - 1) / 12) + 1;
                    const mesDoAno = ((mes - 1) % 12) + 1;
                    return `Ano ${ano}, Mês ${mesDoAno}`;
                }
                return `Mês ${mes}`;
            }),
            datasets: [{
                label: 'Rendimento Líquido',
                data: dados,
                borderColor: '#2563eb',
                borderWidth: 3,
                tension: 0.1,
                fill: true,
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                pointRadius: 4,
                pointHoverRadius: 8,
                pointBackgroundColor: '#2563eb',
                pointHoverBackgroundColor: '#1e40af',
                pointBorderColor: '#ffffff',
                pointHoverBorderColor: '#ffffff',
                pointBorderWidth: 2,
            }]
        };
    };

    const handleSubmit = async (values) => {
        console.log('Valores do formulário:', values);
        try {
            const response = await Api_avaliacao_2DB.post('/investimento', values);
            console.log('Investimento salvo com sucesso:', response.data);

            // Atualize o estado com o novo investimento
            setInvestimentos((prev) => [...prev, response.data]); // Adiciona o novo investimento à lista
            setShowModal(false); // Fecha o modal após o envio
        } catch (error) {
            console.error('Erro ao salvar investimento:', error);
        }
    };

    const handleSubmitCarteira = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await Api_avaliacao_2DB.put(`/carteirainvestimento/${novaCarteira._id}`, {
                    nome_carteira: novaCarteira.nome_carteira,
                    objetivo_carteira_descricao: novaCarteira.objetivo_carteira_descricao
                });
                setIsEditing(false);
            } else {
                await Api_avaliacao_2DB.post('/carteirainvestimento', novaCarteira);
            }
            setShowModalCarteira(false);
            carregarDados();
            setNovaCarteira({
                usuario_id: '',
                nome_carteira: '',
                objetivo_carteira_descricao: ''
            });
        } catch (error) {
            console.error('Erro ao salvar:', error);
            Swal.fire({
                title: "Erro!",
                text: "Erro ao criar ou editar carteira",
                icon: "error"
            });
        }
    };

    const handleEditInvestimento = (id) => {
        router.push(`/pages/investimentos/form/${id}`);
    };

    const handleDeleteInvestimento = async (id) => {
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
    const handleDeleteCarteira = async (id) => {
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
                await Api_avaliacao_2DB.delete(`/carteirainvestimento/${id}`);
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

    const gerarDadosDistribuicaoPorCarteiras = () => {
        return carteiras.map(carteira => {
            const totalInvestido = investimentos
                .filter(investimento => String(investimento.carteira_id._id || investimento.carteira_id) === String(carteira._id))
                .reduce((acc, investimento) => {
                    const valor = parseFloat(
                        typeof investimento.valor_investido === 'object' && investimento.valor_investido.$numberDecimal
                            ? investimento.valor_investido.$numberDecimal
                            : investimento.valor_investido
                    );
                    return acc + valor;
                }, 0);

            return {
                name: carteira.nome_carteira || 'Sem Nome',
                value: totalInvestido
            };
        });
    };

    const calcularTotalInvestimentosCarteira = (carteiraId) => {
        return investimentos
            .filter(investimento => String(investimento.carteira_id._id || investimento.carteira_id) === String(carteiraId))
            .reduce((acc, investimento) => {
                const valor = parseFloat(
                    typeof investimento.valor_investido === 'object' && investimento.valor_investido.$numberDecimal
                        ? investimento.valor_investido.$numberDecimal
                        : investimento.valor_investido
                );
                return acc + valor;
            }, 0);
    };

    return (
        <Pagina titulo="Investimentos">
            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h4>Carteiras de Investimentos</h4>
                    <div>
                        <Button
                            variant="success"
                            onClick={() => setShowModalCarteira(true)}
                            className="me-2"
                        >
                            <FaPlusCircle /> Nova Carteira
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
                        <>
                            <div className='d-flex justify-content-between mb-2 mt-3'>
                                <span >
                                    <h5>Nomes das carteiras</h5>
                                </span>
                                <span >
                                    <h5>Total carteiras</h5>
                                </span>
                            </div>
                            <Accordion>
                                {carteiras.map((carteira, index) => (
                                    <Accordion.Item key={carteira._id} eventKey={index.toString()}>
                                        <Accordion.Header>
                                            <div className="d-flex justify-content-between w-100 me-3 fw-bold">
                                                <span>
                                                    {carteira.nome_carteira}
                                                </span>
                                                <span>
                                                    R$ {calcularTotalInvestimentosCarteira(carteira._id).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <Button
                                                variant="primary"
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setCarteiraSelecionadaId(carteira._id);
                                                    setNomeCarteiraSelecionada(carteira.nome_carteira);
                                                    setFormData({ ...formData, carteira_id: carteira._id });
                                                }}
                                            >
                                                <FaPlusCircle /> Novo Investimento
                                            </Button>
                                            <Accordion>
                                                {investimentos
                                                    .filter((investimento) =>
                                                        String(investimento.carteira_id._id || investimento.carteira_id) === String(carteira._id)
                                                    )
                                                    .map((investimento, indexInvestimento) => (
                                                        <Accordion.Item key={investimento._id} eventKey={indexInvestimento.toString()}>
                                                            <Accordion.Header>
                                                                <div className="d-flex justify-content-between w-100 me-3">
                                                                    <span>
                                                                        {investimento.tipo_investimento} - R$ {
                                                                            typeof investimento.valor_investido === 'object' && investimento.valor_investido.$numberDecimal
                                                                                ? parseFloat(investimento.valor_investido.$numberDecimal).toLocaleString('pt-BR', {
                                                                                    minimumFractionDigits: 2,
                                                                                    maximumFractionDigits: 2
                                                                                })
                                                                                : typeof investimento.valor_investido === 'number'
                                                                                    ? investimento.valor_investido.toLocaleString('pt-BR', {
                                                                                        minimumFractionDigits: 2,
                                                                                        maximumFractionDigits: 2
                                                                                    })
                                                                                    : '0,00'
                                                                        }
                                                                    </span>
                                                                    <span>
                                                                        Rendimento Esperado: R$ {
                                                                            calcularRendimentoEsperado(investimento).toLocaleString('pt-BR', {
                                                                                minimumFractionDigits: 2,
                                                                                maximumFractionDigits: 2
                                                                            })
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </Accordion.Header>
                                                            <Accordion.Body>
                                                                <Row className="mb-3">
                                                                    <Col md={8}>
                                                                        <PeriodoSelector
                                                                            periodoVisualizacao={periodoVisualizacao}
                                                                            setPeriodoVisualizacao={setPeriodoVisualizacao}
                                                                            unidadeTempo={unidadeTempo}
                                                                            setUnidadeTempo={setUnidadeTempo}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md={8}>
                                                                        <Line
                                                                            data={gerarDadosGrafico(investimento)}
                                                                            options={{
                                                                                responsive: true,
                                                                                plugins: {
                                                                                    legend: {
                                                                                        position: 'top',
                                                                                    },
                                                                                    title: {
                                                                                        display: true,
                                                                                        text: 'Evolução do Rendimento'
                                                                                    },
                                                                                    tooltip: {
                                                                                        mode: 'index',
                                                                                        intersect: false,
                                                                                        callbacks: {
                                                                                            title: function (tooltipItems) {
                                                                                                return tooltipItems[0].label;
                                                                                            },
                                                                                            label: function (context) {
                                                                                                const valorTotal = calcularRendimentoEsperado({
                                                                                                    ...investimento,
                                                                                                    data: context.dataIndex + 1
                                                                                                });
                                                                                                const valorInicial = parseFloat(
                                                                                                    typeof investimento.valor_investido === 'object' && investimento.valor_investido.$numberDecimal
                                                                                                        ? investimento.valor_investido.$numberDecimal
                                                                                                        : investimento.valor_investido
                                                                                                );

                                                                                                return [
                                                                                                    `Rendimento Líquido: R$ ${context.raw.toLocaleString('pt-BR', {
                                                                                                        minimumFractionDigits: 2,
                                                                                                        maximumFractionDigits: 2
                                                                                                    })}`,
                                                                                                    `Valor Total: R$ ${valorTotal.toLocaleString('pt-BR', {
                                                                                                        minimumFractionDigits: 2,
                                                                                                        maximumFractionDigits: 2
                                                                                                    })}`,
                                                                                                    `Valor Inicial: R$ ${valorInicial.toLocaleString('pt-BR', {
                                                                                                        minimumFractionDigits: 2,
                                                                                                        maximumFractionDigits: 2
                                                                                                    })}`
                                                                                                ];
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                },
                                                                                interaction: {
                                                                                    mode: 'index',
                                                                                    intersect: false,
                                                                                },
                                                                                scales: {
                                                                                    y: {
                                                                                        beginAtZero: true,
                                                                                        ticks: {
                                                                                            callback: function (value) {
                                                                                                return 'R$ ' + value.toLocaleString('pt-BR', {
                                                                                                    minimumFractionDigits: 2,
                                                                                                    maximumFractionDigits: 2
                                                                                                });
                                                                                            }
                                                                                        }
                                                                                    },
                                                                                    x: {
                                                                                        ticks: {
                                                                                            maxRotation: 45,
                                                                                            minRotation: 45
                                                                                        }
                                                                                    }
                                                                                },
                                                                                maintainAspectRatio: false
                                                                            }}
                                                                            style={{
                                                                                height: '300px',
                                                                                maxHeight: '300px'
                                                                            }}
                                                                        />
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        <h5>Detalhes do Investimento</h5>
                                                                        <p><strong>Tipo:</strong> {investimento.tipo_investimento}</p>
                                                                        <p><strong>Valor:</strong> R$ {
                                                                            typeof investimento.valor_investido === 'object' && investimento.valor_investido.$numberDecimal
                                                                                ? parseFloat(investimento.valor_investido.$numberDecimal).toLocaleString('pt-BR', {
                                                                                    minimumFractionDigits: 2,
                                                                                    maximumFractionDigits: 2
                                                                                })
                                                                                : typeof investimento.valor_investido === 'number'
                                                                                    ? investimento.valor_investido.toLocaleString('pt-BR', {
                                                                                        minimumFractionDigits: 2,
                                                                                        maximumFractionDigits: 2
                                                                                    })
                                                                                    : '0,00'
                                                                        }</p>
                                                                        <p><strong>Taxa de Juros:</strong> {investimento.taxa_juros}%</p>
                                                                        <p><strong>Tipo de Juros:</strong> {investimento.tipo_juros}</p>
                                                                        <p><strong>Prazo Investimento:</strong> {investimento.data} meses</p>
                                                                        <p><strong>Descrição:</strong> {investimento.descricao}</p>
                                                                        <div className="mt-3">
                                                                            <Button
                                                                                variant="warning"
                                                                                size="sm"
                                                                                className="me-2"
                                                                                onClick={() => handleEditInvestimento(investimento.carteiras_id)}
                                                                            >
                                                                                <FaEdit /> Editar investimento
                                                                            </Button>
                                                                            <Button
                                                                                variant="danger"
                                                                                size="sm"
                                                                                onClick={() => handleDeleteInvestimento(investimento.carteiras_id)}
                                                                            >
                                                                                <MdDelete /> Excluir investimento
                                                                            </Button>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    ))}
                                            </Accordion>
                                            {/* Botões de Editar e Excluir para a carteira */}
                                            <div className="d-flex justify-content-end mt-3">
                                                <Button variant="warning" size="sm" onClick={() => {
                                                    setNovaCarteira({
                                                        _id: carteira._id,
                                                        usuario_id: carteira.usuario_id,
                                                        nome_carteira: carteira.nome_carteira,
                                                        objetivo_carteira_descricao: carteira.objetivo_carteira_descricao
                                                    });
                                                    setIsEditing(true);
                                                    setShowModalCarteira(true);
                                                }}>
                                                    <FaEdit /> Editar carteira
                                                </Button>
                                                <Button variant="danger" size="sm" onClick={() => handleDeleteCarteira(carteira._id)} className="ms-2">
                                                    <MdDelete /> Excluir carteira
                                                </Button>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </>
                    )}
                </Card.Body>
            </Card>

            {/* Gráfico de Pizza por Tipo de Investimento */}
            <Card className="mt-4">
                <Card.Header>
                    <h5>Distribuição dos Investimentos por Tipo</h5>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={4}>
                            <ul>
                                {investimentos.reduce((acc, investimento) => {
                                    const tipo = investimento.tipo_investimento;
                                    const valor = parseFloat(
                                        typeof investimento.valor_investido === 'object' && investimento.valor_investido.$numberDecimal
                                            ? investimento.valor_investido.$numberDecimal
                                            : investimento.valor_investido
                                    );

                                    const existing = acc.find(item => item.name === tipo);
                                    if (existing) {
                                        existing.value += valor;
                                    } else {
                                        acc.push({ name: tipo, value: valor });
                                    }
                                    return acc;
                                }, []).map((item, index) => (
                                    <li key={index} style={{ color: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'][index % 5] }}>
                                        {item.name}: R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </li>
                                ))}
                            </ul>
                        </Col>
                        <Col md={8}>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={investimentos.reduce((acc, investimento) => {
                                            const tipo = investimento.tipo_investimento;
                                            const valor = parseFloat(
                                                typeof investimento.valor_investido === 'object' && investimento.valor_investido.$numberDecimal
                                                    ? investimento.valor_investido.$numberDecimal
                                                    : investimento.valor_investido
                                            );

                                            const existing = acc.find(item => item.name === tipo);
                                            if (existing) {
                                                existing.value += valor;
                                            } else {
                                                acc.push({ name: tipo, value: valor });
                                            }
                                            return acc;
                                        }, [])}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                    >
                                        {investimentos.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'][index % 5]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        formatter={(value, name) => {
                                            const total = investimentos.reduce((acc, investimento) => {
                                                const valor = parseFloat(
                                                    typeof investimento.valor_investido === 'object' && investimento.valor_investido.$numberDecimal
                                                        ? investimento.valor_investido.$numberDecimal
                                                        : investimento.valor_investido
                                                );
                                                return acc + valor;
                                            }, 0);
                                            const percentage = ((value / total) * 100).toFixed(2);
                                            return [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, `${name}: ${percentage}%`];
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Renderização do gráfico de distribuição por carteiras */}
            <Card className="mt-4">
                <Card.Header>
                    <h5>Distribuição dos Investimentos por Carteira</h5>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={4}>
                            <ul>
                                {gerarDadosDistribuicaoPorCarteiras().map((carteira, index) => (
                                    <li key={index} style={{ color: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'][index % 5] }}>
                                        {carteira.name}: R$ {carteira.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </li>
                                ))}
                            </ul>
                        </Col>
                        <Col md={8}>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={gerarDadosDistribuicaoPorCarteiras()}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                    >
                                        {gerarDadosDistribuicaoPorCarteiras().map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'][index % 5]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        formatter={(value, name) => {
                                            const total = gerarDadosDistribuicaoPorCarteiras().reduce((acc, item) => acc + item.value, 0);
                                            const percentage = ((value / total) * 100).toFixed(2);
                                            return [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, `${name}: ${percentage}%`];
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Novo Investimento</Modal.Title>
                </Modal.Header>
                <Formik
                    initialValues={formData}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            await handleSubmit(values); // Chame a função de envio com os valores do formulário
                            setShowModal(false); // Feche o modal após o envio
                        } catch (error) {
                            console.error('Erro ao salvar investimento:', error);
                        } finally {
                            setSubmitting(false); // Libere o estado de submissão
                        }
                    }}
                >
                    {({ values, handleChange, handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <Modal.Body>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Carteira</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="carteira_id"
                                                value={nomeCarteiraSelecionada}
                                                readOnly
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tipo de Investimento</Form.Label>
                                            <Form.Select
                                                required
                                                name="tipo_investimento"
                                                value={values.tipo_investimento}
                                                onChange={handleChange}
                                            >
                                                <option value="">Selecione o tipo de investimento</option>
                                                <option value="Ações">Ações</option>
                                                <option value="CDB">CDB</option>
                                                <option value="Debentures">Debentures</option>
                                                <option value="Renda Fixa">Renda Fixa</option>
                                                <option value="Fundos">Fundos</option>
                                                <option value="Tesouro Direto">Tesouro Direto</option>
                                                <option value="Cryptomoeda">Cryptomoeda</option>
                                                <option value="LCI">LCI</option>
                                                <option value="LCA">LCA</option>
                                                <option value="Fundo Imobiliário">Fundo Imobiliário</option>
                                                <option value="ETF">ETF</option>
                                                <option value="Fundo Multimercado">Fundo Multimercado</option>
                                                <option value="Poupança">Poupança</option>
                                                <option value="Previdência Privada">Previdência Privada</option>
                                                <option value="Commodities">Commodities</option>
                                                <option value="Moeda Estrangeira">Moeda Estrangeira</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Valor Investido</Form.Label>
                                            <Form.Control
                                                type="number"
                                                required
                                                min="0"
                                                step="0.01"
                                                name="valor_investido"
                                                value={values.valor_investido}
                                                onChange={handleChange}
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
                                                name="taxa_juros"
                                                value={values.taxa_juros}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tipo de Juros</Form.Label>
                                            <Form.Select
                                                required
                                                name="tipo_juros"
                                                value={values.tipo_juros}
                                                onChange={handleChange}
                                            >
                                                <option value="Simples">Juros Simples</option>
                                                <option value="Composto">Juros Compostos</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Data</Form.Label>
                                            <Form.Control
                                                type="date"
                                                required
                                                name="data"
                                                value={values.data}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Frequência de Juros</Form.Label>
                                            <Form.Select
                                                required
                                                name="frequencia_juros"
                                                value={values.frequencia_juros}
                                                onChange={handleChange}
                                            >
                                                <option value="Mensal">Mensal</option>
                                                <option value="Anual">Anual</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Período de Investimento (meses)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                required
                                                min="1"
                                                name="periodo_investimento"
                                                value={values.periodo_investimento}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Descrição</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="descricao"
                                        value={values.descricao}
                                        onChange={handleChange}
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
                    )}
                </Formik>
            </Modal>

            {
                showModalCarteira && (
                    <Modal show={showModalCarteira} onHide={() => setShowModalCarteira(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{isEditing ? "Editar Carteira de Investimentos" : "Criar Carteira de Investimentos"}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleSubmitCarteira}>
                                <div className="mb-3">
                                    <label htmlFor="nomeCarteira" className="form-label">Nome da Carteira</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nomeCarteira"
                                        name="nomeCarteira"
                                        value={novaCarteira.nome_carteira}
                                        onChange={(e) => setNovaCarteira({ ...novaCarteira, nome_carteira: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="objetivoDescricao" className="form-label">Descrição do Objetivo</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="objetivoDescricao"
                                        name="objetivoDescricao"
                                        value={novaCarteira.objetivo_carteira_descricao}
                                        onChange={(e) => setNovaCarteira({ ...novaCarteira, objetivo_carteira_descricao: e.target.value })}
                                    />
                                </div>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowModalCarteira(false)}>
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" type="submit">
                                        {isEditing ? "Salvar Edição" : "Criar Carteira"}
                                    </Button>
                                </Modal.Footer>
                            </form>
                        </Modal.Body>
                    </Modal>
                )
            }
        </Pagina >
    );
}

