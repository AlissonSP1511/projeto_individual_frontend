// avaliacao_2/src/app/pages/investimentos/page.js
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
    const [investimentos, setInvestimentos] = useState([])

    useEffect(() => {
        carregarInvestimentos()
    }, [])

    async function carregarInvestimentos() {
        try {
            const response = await Api_avaliacao_2DB.get('/investimento');
            setInvestimentos(response.data || []);
        } catch (error) {
            console.error('Erro ao carregar investimentos:', error);
            setInvestimentos([]);
        }
    }

    function excluir(id) {
        Swal.fire({
            title: "Deseja realmente excluir este investimento?",
            text: "Você não será capaz de reverter isso!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, excluir!"
        }).then((result) => {
            if (result.isConfirmed) {
                Api_avaliacao_2DB.delete(`/investimento/${id}`)
                    .then(() => {
                        carregarInvestimentos()
                        Swal.fire({
                            title: "Excluído!",
                            text: "Investimento excluído com sucesso.",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    })
            }
        });
    }

    return (
        <Pagina titulo="Investimentos">
            <Card>
                <CardHeader
                    title="Gerenciamento de Investimentos"
                    action={
                        <Link href="/pages/investimentos/form" passHref>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<FaPlusCircle />}
                                size="small"
                            >
                                Novo Investimento
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
                                    <TableCell>Carteira</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Valor</TableCell>
                                    <TableCell>Rendimento</TableCell>
                                    <TableCell>Data</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {investimentos.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            <Link href={`/pages/investimentos/form/${item._id}`} passHref>
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
                                                {item.carteira_investimento_id?.conta_id?.tipo_conta || 'Carteira não encontrada'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={item.tipo}
                                                color="primary"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={`R$ ${Number(item.valor).toFixed(2)}`}
                                                color="success"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={`${Number(item.rendimento).toFixed(2)}%`}
                                                color={Number(item.rendimento) > 0 ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(item.data).toLocaleDateString()}
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