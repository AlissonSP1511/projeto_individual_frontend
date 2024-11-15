// projeto_individual_frontend/avaliacao_2/src/app/pages/contasBancarias/form/[[...id]]/page.js
'use client'

import Pagina from 'components/Pagina';
import Api_avaliacao_2DB from 'services/Api_avaliacao_2DB';
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import { FaCheck, FaSave } from "react-icons/fa";
import { MdOutlineArrowBack } from "react-icons/md";
import * as Yup from 'yup';
import { use } from 'react';

const validationSchema = Yup.object().shape({
    usuario_id: Yup.string().required('Usuário é obrigatório'),
    tipo_conta: Yup.string().required('Tipo de conta é obrigatório'),
    nome_banco: Yup.string().required('Nome do banco é obrigatório'),
    saldo: Yup.number()
        .typeError('Saldo deve ser um número')
        .required('Saldo é obrigatório')
        .min(0, 'Saldo não pode ser negativo'),
});

export default function Page({ params }) {
    const route = useRouter();
    const [conta, setConta] = useState({
        usuario_id: '',
        saldo: '',
        tipo_conta: '',
        nome_banco: ''
    });
    const [usuarios, setUsuarios] = useState([]);
    const [userName, setUserName] = useState('');
    const [initialUserId, setInitialUserId] = useState('');

    const resolvedParams = use(params);
    const id = resolvedParams?.id ? resolvedParams.id[0] : null;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUserName(localStorage.getItem('userName') || '');
            setInitialUserId(localStorage.getItem('userId') || '');
        }
    }, []);

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

    async function salvar(dados) {
        try {
            // Primeiro, verifica se já existe uma conta com o mesmo nome_banco para este usuário
            const response = await Api_avaliacao_2DB.get('/conta', {
                params: {
                    usuario_id: dados.usuario_id,
                    nome_banco: dados.nome_banco
                }
            });

            const contaExistente = response.data.find(conta => 
                conta.nome_banco === dados.nome_banco && 
                conta._id !== id // ignora a conta atual em caso de edição
            );

            if (contaExistente) {
                // Se existe, soma o saldo
                const novoSaldo = Number(contaExistente.saldo) + Number(dados.saldo);
                
                // Atualiza a conta existente
                await Api_avaliacao_2DB.put(`/conta/${contaExistente._id}`, {
                    ...contaExistente,
                    saldo: novoSaldo
                });
            } else {
                // Se não existe, cria uma nova conta
                const dadosParaSalvar = {
                    ...dados,
                    usuario_id: dados.usuario_id || localStorage.getItem('userId'),
                    nome_banco: dados.tipo_conta === 'Dinheiro Físico' ? 'Dinheiro Físico' : dados.nome_banco
                };

                const endpoint = id ? `/conta/${id}` : '/conta';
                const method = id ? 'put' : 'post';

                await Api_avaliacao_2DB[method](endpoint, dadosParaSalvar);
            }

            route.push('/pages/contasBancarias');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar a conta. Por favor, tente novamente.');
        }
    }

    return (
        <Pagina titulo="Conta Bancária">
            <Card className="card-primary">
                <Card.Header>
                    <Card.Title>{id ? 'Editar Conta' : 'Nova Conta'}</Card.Title>
                </Card.Header>
                <Formik
                    initialValues={{
                        ...conta,
                        usuario_id: initialUserId
                    }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={values => salvar(values)}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleSubmit
                    }) => (
                        <Form onSubmit={handleSubmit}>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Usuário</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={userName}
                                                disabled
                                                plaintext
                                            />
                                            <Form.Control
                                                type="hidden"
                                                name="usuario_id"
                                                value={values.usuario_id}
                                                onChange={handleChange}
                                            />
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
                                                <option value="Criptomoeda">Criptomoeda</option>
                                                <option value="Dinheiro Físico">Dinheiro Físico</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.tipo_conta}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {values.tipo_conta !== 'Dinheiro Físico' && (
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>nome_banco</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="nome_banco"
                                                    value={values.nome_banco}
                                                    onChange={handleChange}
                                                    isInvalid={touched.nome_banco && errors.nome_banco}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.nome_banco}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                )}
                                <Row>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Saldo</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                name="saldo"
                                                value={values.saldo || ''}
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
