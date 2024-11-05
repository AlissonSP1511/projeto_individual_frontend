'use client';

import { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Pagina from 'app/components/Pagina';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { MaterialUIControllerProvider } from 'context';
import theme from 'assets/theme';
import MDPagination from 'components/MDPagination';
import { MdMargin, MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { Card, Carousel, Col, Image, Row } from 'react-bootstrap';
import LoginForm from 'app/components/LoginForm';
import RegisterForm from 'app/components/RegisterForm';
import { Container, Box, Paper, Typography } from '@mui/material';

export default function App() {
    const cache = createCache({ key: 'css' });

    return (
        <MaterialUIControllerProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Pagina titulo="Login">
                    <Container maxWidth="lg">
                        <Box container spacing={3} justifyContent="center" alignItems="center" style={{ minHeight: '80vh' }}>
                            <Box item xs={12} md={6}>
                                <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
                                    <Typography variant="h5" gutterBottom align="center">
                                        Login
                                    </Typography>
                                    <LoginForm />
                                </Paper>
                                <Paper elevation={3} sx={{ p: 4 }}>
                                    <Typography variant="h5" gutterBottom align="center">
                                        Cadastro
                                    </Typography>
                                    <RegisterForm />
                                </Paper>
                            </Box>
                        </Box>
                    </Container>
                </Pagina>
            </ThemeProvider>
        </MaterialUIControllerProvider>
    );
}
