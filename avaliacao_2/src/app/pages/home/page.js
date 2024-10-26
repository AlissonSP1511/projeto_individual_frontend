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
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { Col, Row } from 'react-bootstrap';

export default function App() {
    // Criação de cache padrão do Emotion
    const cache = createCache({ key: 'css' });

    return (


        <MaterialUIControllerProvider>
            {/* <CacheProvider value={cache}> */}
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Pagina titulo="Home">
                    <Row className="justify-content-center">
                        <Carousel>
                            <Carousel.Item interval={1000}>
                                <ExampleCarouselImage text="First slide" />
                                <Carousel.Caption>
                                    <h3>First slide label</h3>
                                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item interval={500}>
                                <ExampleCarouselImage text="Second slide" />
                                <Carousel.Caption>
                                    <h3>Second slide label</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                                <ExampleCarouselImage text="Third slide" />
                                <Carousel.Caption>
                                    <h3>Third slide label</h3>
                                    <p>
                                        Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                                    </p>
                                </Carousel.Caption>
                            </Carousel.Item>
                        </Carousel>
                    </Row>
                    <Row className="justify-content-center">
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
