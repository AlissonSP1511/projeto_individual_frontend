'use client';

import { Container, Nav, Navbar, Button, Image } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from './ProtectedRoute';
import './Pagina.css'; // Estilo customizado
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

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
        <div className="page-container">
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
                                <Nav.Link href="/pages/contasBancarias" className="fw-bolder fs-5">Contas</Nav.Link>
                                <Nav.Link href="/pages/cartoesDeCredito" className="fw-bolder fs-5">Cartões</Nav.Link>
                                <Nav.Link href="/pages/investimentos" className="fw-bolder fs-5">Investimentos</Nav.Link>
                                <Nav.Link href="/pages/categorias" className="fw-bolder fs-5">Categorias</Nav.Link>
                            </Nav>
                        </ProtectedRoute>
                    )}
                    <Nav className="ms-auto">
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
                            <Nav.Link href="/pages/login">Entrar/Cadastrar</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <div className="content-container mb-5 mt-4 ">
                <Container>

                    {children}
                </Container>
            </div>

            <footer className="bg-primary bg-opacity-25 text-black py-3 fs-6">
                <Container className="text-center">
                    <p className="mb-1">© 2024 Finanças Pessoais - Todos os direitos reservados.</p>
                    <p className="small">
                        Desenvolvido por <a href="https://github.com/seu-perfil" className="text-success fw-bold" target="_blank" rel="noopener noreferrer">Alisson S. Pereira</a>
                    </p>
                    <p className="small">
                        Contato: <a href="mailto:seuemail@example.com" className="text-success fw-bold">alisson.silva.pereira@gmail.com</a>
                    </p>
                    <div className="social-links d-flex justify-content-center" style={{ display: 'flex', gap: '10px' }}>
                        <a href="https://facebook.com/seu-perfil" target="_blank" rel="noopener noreferrer" style={{ color: '#3b5998' }}>
                            <FaFacebook /> Facebook
                        </a>
                        <a href="https://twitter.com/seu-perfil" target="_blank" rel="noopener noreferrer" style={{ color: '#1da1f2' }}>
                            <FaTwitter /> Twitter
                        </a>
                        <a href="https://instagram.com/seu-perfil" target="_blank" rel="noopener noreferrer" style={{ color: '#c32aa3' }}>
                            <FaInstagram /> Instagram
                        </a>
                        <a href="https://linkedin.com/in/seu-perfil" target="_blank" rel="noopener noreferrer" style={{ color: '#0077b5' }}>
                            <FaLinkedin /> LinkedIn
                        </a>
                        <a href="https://youtube.com/seu-perfil" target="_blank" rel="noopener noreferrer" style={{ color: '#ff0000' }}>
                            <FaYoutube /> YouTube
                        </a>
                    </div>
                </Container>
            </footer>
        </div>
    );
}
