'use client'

import Pagina from "app/components/Pagina";
import Api_avaliacao_2DB from "app/services/Api_avaliacao_2DB";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import { FaCheck, FaSave } from "react-icons/fa";
import { MdOutlineArrowBack } from "react-icons/md";
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    usuario_id: Yup.string().required('Usuário é obrigatório'),
    tipo_conta: Yup.string().required('Tipo de conta é obrigatório'),
    saldo: Yup.number().min(0, 'Saldo não pode ser negativo').required('Saldo é obrigatório'),
});

export default function Page({ params }) {
    const route = useRouter();
    const [conta, setConta] = useState({ usuario_id: '', saldo: 0, tipo_conta: '' });
    const [usuarios, setUsuarios] = useState([]);
    const { id } = params?.id ? params : { id: null };

    useEffect(() => {
        // Carregar lista de usuários
        Api_avaliacao_2DB.get('/usuario')
            .then(result => {
                setUsuarios(result.data);
            })
            .catch(error => {
                console.error('Erro ao carregar usuários:', error);
            });

        // Carregar dados da conta se for edição
        if (id) {
            Api_avaliacao_2DB.get(`/conta/${id}`)
                .then(result => {
                    setConta(result.data);
                })
                .catch(error => {
                    console.error('Erro ao carregar conta:', error);
                });
        }
    }, [id]);

    function salvar(dados) {
        const endpoint = id ? `/conta/${id}` : '/conta';
        const method = id ? 'put' : 'post';

        Api_avaliacao_2DB[method](endpoint, dados)
            .then(() => {
                route.push('/pages/contasBancarias');
            })
            .catch(error => {
                console.error('Erro ao salvar conta:', error);
            });
    }

    return (
        <Pagina titulo="Conta Bancária">
            <Card className="card-primary">
                <Card.Header>
                    <Card.Title>{id ? 'Editar Conta' : 'Nova Conta'}</Card.Title>
                </Card.Header>
                <Formik
                    initialValues={conta}
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
                                            <Form.Label>Usuário</Form.Label>
                                            <Form.Select
                                                name="usuario_id"
                                                value={values.usuario_id}
                                                onChange={handleChange}
                                                isInvalid={touched.usuario_id && errors.usuario_id}
                                            >
                                                <option value="">Selecione um usuário</option>
                                                {usuarios.map(usuario => (
                                                    <option key={usuario._id} value={usuario._id}>
                                                        {usuario.nome}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.usuario_id}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tipo de Conta</Form.Label>
                                            <Form.Select
                                                name="tipo_conta"
                                                value={values.tipo_conta}
                                                onChange={handleChange}
                                                isInvalid={touched.tipo_conta && errors.tipo_conta}
                                            >
                                                <option value="">Selecione o tipo</option>
                                                <option value="Corrente">Corrente</option>
                                                <option value="Poupança">Poupança</option>
                                                <option value="Investimento">Investimento</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.tipo_conta}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Saldo</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                name="saldo"
                                                value={values.saldo}
                                                onChange={handleChange}
                                                isInvalid={touched.saldo && errors.saldo}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.saldo}
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
                                    href="/pages/contasBancarias"
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
