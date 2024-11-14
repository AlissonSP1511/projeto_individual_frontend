//avaliacao_2/src/app/pages/investimentos/form/[[...id]]/page.js
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
import { use } from 'react';

const validationSchema = Yup.object().shape({
    carteira_investimento_id: Yup.string().required('Carteira é obrigatória'),
    tipo: Yup.string().required('Tipo é obrigatório'),
    valor: Yup.number().min(0, 'Valor não pode ser negativo').required('Valor é obrigatório'),
    taxa_juros: Yup.number().required('Taxa de juros é obrigatória'),
    tipo_juros: Yup.string().required('Tipo de juros é obrigatório'),
    prazo_meses: Yup.number().required('Prazo é obrigatório')
});

export default function Page({ params }) {
    const router = useRouter();
    const id = use(params)?.id?.[0];
    const [carteiras, setCarteiras] = useState([]);
    const [investimento, setInvestimento] = useState({
        carteira_investimento_id: '',
        tipo: '',
        valor: '',
        taxa_juros: '',
        tipo_juros: 'Simples',
        prazo_meses: '',
        descricao: ''
    });

    useEffect(() => {
        carregarCarteiras();
        if (id) {
            carregarInvestimento();
        }
    }, [id]);

    const carregarCarteiras = async () => {
        try {
            const response = await Api_avaliacao_2DB.get('/carteirainvestimento');
            setCarteiras(response.data);
        } catch (error) {
            console.error('Erro ao carregar carteiras:', error);
        }
    };

    const carregarInvestimento = async () => {
        try {
            const response = await Api_avaliacao_2DB.get(`/investimento/${id}`);
            const dados = response.data;
            setInvestimento({
                ...dados,
                valor: parseFloat(dados.valor) || 0, // Garantir que seja um número
                taxa_juros: parseFloat(dados.taxa_juros) || 0, // Garantir que seja um número
            });
        } catch (error) {
            console.error('Erro ao carregar investimento:', error);
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        console.log('Enviando dados:', values); // Log para depuração
        try {
            if (id) {
                await Api_avaliacao_2DB.put(`/investimento/${id}`, values);
            } else {
                await Api_avaliacao_2DB.post('/investimento', values);
            }
            router.push('/pages/investimentos');
        } catch (error) {
            console.error('Erro ao salvar:', error);
        }
        setSubmitting(false);
    };

    return (
        <Pagina titulo={id ? "Editar Investimento" : "Novo Investimento"}>
            <Card className="card-primary">
                <Card.Header>
                    <Card.Title>{id ? 'Editar Investimento' : 'Novo Investimento'}</Card.Title>
                </Card.Header>
                <Formik
                    initialValues={{
                        ...investimento,
                        valor: parseFloat(investimento.valor) || 0,
                        taxa_juros: parseFloat(investimento.taxa_juros) || 0
                    }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
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
                                            <Form.Label>Taxa de Juros (%)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                name="taxa_juros"
                                                value={values.taxa_juros}
                                                onChange={handleChange}
                                                isInvalid={touched.taxa_juros && errors.taxa_juros}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.taxa_juros}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tipo de Juros</Form.Label>
                                            <Form.Select
                                                name="tipo_juros"
                                                value={values.tipo_juros}
                                                onChange={handleChange}
                                                isInvalid={touched.tipo_juros && errors.tipo_juros}
                                            >
                                                <option value="">Selecione o tipo de juros</option>
                                                <option value="Simples">Simples</option>
                                                <option value="Composto">Composto</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.tipo_juros}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Prazo (meses)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="1"
                                                name="prazo_meses"
                                                value={values.prazo_meses}
                                                onChange={handleChange}
                                                isInvalid={touched.prazo_meses && errors.prazo_meses}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.prazo_meses}
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