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

export default function App() {
    // Criação de cache padrão do Emotion
    const cache = createCache({ key: 'css' });

    return (


        <MaterialUIControllerProvider>
            {/* <CacheProvider value={cache}> */}
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Pagina titulo="Home" className="d-flex">


                    <Row>
                        <Col style={{ display: 'flex', justifyContent: 'center' }} className="justify-content-center mt-5 mb-4">
                            <Carousel className='container d-block w-200 img-fluid' preserveAspectRatio="xMidYMid slice">
                                <Carousel.Item interval={9000}>
                                    <Image src="https://portal.fgv.br/sites/portal.fgv.br/files/styles/noticia_geral/public/noticias/06/21/financas.jpg?itok=w3UzfCVO" text="First slide" className='container d-block w-200 img-fluid' preserveAspectRatio="xMidYMid slice" />
                                    <Carousel.Caption>
                                        <h3>First slide label</h3>
                                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                                <Carousel.Item interval={9000}>
                                    <Image src="https://investidorsardinha.r7.com/wp-content/uploads/2022/03/15-perfis-de-influenciados-de-financas-no-instagram-para-melhorar-suas-financas.png" text="Second slide" className='container d-block w-100 img-fluid' preserveAspectRatio="xMidYMid slice" />
                                    <Carousel.Caption>
                                        <h3>Second slide label</h3>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                                <Carousel.Item interval={9000}>
                                    <Image src="https://img.freepik.com/vetores-gratis/financas-e-ilustracao-de-conceito-de-desempenho-financeiro_53876-40450.jpg" text="Third slide" className='container d-block w-100 img-fluid' preserveAspectRatio="xMidYMid slice" />
                                    <Carousel.Caption>
                                        <h3>Third slide label</h3>
                                        <p>
                                            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                                        </p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            </Carousel>
                        </Col>
                        <Col className="justify-content-center mt-5 mb-4">
                            <div>
                                <h4>Bem-vindo ao [Nome do App]!</h4>
                                <p style={{ textAlign: 'center' }}>Sabemos que a vida financeira é um dos pilares para uma vida mais tranquila e segura, e manter as finanças organizadas é essencial para alcançar suas metas e realizar sonhos. Com o nosso aplicativo, você não apenas acompanha suas receitas e despesas, mas também enxerga uma visão completa de onde está indo o seu dinheiro, identificando oportunidades para economizar e planejar melhor o futuro.</p>
                            </div>
                        </Col>
                    </Row>


                    <Row >
                        <Col style={{ display: 'flex', justifyContent: 'center' }} >
                            <Card border="info" style={{ width: '18rem' }} className="bg-primary bg-opacity-10">
                                <Card.Header >Controle Total e Simplicidade</Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        Cuidar do seu dinheiro não precisa ser complicado. O [Nome do App] foi projetado para ser fácil de usar, com uma interface intuitiva que ajuda você a gerenciar todas as suas contas, cartões de crédito, investimentos e despesas em um só lugar. Tudo isso, sem a complexidade de outras ferramentas e com a facilidade de acesso a qualquer momento.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                            <Card border="info" style={{ width: '18rem' }}>
                                <Card.Header className="bg-primary bg-opacity-10">Visão Clara da Sua Saúde Financeira</Card.Header>
                                <Card.Body className="bg-primary bg-opacity-10">
                                    <Card.Text>
                                        Com gráficos interativos, dashboards completos e relatórios detalhados, você terá uma visão clara e precisa de como estão as suas finanças. Desde categorias de gastos até o saldo consolidado de todas as contas, o [Nome do App] oferece insights que facilitam suas decisões financeiras, permitindo entender para onde o dinheiro está indo e como melhor aproveitá-lo
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                            <Card border="info" style={{ width: '18rem' }} className="bg-primary bg-opacity-10">
                                <Card.Header>Defina e Alcance Suas Metas</Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        Todos nós temos metas financeiras: pagar uma dívida, economizar para uma viagem ou simplesmente manter um orçamento. Nosso app permite que você categorize gastos, controle investimentos e acompanhe as metas de poupança, ajudando a transformar seus objetivos em realidade. Cada transação é um passo a mais rumo ao seu sucesso financeiro!
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                            <Card border="info" style={{ width: '18rem' }}>
                                <Card.Header>Segurança e Privacidade</Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        Sabemos que a sua privacidade é fundamental. No [Nome do App], tratamos suas informações financeiras com o máximo de segurança e confidencialidade. Você pode organizar e monitorar seu dinheiro sabendo que seus dados estão protegidos.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                            <Card border="info" style={{ width: '18rem' }}>
                                <Card.Header>Flexível e Personalizável</Card.Header>
                                <Card.Body>
                                    <Card.Title>Info Card Title</Card.Title>
                                    <Card.Text>
                                        Cada pessoa lida com o dinheiro de uma forma diferente, e por isso, o [Nome do App] permite que você personalize categorias, configure lembretes, e ajuste o app conforme a sua necessidade. É a ferramenta certa para organizar suas finanças do jeito que você prefere.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>


                    <Row className="justify-content-center" mt={5}>
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                            <MDPagination size="large">
                                <MDPagination item>
                                    <MdOutlineKeyboardArrowLeft />
                                </MDPagination>
                                <MDPagination item active>1</MDPagination>
                                <MDPagination item>2</MDPagination>
                                <MDPagination item>3</MDPagination>
                                <MDPagination item>
                                    <MdOutlineKeyboardArrowRight />
                                </MDPagination>
                            </MDPagination>
                        </Col>
                    </Row>
                </Pagina>
            </ThemeProvider>
            {/* </CacheProvider> */}
        </MaterialUIControllerProvider>
    );
}
