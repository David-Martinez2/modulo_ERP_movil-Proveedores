import React from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent } from '@mui/material';
import Navbar from './Navbar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const LineaProduccion = () => {
  const navigate = useNavigate(); // Hook de navegación

  const handleAccion = (accion) => {
    console.log(`Acción: ${accion}`);
    if (accion === 'registrar-produccion') {
      navigate('/registro-produccion'); // Redirige a la página de registro de producción
    } else if (accion === 'reportar-fallas') {
      navigate('/reportar-fallas'); // Corregido el error: `avigate` debe ser `navigate`
      console.log('Reportar fallas');
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          padding: 2,
          height: 'calc(100vh - 64px)',
          background: 'linear-gradient(to bottom right, #e0f7fa, #ffffff)',
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Línea de Producción
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardActionArea onClick={() => handleAccion('registrar-produccion')}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AddCircleOutlineIcon sx={{ fontSize: 40, color: '#1976d2' }} />
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    Registrar Producción
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardActionArea onClick={() => handleAccion('reportar-fallas')}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <ReportProblemIcon sx={{ fontSize: 40, color: '#d32f2f' }} />
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    Reportar Fallas
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default LineaProduccion;
