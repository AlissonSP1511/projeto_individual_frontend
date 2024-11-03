
'use client'
import { Container, Nav, Navbar } from "react-bootstrap";
import { useState } from "react";
import Image from 'next/image'; // Para uso com Next.js
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function Pagina(props) {
    const [expanded, setExpanded] = useState(false);
    return (
        <>
            <Navbar className="bg-primary bg-opacity-25 p-1 text-gray " expand="lg" variant="success" expanded={expanded}>
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
                        <Nav className="me-auto">
                            <LoginForm />
                            <RegisterForm/>
                            <Nav.Link href="/pages/cartoesDeCredito">Cartões de Credito</Nav.Link>
                            <Nav.Link href="/pages/categorias">Categorias</Nav.Link>
                            <Nav.Link href="/pages/contasBancarias">Contas Bancarias</Nav.Link>
                            <Nav.Link href="/pages/dashboard">Dashboards</Nav.Link>
                            <Nav.Link href="/pages/home">Home</Nav.Link>
                            <Nav.Link href="/pages/investimentos">Investimentos</Nav.Link>
                            <Nav.Link href="/pages/relatorios">Relatórios</Nav.Link>
                            <Nav.Link href="/pages/transacoes">Transações</Nav.Link>
                            <Nav.Link href="/pages/usuarios">Usuários</Nav.Link>
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