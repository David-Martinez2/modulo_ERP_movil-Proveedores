import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Eliminar token de autenticación si lo usas
    localStorage.removeItem('token');

    // Redirigir a la pantalla de login
    navigate('/Login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          ERP Móvil
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
