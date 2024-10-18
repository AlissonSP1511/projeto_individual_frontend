'use client'
import { Container, Nav, Navbar, NavDropdown, Button, Collapse } from "react-bootstrap";
import { useState } from "react";

export default function Pagina(props) {
    const [expanded, setExpanded] = useState(false);

    return (
        <>
            <Navbar bg="dark" expand="lg" variant="dark" expanded={expanded}>
                <Container>
                    <Navbar.Brand href="/">{props.titulo}</Navbar.Brand>
                    <Navbar.Toggle
                        aria-controls="basic-navbar-nav"
                        onClick={() => setExpanded(expanded ? false : "expanded")}
                    />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/pages/contas">Contas</Nav.Link>
                            <Nav.Link href="/pages/despesas">Despesas</Nav.Link>
                            <Nav.Link href="/pages/receitas">Receitas</Nav.Link>
                            <Nav.Link href="/pages/mensal">Mensal</Nav.Link>
                            <Nav.Link href="/pages/anual">Anual</Nav.Link>
                            <Nav.Link href="/pages/categorias">Categorias</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className="text-dark bg-dark bg-opacity-25 p-5">
                <h1 className="container">{props.titulo}</h1>
            </div>

            <Container>
                {props.children}
            </Container>
        </>
    );
}
