// avaliacao_2/src/app/pages/relatorios/form/[[...id]]/page.js
'use client'

import Pagina from "app/components/Pagina";
import Api_avaliacao_2DB from "app/services/Api_avaliacao_2DB";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import { MdOutlineArrowBack } from "react-icons/md";

export default function Page({ params }) {
    const route = useRouter();
    const [usuario, setUsuario] = useState({ nome: '', email: '' });

    // Desembrulha o params usando React.use()
    const { id } = React.use(params); // Aqui está a mudança

    useEffect(() => {
        if (id) {
            Api_avaliacao_2DB.get(`/usuario/${id}`)
                .then(result => {
                    setUsuario(result.data);
                })
                .catch(error => {
                    alert(error.response?.data?.message || "Ocorreu um erro ao buscar o usuário.");
                });
        }
    }, [id]); // Altera para id

    function salvar(dados) {
        if (usuario._id) {
            Api_avaliacao_2DB.put(`/usuario/${usuario._id}`, dados)
                .then(() => route.push('/pages/usuarios'))
                .catch(error => {
                    alert(error.response?.data?.message || "Ocorreu um erro ao atualizar o usuário.");
                });
        } else {
            Api_avaliacao_2DB.post('/usuario', dados)
                .then(() => route.push('/pages/usuarios'))
                .catch(error => {
                    alert(error.response?.data?.message || "Ocorreu um erro ao criar o usuário.");
                });
        }
    }

    return (
        <Pagina titulo="Usuário">
            <Formik
                initialValues={usuario}
                enableReinitialize={true}
                onSubmit={values => salvar(values)}
            >
                {({
                    values,
                    handleChange,
                    handleSubmit,
                }) => (
                    <Form>
                        <Form.Group className="mb-3" controlId="nome">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                name="nome"
                                value={values.nome}
                                onChange={handleChange('nome')}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={values.email}
                                onChange={handleChange('email')}
                            />
                        </Form.Group>
                        <div className="text-center">
                            <Button onClick={handleSubmit} variant="success">
                                <FaCheck /> Salvar
                            </Button>
                            <Link
                                href="/pages/usuarios"
                                className="btn btn-danger ms-2"
                            >
                                <MdOutlineArrowBack /> Voltar
                            </Link>
                        </div>
                    </Form>
                )}
            </Formik>
        </Pagina>
    );
}
