'use client'
import { Container, Nav, Navbar } from "react-bootstrap";
import { useState } from "react";
import Image from 'next/image';

export default function Pagina(props) {
    const [expanded, setExpanded] = useState(false);
    return (
        <>
            <Navbar className="bg-primary bg-opacity-25 p-1 text-gray" expand="lg" variant="success" expanded={expanded}>
                <Container>
                    <Navbar.Brand href="/">
                        <Image src="/brand2.png" alt="Brand Logo" width={100} height={50} style={{ paddingRight: '5px' }} />
                        <span>Finanças Pessoais</span>
                    </Navbar.Brand>
                    <Navbar.Toggle
                        aria-controls="basic-navbar-nav"
                        onClick={() => setExpanded(!expanded)} // Corrigido para alternar
                    />
                    <Navbar.Collapse id="basic-navbar-nav"> 
                        <Nav className="ms-auto text-center align-items-center">
                            <Nav.Link href="/pages/home">Home</Nav.Link>
                            <Nav.Link href="/pages/contasBancarias">
                                Contas<span className="d-none d-lg-inline"> Bancarias</span>
                            </Nav.Link>
                            <Nav.Link href="/pages/cartoesDeCredito">
                                Cartões<span className="d-none d-lg-inline"> de Credito</span>
                            </Nav.Link>
                            <Nav.Link href="/pages/dashboard">Dashboards</Nav.Link>
                            <Nav.Link href="/pages/investimentos">Investimentos</Nav.Link>
                            <Nav.Link href="/pages/relatorios">Relatórios</Nav.Link>
                            <div className="d-flex justify-content-center">
                                <Nav.Link 
                                    href="/pages/login" 
                                    className="text-primary-bold bg-primary bg-opacity-75 rounded-pill px-3 d-inline-block"
                                >
                                    Entrar/Cadastrar
                                </Nav.Link>
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* <div className="text-dark bg-dark bg-opacity-25 p-5">
                <h1 className="container">{props.titulo}</h1>
            </div> */}

            <div className="bg-primary bg-opacity-10">
                <Container>
                    {props.children}
                </Container>
            </div>
        </>
    );
}