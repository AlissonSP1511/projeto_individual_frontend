// avaliacao_2/src/app/pages/receitas/form/[[...id]]/page.js
'use client'

import Pagina from "@/app/components/Pagina";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Form } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import { MdOutlineArrowBack } from "react-icons/md";
import { v4 as uuid} from "uuid";



export default function Page({ params }) {

    const route = useRouter()

    const receitas = JSON.parse(localStorage.getItem('receitas')) || []
    const dados = receitas.find(item => item.id == params.id)
    const receita = dados || { dataLancamento: '', descricao: '', saldoAnterior: '' , valorLancamento: '', saldoFinal: ''}

    function salvar(dados) {

        if (receita.id) {
            Object.assign(receita, dados)
        } else {
            dados.id = uuid()
            receitas.push(dados)
        }

        localStorage.setItem('receitas', JSON.stringify(receitas))
        return route.push('/pages/receitas')
    }

    return (
        <Pagina titulo="Receita">

            <Formik
                initialValues={receita}
                onSubmit={values => salvar(values)}
            >
                {({
                    values,
                    handleChange,
                    handleSubmit,
                }) => (
                    <Form>
                        <Form.Group className="mb-3" controlId="dataLancamento">
                            <Form.Label>Data Lançamento</Form.Label>
                            <Form.Control
                                type="text"
                                name="dataLancamento"
                                value={values.dataLancamento}
                                onChange={handleChange('dataLancamento')}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="descricao">
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control
                                type="text"
                                name="descricao"
                                value={values.descricao}
                                onChange={handleChange('descricao')}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="saldoAnterior">
                            <Form.Label>Saldo Anterior</Form.Label>
                            <Form.Control
                                type="text"
                                name="saldoAnterior"
                                value={values.saldoAnterior}
                                onChange={handleChange('saldoAnterior')}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="valorLancamento">
                            <Form.Label>Valor Lançamento</Form.Label>
                            <Form.Control
                                type="text"
                                name="valorLancamento"
                                value={values.valorLancamento}
                                onChange={handleChange('valorLancamento')}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="saldoFinal">
                            <Form.Label>Saldo Final</Form.Label>
                            <Form.Control
                                type="text"
                                name="saldoFinal"
                                value={values.saldoFinal}
                                onChange={handleChange('saldoFinal')}
                            />
                        </Form.Group>
                        <div className="text-center">
                            <Button onClick={handleSubmit} variant="success">
                                <FaCheck /> Salvar
                            </Button>
                            <Link
                                href="/pages/receitas"
                                className="btn btn-danger ms-2"
                            >
                                <MdOutlineArrowBack /> Voltar
                            </Link>
                        </div>
                    </Form>
                )}
            </Formik>
        </Pagina>
    )
}