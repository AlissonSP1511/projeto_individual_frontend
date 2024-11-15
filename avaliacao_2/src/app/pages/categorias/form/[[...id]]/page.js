// projeto_individual_frontend/avaliacao_2/src/app/pages/categorias/form/[[...id]]/page.js
'use client'

import Pagina from 'components/Pagina';
import Api_avaliacao_2DB from 'services/Api_avaliacao_2DB';
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import { MdOutlineArrowBack } from "react-icons/md";
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    descricao: Yup.string().required('Descrição é obrigatória'),
});

export default function Page({ params }) {
    const route = useRouter();
    const [categoria, setCategoria] = useState({ descricao: '' });
    const { id } = params?.id ? params : { id: null };

    useEffect(() => {
        if (id) {
            Api_avaliacao_2DB.get(`/categoria/${id}`)
                .then(result => {
                    setCategoria(result.data);
                })
                .catch(error => {
                    console.error('Erro ao carregar categoria:', error);
                });
        }
    }, [id]);

    function salvar(dados) {
        const endpoint = id ? `/categoria/${id}` : '/categoria';
        const method = id ? 'put' : 'post';

        Api_avaliacao_2DB[method](endpoint, dados)
            .then(() => {
                route.push('/pages/categorias');
            })
            .catch(error => {
                console.error('Erro ao salvar categoria:', error);
            });
    }

    return (
        <Pagina titulo="Categoria">
            <Card className="card-primary">
                <Card.Header>
                    <Card.Title>{id ? 'Editar Categoria' : 'Nova Categoria'}</Card.Title>
                </Card.Header>
                <Formik
                    initialValues={categoria}
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
                                <Form.Group className="mb-3">
                                    <Form.Label>Descrição</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="descricao"
                                        value={values.descricao}
                                        onChange={handleChange}
                                        isInvalid={touched.descricao && errors.descricao}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.descricao}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Card.Body>
                            <Card.Footer className="text-center">
                                <button type="submit" className="btn btn-success me-2">
                                    <FaSave /> Salvar
                                </button>
                                <Link
                                    href="/pages/categorias"
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
