'use client'

import { Button, Card, CardContent, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Paper, Chip, Box, Tooltip } from "@mui/material";
import Pagina from "app/components/Pagina";
import Api_avaliacao_2DB from "app/services/Api_avaliacao_2DB";
import Link from "next/link"
import { useEffect, useState } from "react";
import { FaPlusCircle, FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2'
import { ResponsiveContainer, PieChart as RechartsePieChart, Pie, Cell } from 'recharts';

export default function Page() {
    const [contas, setContas] = useState([])
    console.log(contas)

    useEffect(() => {
        carregarContas()
    }, [])

    async function carregarContas() {
        try {
            const response = await Api_avaliacao_2DB.get('/conta');
            setContas(response.data || []);
        } catch (error) {
            console.error('Erro ao carregar contas:', error);
            setContas([]);
        }
    }

    function excluir(id) {
        Swal.fire({
            title: "Deseja realmente excluir esta conta?",
            text: "Você não será capaz de reverter isso!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, excluir!"
        }).then((result) => {
            if (result.isConfirmed) {
                Api_avaliacao_2DB.delete(`/conta/${id}`)
                    .then(() => {
                        carregarContas()
                        Swal.fire({
                            title: "Excluída!",
                            text: "Conta excluída com sucesso.",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }).catch((error) => {
                        console.error('Erro ao excluir conta:', error);
                    });
            }
        });
    }

    return (
        <Pagina titulo="Contas Bancárias">
            <Card>
                <CardHeader
                    title={`Contas Bancárias de ${localStorage.getItem('userName')}`}
                    action={
                        <Link href="/pages/contasBancarias/form" passHref>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<FaPlusCircle />}
                                size="small"
                            >
                                Nova Conta
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
                                    <TableCell>Nome do Banco</TableCell>
                                    <TableCell>Tipo de Conta</TableCell>
                                    <TableCell>Saldo</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {contas.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            <Link href={`/pages/contasBancarias/form/${item._id}`} passHref>
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
                                        {/* <TableCell>
                                            <Typography variant="subtitle1">
                                                {item.usuario_id?.nome || 'Usuário não encontrado'}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {item.usuario_id?.email}
                                            </Typography>
                                        </TableCell> */}
                                        <TableCell>
                                            <Chip
                                                label={item.nome_banco}
                                                color="default"
                                                size="small"
                                                className="fs-5"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={item.tipo_conta}
                                                color="primary"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={`R$ ${item.saldo.toFixed(2)}`}
                                                color={item.saldo > 0 ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* Gráfico de Pizza das Contas */}
                    <Box sx={{ mt: 4, height: 300 }}>
                        <Typography variant="h6" gutterBottom>
                            Distribuição do Saldo por Conta
                        </Typography>
                        {contas.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsePieChart>
                                    <Pie
                                        data={contas.map(conta => ({
                                            name: `${conta.nome_banco} (${conta.tipo_conta})`,
                                            value: Math.abs(conta.saldo)
                                        }))}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label={({ name, percent }) =>
                                            `${name}: ${(percent * 100).toFixed(1)}%`
                                        }
                                        labelLine={true}
                                        labelPlacement="outside"
                                        paddingAngle={4}
                                    >
                                        {contas.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={[
                                                    '#0088FE', '#00C49F', '#FFBB28',
                                                    '#FF8042', '#8884d8', '#82ca9d'
                                                ][index % 6]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => `R$ ${value.toFixed(2)}`}
                                    />
                                </RechartsePieChart>
                            </ResponsiveContainer>
                        ) : (
                            <Typography variant="body2" color="textSecondary" align="center">
                                Nenhuma conta disponível para exibir o gráfico
                            </Typography>
                        )}
                    </Box>
                </CardContent>
                <CardContent sx={{ borderTop: 1, borderColor: 'divider', textAlign: 'right' }}>
                    <Typography variant="body2">
                        Total de contas: {contas.length}
                    </Typography>
                </CardContent>
            </Card>
        </Pagina>
    )
}
