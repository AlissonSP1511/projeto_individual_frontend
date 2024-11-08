'use client'

import Pagina from "app/components/Pagina";
import Api_avaliacao_2DB from "app/services/Api_avaliacao_2DB";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import { MdOutlineArrowBack } from "react-icons/md";
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    conta_id: Yup.string().required('Conta é obrigatória'),
    categoria_id: Yup.string().required('Categoria é obrigatória'),
    valor: Yup.number().min(0, 'Valor não pode ser negativo').required('Valor é obrigatório'),
    tipo_transacao: Yup.string().required('Tipo de transação é obrigatório'),
    tipo: Yup.string().required('Tipo é obrigatório'),
});

export default function Page({ params }) {
    const route = useRouter();
    const [transacao, setTransacao] = useState({
        conta_id: '',
        categoria_id: '',
        valor: 0,
        tipo_transacao: '',
        tipo: '',
        data: new Date().toISOString().split('T')[0]
    });
    const [contas, setContas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const { id } = params?.id ? params : { id: null };

    useEffect(() => {
        // Carregar lista de contas
        Api_avaliacao_2DB.get('/conta')
            .then(result => {
                setContas(result.data);
            })
            .catch(error => {
                console.error('Erro ao carregar contas:', error);
            });

        // Carregar lista de categorias
        Api_avaliacao_2DB.get('/categoria')
            .then(result => {
                setCategorias(result.data);
            })
            .catch(error => {
                console.error('Erro ao carregar categorias:', error);
            });

        // Carregar dados da transação se for edição
        if (id) {
            Api_avaliacao_2DB.get(`/transacao/${id}`)
                .then(result => {
                    setTransacao(result.data);
                })
                .catch(error => {
                    console.error('Erro ao carregar transação:', error);
                });
        }
    }, [id]);

    function salvar(dados) {
        const endpoint = id ? `/transacao/${id}` : '/transacao';
        const method = id ? 'put' : 'post';

        Api_avaliacao_2DB[method](endpoint, dados)
            .then(() => {
                route.push('/pages/transacoes');
            })
            .catch(error => {
                console.error('Erro ao salvar transação:', error);
            });
    }

    return (
        <Pagina titulo="Transação">
            <Card className="card-primary">
                <Card.Header>
                    <Card.Title>{id ? 'Editar Transação' : 'Nova Transação'}</Card.Title>
                </Card.Header>
                <Formik
                    initialValues={transacao}
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
                                            <Form.Label>Conta</Form.Label>
                                            <Form.Select
                                                name="conta_id"
                                                value={values.conta_id}
                                                onChange={handleChange}
                                                isInvalid={touched.conta_id && errors.conta_id}
                                            >
                                                <option value="">Selecione uma conta</option>
                                                {contas.map(conta => (
                                                    <option key={conta._id} value={conta._id}>
                                                        {conta.tipo_conta} - {conta.usuario_id?.nome}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.conta_id}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Categoria</Form.Label>
                                            <Form.Select
                                                name="categoria_id"
                                                value={values.categoria_id}
                                                onChange={handleChange}
                                                isInvalid={touched.categoria_id && errors.categoria_id}
                                            >
                                                <option value="">Selecione uma categoria</option>
                                                {categorias.map(categoria => (
                                                    <option key={categoria.id} value={categoria._id}>
                                                        {categoria.descricao}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.categoria_id}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tipo de Transação</Form.Label>
                                            <Form.Select
                                                name="tipo_transacao"
                                                value={values.tipo_transacao}
                                                onChange={handleChange}
                                                isInvalid={touched.tipo_transacao && errors.tipo_transacao}
                                            >
                                                <option value="">Selecione o tipo</option>
                                                <option value="Entrada">Entrada</option>
                                                <option value="Saída">Saída</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.tipo_transacao}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tipo</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="tipo"
                                                value={values.tipo}
                                                onChange={handleChange}
                                                isInvalid={touched.tipo && errors.tipo}
                                                placeholder="Ex: Salário, Pagamento, etc"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.tipo}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
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
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Data</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="data"
                                                value={values.data}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                            <Card.Footer className="text-center">
                                <button type="submit" className="btn btn-success me-2">
                                    <FaSave /> Salvar
                                </button>
                                <Link
                                    href="/pages/transacoes"
                                    className="btn btn-danger"
                                >
                                    <MdOutlineArrowBack /> Voltar
                                </Link>
                            </Card.Footer>
                        </Form>
                    )}
                </Formik>
            </Card>
        </Pagina>
    );
}