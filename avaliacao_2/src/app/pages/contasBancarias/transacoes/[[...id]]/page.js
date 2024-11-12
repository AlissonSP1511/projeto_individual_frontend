'use client'

import React, { useEffect, useState } from "react";
import { Card, Container, Table, Form, Row, Col, Button } from 'react-bootstrap';
import { MdOutlineArrowBack, MdAdd, MdDelete, MdEdit } from 'react-icons/md';
import { FaMoneyBillWave } from 'react-icons/fa';
import Link from 'next/link';
import Pagina from "app/components/Pagina";
import Api_avaliacao_2DB from "app/services/Api_avaliacao_2DB";
import Swal from 'sweetalert2';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as XLSX from 'xlsx';

const validationSchema = Yup.object().shape({
    data: Yup.date().required('Data é obrigatória'),
    descricao: Yup.string(),
    tipo_transacao: Yup.string().required('Tipo de transação é obrigatório'),
    tipo_pagamento: Yup.string().required('Forma de pagamento é obrigatória'),
    valor: Yup.number().required('Valor é obrigatório').min(0.01, 'Valor deve ser maior que zero'),
    categoria_id: Yup.string().nullable()
});

export default function Page({ params }) {
    const { id } = React.use(params) || {};
    const [conta, setConta] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingTransacao, setEditingTransacao] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [sortField, setSortField] = useState('data');
    const [sortDirection, setSortDirection] = useState('desc');

    useEffect(() => {
        if (id) {
            carregarConta();
            carregarCategorias();
        }
    }, [id]);

    async function carregarConta() {
        try {
            const response = await Api_avaliacao_2DB.get(`/conta/${id[0]}`);
            setConta(response.data);
        } catch (error) {
            console.error('Erro ao carregar conta:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Não foi possível carregar os detalhes da conta.'
            });
        }
    }

    async function carregarCategorias() {
        try {
            const response = await Api_avaliacao_2DB.get('/categoria');
            setCategorias(response.data);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        }
    }

    async function handleSubmit(values, { resetForm }) {
        try {
            const dadosParaEnviar = {
                ...values,
                categoria_id: values.categoria_id || undefined
            };
    
            if (editingTransacao) {
                // Atualiza transação existente
                await Api_avaliacao_2DB.patch(  // Mudando de put para patch
                    `/conta/${id[0]}/transacao/${editingTransacao._id}`, 
                    dadosParaEnviar
                );
            } else {
                // Cria nova transação
                await Api_avaliacao_2DB.post(
                    `/conta/${id[0]}/transacao`, 
                    dadosParaEnviar
                );
            }
    
            await carregarConta();
            setShowForm(false);
            setEditingTransacao(null);
            resetForm();
            
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: editingTransacao 
                    ? 'Transação atualizada com sucesso!' 
                    : 'Transação registrada com sucesso!'
            });
        } catch (error) {
            console.error('Erro ao salvar transação:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Não foi possível salvar a transação.'
            });
        }
    }

    async function handleDelete(transacaoId) {
        try {
            await Api_avaliacao_2DB.delete(`/conta/${id[0]}/transacao/${transacaoId}`);
            await carregarConta();
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Transação excluída com sucesso!'
            });
        } catch (error) {
            console.error('Erro ao excluir transação:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Não foi possível excluir a transação.'
            });
        }
    }

    const sortTransactions = (transactions) => {
        return [...transactions].sort((a, b) => {
            if (sortField === 'data') {
                const dateA = new Date(a.data);
                const dateB = new Date(b.data);
                return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
            } else if (sortField === 'valor') {
                return sortDirection === 'asc' ? a.valor - b.valor : b.valor - a.valor;
            }
            return 0;
        });
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const csvText = e.target.result;
                const rows = csvText.split('\n');
                
                // Encontra a linha que contém o cabeçalho das transações
                const headerIndex = rows.findIndex(row => 
                    row.includes('Data Lançamento;Histórico;Descrição;Valor;Saldo'));
                
                if (headerIndex === -1) {
                    throw new Error('Formato do arquivo inválido');
                }

                // Pega apenas as linhas com dados das transações
                const transactionRows = rows.slice(headerIndex + 1)
                    .filter(row => row.trim().length > 0);

                const transacoes = transactionRows.map(row => {
                    const [dataLancamento, historico, descricao, valor] = row.split(';');

                    // Trata a data
                    const [dia, mes, ano] = dataLancamento.trim().split('/');
                    const dataTransacao = new Date(ano, mes - 1, dia);

                    // Trata o valor
                    const valorString = valor.trim()
                        .replace('R$', '')
                        .replace(/\./g, '')
                        .replace(',', '.')
                        .trim();
                    const valorNumerico = parseFloat(valorString);

                    return {
                        data: dataTransacao,
                        descricao: descricao.trim() || historico.trim(), // Usa histórico se descrição estiver vazia
                        tipo_transacao: valorNumerico > 0 ? 'Entrada' : 'Saída',
                        tipo_pagamento: detectarTipoPagamento(historico.trim().toLowerCase()),
                        valor: Math.abs(valorNumerico)
                    };
                });

                // Confirmação antes de importar
                const result = await Swal.fire({
                    title: 'Confirmar importação',
                    text: `Foram encontradas ${transacoes.length} transações. Deseja importar?`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Sim, importar',
                    cancelButtonText: 'Cancelar'
                });

                if (result.isConfirmed) {
                    let importadas = 0;
                    for (const transacao of transacoes) {
                        await Api_avaliacao_2DB.post(`/conta/${id[0]}/transacao`, transacao);
                        importadas++;
                    }

                    await carregarConta();
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Sucesso!',
                        text: `${importadas} transações foram importadas com sucesso!`
                    });
                }
            } catch (error) {
                console.error('Erro ao importar arquivo:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: 'Erro ao importar as transações. Verifique o formato do arquivo.'
                });
            }
        };

        reader.readAsText(file);
    };

    // Função auxiliar para detectar o tipo de pagamento
    const detectarTipoPagamento = (historico) => {
        if (historico.includes('pix')) {
            return 'Pix';
        } else if (historico.includes('débito')) {
            return 'Débito';
        } else if (historico.includes('aplicação')) {
            return 'Aplicação';
        } else {
            return 'Outros';
        }
    };

    if (!conta) return <div>Carregando...</div>;

    return (
        <Pagina titulo={`Gerenciar Transações - ${conta.nome_banco}`}>
            <Container>
                <Link href="/pages/contasBancarias" className="btn btn-secondary mb-3">
                    <MdOutlineArrowBack /> Voltar
                </Link>

                <Card className="mb-4">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Transações</h5>
                        <div>
                            <input
                                type="file"
                                id="fileInput"
                                accept=".xlsx,.xls,.csv"
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                            />
                            <Button 
                                variant="info" 
                                className="me-2"
                                onClick={() => document.getElementById('fileInput').click()}
                            >
                                <MdAdd /> Importar Excel
                            </Button>
                            <Button 
                                variant="success" 
                                onClick={() => {
                                    setEditingTransacao(null);
                                    setShowForm(!showForm);
                                }}
                            >
                                <MdAdd /> Nova Transação
                            </Button>
                        </div>
                    </Card.Header>

                    {showForm && (
                        <Card.Body>
                            <Formik
                                initialValues={{
                                    data: editingTransacao 
                                        ? new Date(editingTransacao.data).toISOString().split('T')[0]
                                        : '',
                                    descricao: editingTransacao?.descricao || '',
                                    tipo_transacao: editingTransacao?.tipo_transacao || '',
                                    tipo_pagamento: editingTransacao?.tipo_pagamento || '',
                                    valor: editingTransacao?.valor || '',
                                    categoria_id: editingTransacao?.categoria_id || null
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                                enableReinitialize
                            >
                                {({ handleSubmit, handleChange, values, errors, touched }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Data</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        name="data"
                                                        value={values.data}
                                                        onChange={handleChange}
                                                        isInvalid={touched.data && errors.data}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.data}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
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
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Tipo de Transação</Form.Label>
                                                    <Form.Select
                                                        name="tipo_transacao"
                                                        value={values.tipo_transacao}
                                                        onChange={handleChange}
                                                        isInvalid={touched.tipo_transacao && errors.tipo_transacao}
                                                    >
                                                        <option value="">Selecione...</option>
                                                        <option value="Entrada">Entrada</option>
                                                        <option value="Saída">Saída</option>
                                                    </Form.Select>
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.tipo_transacao}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Forma de Pagamento</Form.Label>
                                                    <Form.Select
                                                        name="tipo_pagamento"
                                                        value={values.tipo_pagamento}
                                                        onChange={handleChange}
                                                        isInvalid={touched.tipo_pagamento && errors.tipo_pagamento}
                                                    >
                                                        <option value="">Selecione...</option>
                                                        <option value="Boleto">Boleto</option>
                                                        <option value="Cartão Debito">Cartão Débito</option>
                                                        <option value="Pix">Pix</option>
                                                        <option value="Transferência">Transferência</option>
                                                        <option value="Dinheiro">Dinheiro</option>
                                                        <option value="Cheque">Cheque</option>
                                                        <option value="Depósito">Depósito</option>
                                                    </Form.Select>
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.tipo_pagamento}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Descrição</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        name="descricao"
                                                        value={values.descricao}
                                                        onChange={handleChange}
                                                        isInvalid={touched.descricao && errors.descricao}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <div className="text-end">
                                            <Button variant="primary" type="submit">
                                                {editingTransacao ? 'Atualizar Transação' : 'Salvar Transação'}
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </Card.Body>
                    )}

                    <Card.Body>
                        <Table responsive striped hover>
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('data')} style={{ cursor: 'pointer' }}>
                                        Data {sortField === 'data' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th>Descrição</th>
                                    <th>Tipo</th>
                                    <th>Forma Pagamento</th>
                                    <th onClick={() => handleSort('valor')} style={{ cursor: 'pointer' }}>
                                        Valor {sortField === 'valor' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortTransactions(conta.transacoes).map((transacao) => (
                                    <tr key={transacao._id}>
                                        <td>{new Date(transacao.data).toLocaleDateString('pt-BR')}</td>
                                        <td>{transacao.descricao}</td>
                                        <td>{transacao.tipo_transacao}</td>
                                        <td>{transacao.tipo_pagamento}</td>
                                        <td className={transacao.tipo_transacao === 'Entrada' ? 'text-success' : 'text-danger'}>
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transacao.valor)}
                                        </td>
                                        <td>
                                            <Button 
                                                variant="primary" 
                                                size="sm" 
                                                className="me-2"
                                                onClick={() => {
                                                    setEditingTransacao(transacao);
                                                    setShowForm(true);
                                                }}
                                            >
                                                <MdEdit />
                                            </Button>
                                            <Button 
                                                variant="danger" 
                                                size="sm" 
                                                onClick={() => handleDelete(transacao._id)}
                                            >
                                                <MdDelete />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Container>
        </Pagina>
    );
}