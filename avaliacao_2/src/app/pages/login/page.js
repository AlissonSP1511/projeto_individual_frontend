// projeto_individual_frontend/avaliacao_2/src/app/pages/login/page.js
'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createCache from '@emotion/cache';
import { MaterialUIControllerProvider } from 'context';
import theme from 'assets/theme';
import { Container, Box, Paper, Typography } from '@mui/material';
import Pagina from 'components/Pagina';
import LoginForm from 'components/LoginForm';
import RegisterForm from 'components/RegisterForm';
export default function App() {
    const cache = createCache({ key: 'css' });

    return (
        <MaterialUIControllerProvider>
            <ThemeProvider theme={theme}>
                {/* <CssBaseline /> */}
                <Pagina titulo="Login">
                    <Container maxWidth="lg">
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            paddingTop={5}
                            style={{ minHeight: '80vh' }}
                        >
                            <Box
                                sx={{
                                    width: { xs: '100%', md: '50%' }
                                }}
                            >
                                <Paper elevation={3} sx={{ p: 4, mb: 5 }}>
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
