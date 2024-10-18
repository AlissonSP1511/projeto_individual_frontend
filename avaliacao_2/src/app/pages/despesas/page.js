// avaliacao_2/src/app/pages/despesas/page.js
'use client'

import Pagina from "@/app/components/Pagina";
import Link from "next/link"
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap"
import { FaPlusCircle } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2'

export default function Page() {

    const [despesas, setDespesas] = useState([])

    useEffect(() => {
        setDespesas(JSON.parse(localStorage.getItem('despesas')) || [])
    }, [])

    function excluir(id) {
        Swal.fire({
            title: "Deseja realmente excluir o registro?",
            text: "Você não será capaz de reverter isso!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, excluir!"
        }).then((result) => {
            if (result.isConfirmed) {
                const dados = despesas.filter(item => item.id != id)
                localStorage.setItem('despesas', JSON.stringify(dados))
                setDespesas(dados)
                Swal.fire({
                    title: "Excluído!",
                    text: "Registro excluído com sucesso.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    }

    return (
        <Pagina titulo="Despesas">

            <Link
                href="/pages/despesas/form"
                className="btn btn-primary mb-3"
            >
                <FaPlusCircle /> Novo
            </Link>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Data Lançamento</th>
                        <th>Descrição</th>
                        <th>Saldo Anterior</th>
                        <th>Valor Lançamento</th>
                        <th>Saldo Final</th>
                    </tr>
                </thead>
                <tbody>
                    {despesas.map((item, i) => (
                        <tr key={item.id}>
                            <td>
                                <Link href={`/pages/despesas/form/${item.id}`}>
                                    <FaRegEdit title="Editar" className="text-primary" />
                                </Link>
                                <MdDelete
                                    title="Excluir"
                                    className="text-danger"
                                    onClick={() => excluir(item.id)}
                                />
                            </td>
                            <td>{item.dataLancamento}</td>
                            <td>{item.descricao}</td>
                            <td>{item.saldoAnterior}</td>
                            <td>{item.valorLancamento}</td>
                            <td>{item.saldoFinal}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Pagina>
    )
}