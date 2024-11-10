// avaliacao_2/src/app/pages/transacoes/page.js
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
    const [transacoes, setTransacoes] = useState([])

    useEffect(() => {
        carregarTransacoes()
    }, [])

    async function carregarTransacoes() {
        try {
            const response = await Api_avaliacao_2DB.get('/transacao');
            setTransacoes(response.data || []);
        } catch (error) {
            console.error('Erro ao carregar transações:', error);
            setTransacoes([]);
        }
    }

    function excluir(id) {
        Swal.fire({
            title: "Deseja realmente excluir esta transação?",
            text: "Você não será capaz de reverter isso!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, excluir!"
        }).then((result) => {
            if (result.isConfirmed) {
                Api_avaliacao_2DB.delete(`/transacao/${id}`)
                    .then(() => {
                        carregarTransacoes()
                        Swal.fire({
                            title: "Excluída!",
                            text: "Transação excluída com sucesso.",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    })
            }
        });
    }

    return (
        <Pagina titulo="Transações">
            <Card>
                <CardHeader
                    title="Gerenciamento de Transações"
                    action={
                        <Link href="/pages/transacoes/form" passHref>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<FaPlusCircle />}
                                size="small"
                            >
                                Nova Transação
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
                                    <TableCell>Conta</TableCell>
                                    <TableCell>Categoria</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Valor</TableCell>
                                    <TableCell>Data</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transacoes.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            <Link href={`/pages/transacoes/form/${item._id}`} passHref>
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
                                                {item.conta_id?.tipo_conta || 'Conta não encontrada'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {item.categoria_id?.descricao || 'Sem categoria'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={item.tipo}
                                                color={item.tipo === 'Receita' ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={`R$ ${Number(item.valor).toFixed(2)}`}
                                                color={item.tipo === 'Receita' ? 'success' : 'error'}
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