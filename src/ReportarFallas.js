import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Button, TextField, MenuItem,
  FormControl, InputLabel, Select, Box, Card, CardContent,
  Snackbar, Alert
} from '@mui/material';
import axios from 'axios';
import Navbar from './Navbar'; // Asegúrate de tener el Navbar importado

const ReportarFallas = () => {
  const [maquinas, setMaquinas] = useState([]);
  const [tiposFalla] = useState([
    'Fallo eléctrico',
    'Mantenimiento preventivo',
    'Fallo mecánico',
    'Otro',
  ]);
  const [reporte, setReporte] = useState({
    empleado_id: 1,
    maquina_id: '',
    descripcion_falla: '',
    severidad: 'Baja',
    fecha_reporte: '',
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    axios.get('http://localhost:3001/api/maquinas')
      .then(response => setMaquinas(response.data))
      .catch(error => {
        console.error('Error al cargar máquinas:', error);
        setSnackbarMessage('Error al cargar máquinas');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReporte(prevReporte => ({
      ...prevReporte,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!reporte.descripcion_falla.trim()) {
      setSnackbarMessage('La descripción de la falla es obligatoria.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
  
    if (!reporte.fecha_reporte) {
      setSnackbarMessage('La fecha del reporte es obligatoria.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
  
    // Formatear fecha correctamente
    const fechaFormateada = new Date(reporte.fecha_reporte).toISOString().slice(0, 19).replace('T', ' ');
  
    // 👇 Asegúrate que los nombres coincidan con lo que espera el backend
    const reporteFinal = {
      empleado_id: reporte.empleado_id,
      maquina_id: reporte.maquina_id,
      descripcion_falla: reporte.descripcion_falla.trim(),
      severidad: reporte.severidad,
      fecha_reporte: fechaFormateada,
    };
  
    console.log("REPORTE ENVIADO AL BACK:", reporteFinal); // 🪵 Debug
  
    axios.post('http://localhost:3001/api/fallas', reporteFinal)
      .then(response => {
        setSnackbarMessage('Falla reportada con éxito');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setReporte({
          empleado_id: 1,
          maquina_id: '',
          descripcion_falla: '',
          severidad: 'Baja',
          fecha_reporte: '',
        });
      })
      .catch(error => {
        console.error('Error al reportar la falla:', error);
        setSnackbarMessage('Error al guardar el reporte');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      });
  };
  

  return (
    <>
      <Navbar />
      <Box sx={{ padding: 4 }}>
        <Container maxWidth="md" sx={{ backgroundColor: '#fff', padding: 4, borderRadius: 4, boxShadow: 3 }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 700, color: '#3a3a3a' }}>
            Reportar Falla
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Máquina Afectada */}
              <Grid item xs={12}>
                <Card sx={{ boxShadow: 3, borderRadius: 4 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Máquina Afectada</Typography>
                    <FormControl fullWidth>
                      <InputLabel>Máquina</InputLabel>
                      <Select
                        name="maquina_id"
                        value={reporte.maquina_id}
                        onChange={handleChange}
                        required
                        sx={{
                          backgroundColor: '#f9f9f9',
                          borderRadius: 8,
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#4caf50' },
                            '&:hover fieldset': { borderColor: '#388e3c' },
                            '&.Mui-focused fieldset': { borderColor: '#2c6e26' },
                          },
                        }}
                      >
                        {maquinas.map(maquina => (
                          <MenuItem key={maquina.id} value={maquina.id}>
                            {maquina.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              {/* Severidad */}
              <Grid item xs={12} sm={6}>
                <Card sx={{ boxShadow: 3, borderRadius: 4 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Severidad</Typography>
                    <FormControl fullWidth>
                      <InputLabel>Severidad</InputLabel>
                      <Select
                        name="severidad"
                        value={reporte.severidad}
                        onChange={handleChange}
                        required
                        sx={{
                          backgroundColor: '#f9f9f9',
                          borderRadius: 8,
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#4caf50' },
                            '&:hover fieldset': { borderColor: '#388e3c' },
                            '&.Mui-focused fieldset': { borderColor: '#2c6e26' },
                          },
                        }}
                      >
                        <MenuItem value="Baja">Baja</MenuItem>
                        <MenuItem value="Media">Media</MenuItem>
                        <MenuItem value="Alta">Alta</MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              {/* Descripción de la Falla */}
              <Grid item xs={12}>
                <Card sx={{ boxShadow: 3, borderRadius: 4 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Descripción de la Falla</Typography>
                    <TextField
                      label="Descripción de la Falla"
                      name="descripcion_falla"
                      value={reporte.descripcion_falla}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={4}
                      required
                      sx={{
                        backgroundColor: '#f9f9f9',
                        borderRadius: 8,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: '#4caf50' },
                          '&:hover fieldset': { borderColor: '#388e3c' },
                          '&.Mui-focused fieldset': { borderColor: '#2c6e26' },
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Fecha de Reporte */}
              <Grid item xs={12} sm={6}>
                <Card sx={{ boxShadow: 3, borderRadius: 4 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Fecha de Reporte</Typography>
                    <TextField
                      label="Fecha de Reporte"
                      type="datetime-local"
                      name="fecha_reporte"
                      value={reporte.fecha_reporte}
                      onChange={handleChange}
                      fullWidth
                      required
                      sx={{
                        backgroundColor: '#f9f9f9',
                        borderRadius: 8,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: '#4caf50' },
                          '&:hover fieldset': { borderColor: '#388e3c' },
                          '&.Mui-focused fieldset': { borderColor: '#2c6e26' },
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Botón */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="error"
                  type="submit"
                  sx={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#d32f2f',
                    '&:hover': { backgroundColor: '#c62828' },
                    fontSize: '1.2rem',
                    fontWeight: 600,
                  }}
                >
                  Reportar Falla
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={snackbarSeverity} onClose={() => setOpenSnackbar(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ReportarFallas;
