// avaliacao_2/src/app/components/PageHome.js
'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Pagina from 'app/components/Pagina';
import createCache from '@emotion/cache';
import { MaterialUIControllerProvider } from 'context';
import theme from 'assets/theme';
import MDPagination from 'components/MDPagination';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { Card, Carousel, Col, Image, Row } from 'react-bootstrap';

export default function App() {
    // Criação de cache padrão do Emotion
    const cache = createCache({ key: 'css' });
    return (
        <MaterialUIControllerProvider>
            {/* <CacheProvider value={cache}> */}
            <ThemeProvider theme={theme}>
                <Pagina titulo="Home">
                    <Row className="d-flex justify-content-center row-cols-1 row-cols-lg-2 row-cols-sm-1">
                        <Col className="d-flex justify-content-center mt-5 mb-4">
                            <Carousel className="container d-block w-100 img-fluid" preserveAspectRatio="xMidYMid slice">
                                <Carousel.Item interval={9000}>
                                    <div className="carousel-image-wrapper">
                                        <Image src="https://blog.singularityubrazil.com/wp-content/uploads/2023/01/financas-corporativas.jpg" alt="First slide" className='d-block w-100' />
                                    </div>
                                </Carousel.Item>
                                <Carousel.Item interval={9000}>
                                    <div className="carousel-image-wrapper">
                                        <Image src="https://investidorsardinha.r7.com/wp-content/uploads/2022/03/15-perfis-de-influenciados-de-financas-no-instagram-para-melhorar-suas-financas.png" alt="Second slide" className='d-block w-100' />
                                    </div>
                                </Carousel.Item>
                                <Carousel.Item interval={9000}>
                                    <div className="carousel-image-wrapper">
                                        <Image src="https://img.freepik.com/vetores-gratis/financas-e-ilustracao-de-conceito-de-desempenho-financeiro_53876-40450.jpg" alt="Third slide" className='d-block w-100' />
                                    </div>
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
                    <h1 className="max-w-[590px] text-base-text text-3xl font-semibold md:leading-[64px] text-center tracking-tight sm:text-5xl lg:max-w-[460px] lg:text-5xl lg:text-left lg:m-0 xl:max-w-[550px] xl:text-6xl">
                        Controle financeiro pessoal com toda a
                        <div className="inline-block relative z-10">
                            <span className="text-transparent bg-clip-text z-20 bg-[#129E3F]">praticidade</span>
                        </div>
                        que a planilha não te oferece
                    </h1>
                    <Row className='d-flex justify-content-center row-cols-1 row-cols-lg-3 g-4 mt-5'  >
                        <Col style={{ display: 'flex', justifyContent: 'center' }} >
                            <Card border="info" className="bg-primary bg-opacity-10">
                                <Card.Header >Controle Total e Simplicidade</Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        Cuidar do seu dinheiro não precisa ser complicado. O [Nome do App] foi projetado para ser fácil de usar, com uma interface intuitiva que ajuda você a gerenciar todas as suas contas, cartões de crédito, investimentos e despesas em um só lugar. Tudo isso, sem a complexidade de outras ferramentas e com a facilidade de acesso a qualquer momento.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                            <Card border="info" >
                                <Card.Header className="bg-primary bg-opacity-10">Visão Clara da Sua Saúde Financeira</Card.Header>
                                <Card.Body className="bg-primary bg-opacity-10">
                                    <Card.Text>
                                        Com gráficos interativos, dashboards completos e relatórios detalhados, você terá uma visão clara e precisa de como estão as suas finanças. Desde categorias de gastos até o saldo consolidado de todas as contas, o [Nome do App] oferece insights que facilitam suas decisões financeiras, permitindo entender para onde o dinheiro está indo e como melhor aproveitá-lo
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                            <Card border="info" className="bg-primary bg-opacity-10">
                                <Card.Header>Defina e Alcance Suas Metas</Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        Todos nós temos metas financeiras: pagar uma dívida, economizar para uma viagem ou simplesmente manter um orçamento. Nosso app permite que você categorize gastos, controle investimentos e acompanhe as metas de poupança, ajudando a transformar seus objetivos em realidade. Cada transação é um passo a mais rumo ao seu sucesso financeiro!
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                            <Card border="info" >
                                <Card.Header className="bg-primary bg-opacity-10">Segurança e Privacidade</Card.Header>
                                <Card.Body className="bg-primary bg-opacity-10">
                                    <Card.Text>
                                        Sabemos que a sua privacidade é fundamental. No [Nome do App], tratamos suas informações financeiras com o máximo de segurança e confidencialidade. Você pode organizar e monitorar seu dinheiro sabendo que seus dados estão protegidos.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                            <Card border="info" className="bg-primary bg-opacity-10">
                                <Card.Header>Flexível e Personalizável</Card.Header>
                                <Card.Body>
                                    <Card.Title>Info Card Title</Card.Title>
                                    <Card.Text>
                                        Cada pessoa lida com o dinheiro de uma forma diferente, e por isso, o [Nome do App] permite que você personalize categorias, configure lembretes, e ajuste o app conforme a sua necessidade. É a ferramenta certa para organizar suas finanças do jeito que você prefere.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                            <Card border="info"  >
                                <Card.Header className="bg-primary bg-opacity-10">Flexível e Personalizável</Card.Header>
                                <Card.Body className="bg-primary bg-opacity-10">
                                    <Card.Title>Info Card Title</Card.Title>
                                    <Card.Text>
                                        Cada pessoa lida com o dinheiro de uma forma diferente, e por isso, o [Nome do App] permite que você personalize categorias, configure lembretes, e ajuste o app conforme a sua necessidade. É a ferramenta certa para organizar suas finanças do jeito que você prefere.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                            <Card border="info" className="bg-primary bg-opacity-10">
                                <Card.Header>Flexível e Personalizável</Card.Header>
                                <Card.Body>
                                    <Card.Title>Info Card Title</Card.Title>
                                    <Card.Text>
                                        Cada pessoa lida com o dinheiro de uma forma diferente, e por isso, o [Nome do App] permite que você personalize categorias, configure lembretes, e ajuste o app conforme a sua necessidade. É a ferramenta certa para organizar suas finanças do jeito que você prefere.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                            <Card border="info" >
                                <Card.Header className="bg-primary bg-opacity-10">Flexível e Personalizável</Card.Header>
                                <Card.Body className="bg-primary bg-opacity-10">
                                    <Card.Title>Info Card Title</Card.Title>
                                    <Card.Text>
                                        Cada pessoa lida com o dinheiro de uma forma diferente, e por isso, o [Nome do App] permite que você personalize categorias, configure lembretes, e ajuste o app conforme a sua necessidade. É a ferramenta certa para organizar suas finanças do jeito que você prefere.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                            <Card border="info" className="bg-primary bg-opacity-10">
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
            <style jsx>{`
                .carousel-image-wrapper {
  height: 400px; /* Defina a altura que você deseja */
  overflow: hidden; /* Oculta qualquer conteúdo que ultrapasse a altura */
  display: flex; /* Usado para centralizar */
  justify-content: center; /* Centraliza horizontalmente */
  align-items: center; /* Centraliza verticalmente */
}
.carousel-image-wrapper img {
  width: 100%; /* Garante que a imagem preencha a largura do contêiner */
  height: auto; /* Mantém a proporção da imagem */
  object-fit: cover; /* Corta a imagem de forma centralizada */
}
            `}</style>
        </MaterialUIControllerProvider>
    );
}