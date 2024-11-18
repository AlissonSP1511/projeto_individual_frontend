// projeto_individual_frontend/avaliacao_2/src/components/Pagina.js
'use client'

import { Container, Nav, Navbar, Button, Image } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from './ProtectedRoute';

export default function Pagina({ titulo, children }) {
    const [userName, setUserName] = useState('');
    const [expanded, setExpanded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedUserName = localStorage.getItem('userName');
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        router.push('/pages/login');
    };

    return (
        <>
            <Navbar className="bg-primary bg-opacity-25 p-1 text-black" expand="lg" variant="success" expanded={expanded}>
                <Navbar.Brand href="/">
                    <Image src="/brand2.png" alt="Brand Logo" width={100} height={50} style={{ paddingRight: '5px' }} />
                    <span className="fs-4 fw-bolder">Finanças Pessoais</span>

                </Navbar.Brand>
                <Navbar.Toggle onClick={() => setExpanded(!expanded)} />
                <Navbar.Collapse>
                    {userName && (
                        <ProtectedRoute>
                            <Nav className="mx-auto container d-flex ">
                                <Nav.Link href="/pages/dashboard" className="fw-bolder fs-5">Dashboard</Nav.Link>
                                <Nav.Link href="/pages/contasBancarias" className="fw-bolder fs-5">Contas</Nav.Link>
                                <Nav.Link href="/pages/cartoesDeCredito" className="fw-bolder fs-5">Cartões</Nav.Link>
                                <Nav.Link href="/pages/investimentos" className="fw-bolder fs-5">Investimentos</Nav.Link>
                                <Nav.Link href="/pages/categorias" className="fw-bolder fs-5">Categorias</Nav.Link>
                                <Nav.Link href="/pages/relatorios" className="fw-bolder fs-5">Relatórios</Nav.Link>
                            </Nav>
                        </ProtectedRoute>

                    )}
                    <Nav className='ms-auto'>
                        {userName ? (
                            <ProtectedRoute>
                                <div className="d-flex align-items-center">
                                    <span className="me-3 fw-bolder text-black opacity-75 fs-6">Olá, {userName}</span>
                                    <Button variant="outline-danger" onClick={handleLogout}>
                                        Sair
                                    </Button>
                                </div>
                            </ProtectedRoute>

                        ) : (
                            <Nav.Link href="/pages/login" >Entrar/Cadastrar</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            {/* <div className="bg-secondary py-3 text-white text-center mb-3">
                <Container>
                    <h1>{titulo}</h1>
                </Container>
            </div> */}
            <div className="mb-5 container">
                {children}
            </div>
        </>
    );
}