'use client'

import { Container, Nav, Navbar, Button, Image } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
            <Navbar className="bg-primary bg-opacity-25 p-1 text-gray" expand="lg" variant="success" expanded={expanded}>
                <Container>
                    <Navbar.Brand href="/">
                        <Image src="/brand2.png" alt="Brand Logo" width={100} height={50} style={{ paddingRight: '5px' }} />
                    </Navbar.Brand>
                    <Navbar.Toggle onClick={() => setExpanded(!expanded)} />
                    <Navbar.Collapse>
                        <Nav className="me-auto">
                            <Nav.Link href="/pages/home">Home</Nav.Link>
                            {userName && (
                                <>
                                    <Nav.Link href="/pages/dashboard">Dashboard</Nav.Link>
                                    <Nav.Link href="/pages/contasBancarias">Contas</Nav.Link>
                                    <Nav.Link href="/pages/cartoesDeCredito">Cartões</Nav.Link>
                                    <Nav.Link href="/pages/transacoes">Transações</Nav.Link>
                                    <Nav.Link href="/pages/investimentos">Investimentos</Nav.Link>
                                    <Nav.Link href="/pages/categorias">Categorias</Nav.Link>
                                    <Nav.Link href="/pages/relatorios">Relatórios</Nav.Link>
                                </>
                            )}
                        </Nav>
                        <Nav>
                            {userName ? (
                                <div className="d-flex align-items-center">
                                    <span className="me-3">Olá, {userName}</span>
                                    <Button variant="outline-danger" onClick={handleLogout}>
                                        Sair
                                    </Button>
                                </div>
                            ) : (
                                <Nav.Link href="/pages/login">Entrar/Cadastrar</Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div className="bg-secondary py-3 text-white text-center mb-3">
                <Container>
                    <h1>{titulo}</h1>
                </Container>
            </div>
            <Container className="mb-5">
                {children}
            </Container>
        </>
    );
}