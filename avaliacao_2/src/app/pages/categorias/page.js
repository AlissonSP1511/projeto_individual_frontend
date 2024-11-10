// avaliacao_2/src/app/pages/categorias/page.js
'use client'

import { Button, Card, CardContent, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Paper, Chip } from "@mui/material";
import Pagina from "app/components/Pagina";
import Api_avaliacao_2DB from "app/services/Api_avaliacao_2DB";
import Link from "next/link"
import { useEffect, useState } from "react";
import { FaPlusCircle, FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2'

export default function Page() {
    const [categorias, setCategorias] = useState([])

    useEffect(() => {
        carregarCategorias()
    }, [])

    async function carregarCategorias() {
        try {
            const response = await Api_avaliacao_2DB.get('/categoria');
            setCategorias(response.data || []);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            setCategorias([]);
        }
    }

    function excluir(id) {
        Swal.fire({
            title: "Deseja realmente excluir esta categoria?",
            text: "Você não será capaz de reverter isso!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, excluir!"
        }).then((result) => {
            if (result.isConfirmed) {
                Api_avaliacao_2DB.delete(`/categoria/${id}`)
                    .then(() => {
                        carregarCategorias()
                        Swal.fire({
                            title: "Excluída!",
                            text: "Categoria excluída com sucesso.",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    })
            }
        });
    }

    return (
        <Pagina titulo="Categorias">
            <Card>
                <CardHeader
                    title="Gerenciamento de Categorias"
                    action={
                        <Link href="/pages/categorias/form" passHref>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<FaPlusCircle />}
                                size="small"
                            >
                                Nova Categoria
                            </Button>
                        </Link>
                    }
                />
                <CardContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell width={120}>Ações</TableCell>
                                    <TableCell>Descrição</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categorias.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            <Link href={`/pages/categorias/form/${item._id}`} passHref>
                                                <IconButton color="primary" size="small">
                                                    <FaRegEdit />
                                                </IconButton>
                                            </Link>
                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() => excluir(item._id)}
                                            >
                                                <MdDelete />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle1">
                                                {item.descricao}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Pagina>
    )
}
