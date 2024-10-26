'use client'
import { Container, Nav, Navbar } from "react-bootstrap";
import { useState } from "react";
import Image from 'next/image'; // Para uso com Next.js

export default function Pagina(props) {
    const [expanded, setExpanded] = useState(false);
    return (
        <>
            <Navbar className="bg-primary bg-opacity-25 p-2 text-gray " expand="lg" variant="success" expanded={expanded}>
                <Container>
                    <Navbar.Brand href="/">
                        <Image src="/brand2.png" alt="Brand Logo" width={125} height={75} style={{ paddingRight: '5px' }} />
                        <span>Finanças Pessoais</span>
                    </Navbar.Brand>
                    <Navbar.Toggle
                        aria-controls="basic-navbar-nav"
                        onClick={() => setExpanded(!expanded)} // Corrigido para alternar
                    />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/pages/deshboard">Dashboards</Nav.Link>
                            <Nav.Link href="/pages/contasbancarias">Contas Bancarias</Nav.Link>
                            <Nav.Link href="/pages/transacoes">Transações</Nav.Link>
                            <Nav.Link href="/pages/cartoesdecredito">Cartões de Credito</Nav.Link>
                            <Nav.Link href="/pages/relatorios">Relatórios</Nav.Link>
                            <Nav.Link href="/pages/categorias">Categorias</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* <div className="text-dark bg-dark bg-opacity-25 p-5">
                <h1 className="container">{props.titulo}</h1>
            </div> */}

            <Container>
                {props.children}
            </Container>
        </>
    );
}