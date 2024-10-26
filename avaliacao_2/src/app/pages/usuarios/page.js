'use client'

import Pagina from "app/components/Pagina";
import Api_avaliacao_2DB from "app/services/Api_avaliacao_2DB";
import Link from "next/link"
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap"
import { FaPlusCircle, FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2'

export default function Page() {

    const [usuarios, setUsuarios] = useState([])

    useEffect(() => {
        carregarUsuarios()
    }, [])

    async function carregarUsuarios() {
        try {
            const response = await Api_avaliacao_2DB.get('/usuario');
            setUsuarios(response.data || []); // Define como array vazio se não houver dados
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            setUsuarios([]); // Em caso de erro, assegura que usuarios seja um array
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
                Api_avaliacao_2DB.delete(`/usuario/${id}`)
                .then(() => {
                    carregarUsuarios()
                    Swal.fire({
                        title: "Excluído!",
                        text: "Registro excluído com sucesso.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }).catch((error) => {
                    console.error('Erro ao excluir usuário:', error);
                });
            }
        });
    }

    return (
        <Pagina titulo="Usuários" className="bg-primary bg-opacity-10">
            <Link
                href="/pages/usuarios/form"
                className="btn btn-primary mb-3"
            >
                <FaPlusCircle /> Novo
            </Link>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((item) => (
                        <tr key={item._id}>
                            <td>
                                <Link href={`/pages/usuarios/form/${item._id}`}>
                                    <FaRegEdit title="Editar" className="text-primary" />
                                </Link>
                                <MdDelete
                                    title="Excluir"
                                    className="text-danger"
                                    onClick={() => excluir(item._id)}
                                />
                            </td>
                            <td>{item.nome}</td>
                            <td>{item.email}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Pagina>
    )
}
