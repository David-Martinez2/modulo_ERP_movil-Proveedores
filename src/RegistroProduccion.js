import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Button, TextField, MenuItem, FormControl, InputLabel, Select, Box, Card, CardContent } from '@mui/material';
import axios from 'axios';
import Navbar from './Navbar'; // Asegúrate de tener el Navbar importado

const RegistroProduccion = () => {
  const [maquinas, setMaquinas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [registro, setRegistro] = useState({
    maquina_id: '',
    producto_id: '',
    cantidad_producida: '',
    estado_produccion: 'operativa',
    horas_trabajadas: '',
    descripcion: '',
  });

  // Obtener máquinas y productos desde la API
  useEffect(() => {
    // Obtener máquinas de la base de datos
    axios.get('http://localhost:3001/api/maquinas')
      .then(response => setMaquinas(response.data))
      .catch(error => console.error('Error al cargar máquinas:', error));

    // Obtener productos de la base de datos
    axios.get('http://localhost:3001/api/productos')
      .then(response => setProductos(response.data))
      .catch(error => console.error('Error al cargar productos:', error));
  }, []);

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegistro(prevRegistro => ({
      ...prevRegistro,
      [name]: value,
    }));
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí se obtiene el empleado_id (puedes obtenerlo de un sistema de autenticación si es necesario)
    const empleado_id = 1;  // Este valor debería ser dinámico según el usuario autenticado

    const registroData = {
      empleado_id: empleado_id,
      producto_id: registro.producto_id,
      cantidad: registro.cantidad_producida,
      turno: 'mañana',  // Este valor también puede ser dinámico
      fecha: new Date().toISOString(),
      maquina_id: registro.maquina_id,
      horas_trabajadas: registro.horas_trabajadas,
      estado_produccion: registro.estado_produccion,
      descripcion: registro.descripcion,
    };

    // Imprimir los datos que se van a enviar al backend para verificar que son correctos
    console.log('Datos enviados:', registroData);

    // Enviar los datos a la API
    axios.post('http://localhost:3001/api/produccion', registroData)
      .then(response => {
        alert('Registro guardado con éxito');
        setRegistro({
          maquina_id: '',
          producto_id: '',
          cantidad_producida: '',
          estado_produccion: 'operativa',
          horas_trabajadas: '',
          descripcion: '',
        });
      })
      .catch(error => {
        console.error('Error al registrar la producción:', error);
        alert('Error al guardar el registro');
      });
  };

  return (
    <>
      {/* Agregar el Navbar aquí */}
      <Navbar />

      <Box sx={{ padding: 4 }}>
        <Container maxWidth="md" sx={{ backgroundColor: '#fff', padding: 4, borderRadius: 4, boxShadow: 3 }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 700, color: '#3a3a3a' }}>
            Registro de Producción
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Selección de máquina */}
              <Grid item xs={12}>
                <Card sx={{ boxShadow: 3, borderRadius: 4 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Máquina</Typography>
                    <FormControl fullWidth>
                      <InputLabel>Máquina</InputLabel>
                      <Select
                        name="maquina_id"
                        value={registro.maquina_id}
                        onChange={handleChange}
                        required
                        sx={{
                          backgroundColor: '#f9f9f9',
                          borderRadius: 8,
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: '#4caf50',
                            },
                            '&:hover fieldset': {
                              borderColor: '#388e3c',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#2c6e26',
                            },
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

              {/* Selección de producto */}
              <Grid item xs={12}>
                <Card sx={{ boxShadow: 3, borderRadius: 4 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Producto</Typography>
                    <FormControl fullWidth>
                      <InputLabel>Producto</InputLabel>
                      <Select
                        name="producto_id"
                        value={registro.producto_id}
                        onChange={handleChange}
                        required
                        sx={{
                          backgroundColor: '#f9f9f9',
                          borderRadius: 8,
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: '#4caf50',
                            },
                            '&:hover fieldset': {
                              borderColor: '#388e3c',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#2c6e26',
                            },
                          },
                        }}
                      >
                        {productos.map(producto => (
                          <MenuItem key={producto.id} value={producto.id}>
                            {producto.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              {/* Cantidad producida */}
              <Grid item xs={12} sm={6}>
                <Card sx={{ boxShadow: 3, borderRadius: 4 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Cantidad Producida</Typography>
                    <TextField
                      label="Cantidad Producida"
                      type="number"
                      name="cantidad_producida"
                      value={registro.cantidad_producida}
                      onChange={handleChange}
                      fullWidth
                      required
                      sx={{
                        backgroundColor: '#f9f9f9',
                        borderRadius: 8,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#4caf50',
                          },
                          '&:hover fieldset': {
                            borderColor: '#388e3c',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2c6e26',
                          },
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Estado de producción */}
              <Grid item xs={12} sm={6}>
                <Card sx={{ boxShadow: 3, borderRadius: 4 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Estado de Producción</Typography>
                    <FormControl fullWidth>
                      <InputLabel>Estado de Producción</InputLabel>
                      <Select
                        name="estado_produccion"
                        value={registro.estado_produccion}
                        onChange={handleChange}
                        required
                        sx={{
                          backgroundColor: '#f9f9f9',
                          borderRadius: 8,
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: '#4caf50',
                            },
                            '&:hover fieldset': {
                              borderColor: '#388e3c',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#2c6e26',
                            },
                          },
                        }}
                      >
                        <MenuItem value="operativa">Operativa</MenuItem>
                        <MenuItem value="parada">Parada</MenuItem>
                        <MenuItem value="en mantenimiento">En Mantenimiento</MenuItem>
                        <MenuItem value="fallo">Fallo</MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              {/* Horas trabajadas */}
              <Grid item xs={12} sm={6}>
                <Card sx={{ boxShadow: 3, borderRadius: 4 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Horas Trabajadas</Typography>
                    <TextField
                      label="Horas Trabajadas"
                      type="number"
                      name="horas_trabajadas"
                      value={registro.horas_trabajadas}
                      onChange={handleChange}
                      fullWidth
                      required
                      sx={{
                        backgroundColor: '#f9f9f9',
                        borderRadius: 8,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#4caf50',
                          },
                          '&:hover fieldset': {
                            borderColor: '#388e3c',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2c6e26',
                          },
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Descripción */}
              <Grid item xs={12}>
                <Card sx={{ boxShadow: 3, borderRadius: 4 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Descripción</Typography>
                    <TextField
                      label="Descripción"
                      name="descripcion"
                      value={registro.descripcion}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={4}
                      sx={{
                        backgroundColor: '#f9f9f9',
                        borderRadius: 8,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#4caf50',
                          },
                          '&:hover fieldset': {
                            borderColor: '#388e3c',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2c6e26',
                          },
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Botón de Enviar */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="success"
                  type="submit"
                  sx={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#388e3c',
                    '&:hover': { backgroundColor: '#2c6e26' },
                    fontSize: '1.2rem',
                    fontWeight: 600,
                  }}
                >
                  Registrar Producción
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default RegistroProduccion;
