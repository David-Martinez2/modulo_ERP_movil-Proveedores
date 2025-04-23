import React from 'react';
import { Box, Typography, Card, CardActionArea, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: 'calc(100vh - 64px)',
          background: 'linear-gradient(to bottom right, #f5f7fa, #c3cfe2)',
          padding: 2,
          gap: 3,
        }}
      >
        <Typography variant="h5" sx={{ mt: 2, fontWeight: 600, color: '#333' }}>
          Selecciona una opción
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <Card
            sx={{
              width: '45%',
              height: '180px',
              borderRadius: 3,
              boxShadow: 5,
              backgroundColor: '#ffffff',
            }}
          >
            <CardActionArea onClick={() => handleNavigation('/linea-produccion')}>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <PrecisionManufacturingIcon sx={{ fontSize: 50, color: '#1976d2' }} />
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'medium' }}>
                  Línea de Producción
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card
            sx={{
              width: '45%',
              height: '180px',
              borderRadius: 3,
              boxShadow: 5,
              backgroundColor: '#ffffff',
            }}
          >
            <CardActionArea onClick={() => handleNavigation('/punto-venta')}>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <PointOfSaleIcon sx={{ fontSize: 50, color: '#d32f2f' }} />
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'medium' }}>
                  Punto de Venta
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default HomePage;
