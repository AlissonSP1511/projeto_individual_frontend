// projeto_individual_frontend/avaliacao_2/src/app/pages/contasBancarias/page.js
'use client'

import { Button, Card, CardContent, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Paper, Chip, Box, Tooltip, Grid } from "@mui/material";
import Link from "next/link"
import { useEffect, useState } from "react";
import { FaMoneyBillWave, FaPlusCircle, FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2'
import { ResponsiveContainer, PieChart as RechartsePieChart, Pie, Cell } from 'recharts';
import Pagina from "components/Pagina";
import Api_avaliacao_2DB from "services/Api_avaliacao_2DB";
import NomeUsuario from "components/NomeUsuario";

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
            <Card sx={{ mt: 2 }}>
                <CardHeader
                    title={<>Contas Bancárias de <NomeUsuario /></>}
                    className=" text-dark p-2 rounded" sx={{ backgroundColor: '#e3f2fd', fontSize: '1.2rem' }}
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
                                    <TableCell width={120} className="text-dark" sx={{ backgroundColor: '#e3f2fd', fontSize: '1.2rem' }}>Ações </TableCell>
                                    <TableCell className="text-dark" sx={{ backgroundColor: '#e3f2fd', fontSize: '1.2rem' }}>Nome do Banco</TableCell>
                                    <TableCell className="text-dark" sx={{ backgroundColor: '#e3f2fd', fontSize: '1.2rem' }}>Tipo de Conta</TableCell>
                                    <TableCell className="text-dark" sx={{ backgroundColor: '#e3f2fd', fontSize: '1.2rem' }}>Saldo</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {contas.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            <Link href={`/pages/contasBancarias/transacoes/${item._id}`} passHref>
                                                <IconButton color="success" size="small">
                                                    <Tooltip title="Gerenciar Transações">
                                                        <FaMoneyBillWave />
                                                    </Tooltip>
                                                </IconButton>
                                            </Link>
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
                                        <TableCell>
                                                <Chip
                                                    href={`/pages/contasBancarias/extrato/${item._id}`}
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
                    <Box sx={{ mt: 4, height: 300, mb: 4 }}>
                        <Typography variant="h6" gutterBottom className=" text-dark p-2 rounded" sx={{ backgroundColor: '#e3f2fd', fontSize: '1.2rem' }}>
                            Distribuição do Dinheiro pelas Contas
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
                                        labelLine={false}
                                        labelPlacement="outside"
                                        paddingAngle={4}
                                    >
                                        {contas.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={[
                                                    '#0088FE', '#00C49F', '#FFBB28',
                                                    '#FF8042', '#8884d8', '#82ca9d',
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
                    <Box sx={{ mt: 2, mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Resumo Financeiro
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper elevation={3} sx={{ p: 2, bgcolor: '#e3f2fd' }}>
                                    <Typography variant="subtitle1">Saldo Total</Typography>
                                    <Typography variant="h6">
                                        R$ {contas.reduce((acc, conta) => acc + conta.saldo, 0).toFixed(2)}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper elevation={3} sx={{ p: 2, bgcolor: '#e8f5e9' }}>
                                    <Typography variant="subtitle1">Total Positivo</Typography>
                                    <Typography variant="h6" color="success.main">
                                        R$ {contas.reduce((acc, conta) => acc + (conta.saldo > 0 ? conta.saldo : 0), 0).toFixed(2)}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper elevation={3} sx={{ p: 2, bgcolor: '#ffebee' }}>
                                    <Typography variant="subtitle1">Total Negativo</Typography>
                                    <Typography variant="h6" color="error.main">
                                        R$ {Math.abs(contas.reduce((acc, conta) => acc + (conta.saldo < 0 ? conta.saldo : 0), 0)).toFixed(2)}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
                <CardContent sx={{ borderTop: 1, borderColor: 'divider', textAlign: 'right' }}>
                    <Typography variant="body2" className="fs-5">
                        Total de contas: {contas.length}
                    </Typography>
                </CardContent>
            </Card>
        </Pagina>
    )
}
