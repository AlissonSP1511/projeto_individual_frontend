// avaliacao_2/src/app/pages/cartoesDeCredito/detalhes/[id]/page.js
'use client'

import React, { useEffect, useState } from 'react';
import { Card, Container, Table, Badge, Row, Col } from 'react-bootstrap';
import { FaCreditCard, FaCalendar } from 'react-icons/fa';
import { MdOutlineArrowBack } from 'react-icons/md';
import Link from 'next/link';
import Pagina from "app/components/Pagina";
import Api_avaliacao_2DB from "app/services/Api_avaliacao_2DB";
import Swal from 'sweetalert2';

export default function DetalhesCartao({ params }) {
    const { id } = React.use(params);
    const [cartao, setCartao] = useState(null);
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

                <div className="text-center mt-3">
                    <Link href="/pages/cartoesDeCredito" className="btn btn-danger">
                        <MdOutlineArrowBack /> Voltar
                    </Link>
                </div>
            </Container>
        </Pagina>
    );
} 