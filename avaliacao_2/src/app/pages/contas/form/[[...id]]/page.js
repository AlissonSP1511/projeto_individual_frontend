'use client'

import Pagina from "@/app/components/Pagina";
import Api_avaliacao_2DB from "@/app/services/Api_avaliacao_2DB";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import { MdOutlineArrowBack } from "react-icons/md";

export default function Page({ params }) {
    const route = useRouter();
    const [conta, setConta] = useState({ usuario_id: '', tipo_conta: '', saldo: '' });
    
    useEffect(() => {
        // Simular um usuário logado, ou pegar o `usuario_id` de alguma lógica de login já existente
        const usuarioId = "id-do-usuario-logado"; // Substitua por lógica real para obter o ID do usuário
        
        if (params.id) {
            Api_avaliacao_2DB.get(`/conta/${params.id}`)
                .then(result => {
                    setConta(result.data);
                })
                .catch(error => {
                    alert(error.response?.data?.message || "Ocorreu um erro ao buscar a conta.");
                });
        } else {
            setConta(prevState => ({ ...prevState, usuario_id: usuarioId }));
        }
    }, [params.id]);

    function salvar(dados) {
        console.log('dados', dados);
        if (conta.id) {
            Api_avaliacao_2DB.put(`/conta/${conta.id}`, dados)
                .then(result => {
                    return route.push('/pages/contas');
                })
                .catch(error => {
                    alert(error.response?.data?.message || "Ocorreu um erro ao atualizar a conta.");
                });
        } else {
            Api_avaliacao_2DB.post('/conta', dados)
                .then(resultado => {
                    return route.push('/pages/contas');
                })
                .catch(error => {
                    alert(error.response?.data?.message || "Ocorreu um erro ao criar a conta.");
                });
        }
    }

    return (
        <Pagina titulo="Conta">
            <Formik
                initialValues={conta}
                enableReinitialize={true}
                onSubmit={values => salvar(values)}
            >
                {({
                    values,
                    handleChange,
                    handleSubmit,
                }) => (
                    <Form>
                        <Form.Group className="mb-3" controlId="usuario_id">
                            <Form.Label>ID do Usuário</Form.Label>
                            <Form.Control
                                type="text"
                                name="usuario_id"
                                value={values.usuario_id}
                                onChange={handleChange('usuario_id')}
                                readOnly // Se o usuário já está logado, esse campo pode ser readonly
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="tipo">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Control
                                type="text"
                                name="tipo"
                                value={values.tipo}
                                onChange={handleChange('tipo')}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="dataAdicao">
                            <Form.Label>Data Adição</Form.Label>
                            <Form.Control
                                type="date"
                                name="dataAdicao"
                                value={values.dataAdicao}
                                onChange={handleChange('dataAdicao')}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="saldoInicial">
                            <Form.Label>Saldo Inicial</Form.Label>
                            <Form.Control
                                type="number"
                                name="saldoInicial"
                                value={values.saldoInicial}
                                onChange={handleChange('saldoInicial')}
                            />
                        </Form.Group>
                        <div className="text-center">
                            <Button onClick={handleSubmit} variant="success">
                                <FaCheck /> Salvar
                            </Button>
                            <Link
                                href="/pages/contas"
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
