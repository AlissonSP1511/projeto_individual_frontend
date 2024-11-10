// avaliacao_2/src/app/pages/investimentos/form/[[...id]]/page.js
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
    carteira_investimento_id: Yup.string().required('Carteira é obrigatória'),
    tipo: Yup.string().required('Tipo é obrigatório'),
    valor: Yup.number().min(0, 'Valor não pode ser negativo').required('Valor é obrigatório'),
    rendimento: Yup.number().required('Rendimento é obrigatório'),
});

export default function Page({ params }) {
    const route = useRouter();
    const [investimento, setInvestimento] = useState({
        carteira_investimento_id: '',
        tipo: '',
        valor: 0,
        rendimento: 0
    });
    const [carteiras, setCarteiras] = useState([]);
    const { id } = params?.id ? params : { id: null };

    useEffect(() => {
        // Carregar lista de carteiras
        Api_avaliacao_2DB.get('/carteirainvestimento')
            .then(result => {
                setCarteiras(result.data);
            })
            .catch(error => {
                console.error('Erro ao carregar carteiras:', error);
            });

        // Carregar dados do investimento se for edição
        if (id) {
            Api_avaliacao_2DB.get(`/investimento/${id}`)
                .then(result => {
                    setInvestimento(result.data);
                })
                .catch(error => {
                    console.error('Erro ao carregar investimento:', error);
                });
        }
    }, [id]);

    function salvar(dados) {
        const endpoint = id ? `/investimento/${id}` : '/investimento';
        const method = id ? 'put' : 'post';

        Api_avaliacao_2DB[method](endpoint, dados)
            .then(() => {
                route.push('/pages/investimentos');
            })
            .catch(error => {
                console.error('Erro ao salvar investimento:', error);
            });
    }

    return (
        <Pagina titulo="Investimento">
            <Card className="card-primary">
                <Card.Header>
                    <Card.Title>{id ? 'Editar Investimento' : 'Novo Investimento'}</Card.Title>
                </Card.Header>
                <Formik
                    initialValues={investimento}
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
                                            <Form.Label>Carteira</Form.Label>
                                            <Form.Select
                                                name="carteira_investimento_id"
                                                value={values.carteira_investimento_id}
                                                onChange={handleChange}
                                                isInvalid={touched.carteira_investimento_id && errors.carteira_investimento_id}
                                            >
                                                <option value="">Selecione uma carteira</option>
                                                {carteiras.map(carteira => (
                                                    <option key={carteira._id} value={carteira._id}>
                                                        {carteira.conta_id?.tipo_conta || 'Carteira sem conta'}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.carteira_investimento_id}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tipo</Form.Label>
                                            <Form.Select
                                                name="tipo"
                                                value={values.tipo}
                                                onChange={handleChange}
                                                isInvalid={touched.tipo && errors.tipo}
                                            >
                                                <option value="">Selecione o tipo</option>
                                                <option value="Ações">Ações</option>
                                                <option value="Renda Fixa">Renda Fixa</option>
                                                <option value="Fundos">Fundos</option>
                                                <option value="Tesouro Direto">Tesouro Direto</option>
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
                                            <Form.Label>Rendimento (%)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                name="rendimento"
                                                value={values.rendimento}
                                                onChange={handleChange}
                                                isInvalid={touched.rendimento && errors.rendimento}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.rendimento}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                            <Card.Footer className="text-center">
                                <button type="submit" className="btn btn-success me-2">
                                    <FaSave /> Salvar
                                </button>
                                <Link
                                    href="/pages/investimentos"
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