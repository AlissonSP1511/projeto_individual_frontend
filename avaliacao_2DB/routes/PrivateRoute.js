// routes/PrivateRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// Componente que protege rotas
const PrivateRoute = ({ component: Component, ...rest }) => {
    const isAuthenticated = !!localStorage.getItem('token'); // Verifica se o token JWT está salvo

    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};

export default PrivateRoute;
