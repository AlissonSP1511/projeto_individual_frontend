// avaliacao_2/src/app/pages/contas/page.js
'use client'

import Pagina from "@/app/components/Pagina";
import Api_avaliacao_2DB from "@/app/services/Api_avaliacao_2DB";
import Link from "next/link"
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap"
import { FaPlusCircle } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2'

export default function Page() {

    const [contas, setContas] = useState([])

    useEffect(() => {
        // setContas(JSON.parse(localStorage.getItem('contas')) || [])
        carregarContas()
    }, [])

    async function carregarContas() {
        try {
            const response = await Api_avaliacao_2DB.get('/conta');
            setContas(response.data || []); // Define como array vazio se não houver dados
        } catch (error) {
            console.error('Erro ao carregar contas:', error);
            setContas([]); // Em caso de erro, assegura que contas seja um array
        }
    }

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
                // const dados = contas.filter(item => item.id != id)
                // localStorage.setItem('contas', JSON.stringify(dados))
                // setContas(dados)
                Api_avaliacao_2DB.delete(`/conta/${id}`)
                carregarContas()
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
        <Pagina titulo="Contas">

            <Link
                href="/pages/contas/form"
                className="btn btn-primary mb-3"
            >
                <FaPlusCircle /> Novo
            </Link>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Tipo</th>
                        <th>Data Adição</th>
                        <th>Saldo Inicial</th>
                    </tr>
                </thead>
                <tbody>
                    {contas.map((item, i) => (
                        <tr key={item.id}>
                            <td>
                                <Link href={`/pages/contas/form/${item.id}`}>
                                    <FaRegEdit title="Editar" className="text-primary" />
                                </Link>
                                <MdDelete
                                    title="Excluir"
                                    className="text-danger"
                                    onClick={() => excluir(item.id)}
                                />
                            </td>
                            <td>{item.nome}</td>
                            <td>{item.tipo}</td>
                            <td>{item.dataAdicao}</td>
                            <td>{item.saldoInicial}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Pagina>
    )
}