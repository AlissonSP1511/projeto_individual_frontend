import React from 'react';
import { Box } from '@mui/material';
import Pagina from './Pagina';

const Carregando = () => {
  return (
    <Pagina titulo="Carregando...">
      <div className="preloader d-flex flex-column justify-content-center align-items-center min-vh-100">
        <Box
          component="img"
          sx={{
            animation: 'shake 1.5s infinite',
            '@keyframes shake': {
              '0%, 100%': { transform: 'translateX(0)' },
              '25%': { transform: 'translateX(-10px)' },
              '75%': { transform: 'translateX(10px)' }
            },
            height: 100,
            width: 600
          }}
          src="/LOGOAPP.png"
          alt="Financas Pessoais"
        />
        <h3 className="mt-3">Carregando...</h3>
      </div>
    </Pagina>
  );
};

export default Carregando;
