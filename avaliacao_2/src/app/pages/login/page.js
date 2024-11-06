'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Pagina from 'app/components/Pagina';
import createCache from '@emotion/cache';
import { MaterialUIControllerProvider } from 'context';
import theme from 'assets/theme';
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
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            style={{ minHeight: '80vh' }}
                        >
                            <Box
                                sx={{
                                    width: { xs: '100%', md: '50%' }
                                }}
                            >
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
