import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Box,
  Paper,
  Divider,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter
} from '@mui/material';
import Navbar from './Navbar';


const PuntoVenta = () => {
  const [cliente, setCliente] = useState({ nombre: '', telefono: '' });
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/productos');
        setProductos(res.data);
      } catch (error) {
        setMensaje('Error al cargar productos');
        setSnackbarOpen(true);
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    // Calcula el total automáticamente cuando se actualizan productos seleccionados
    const totalVenta = productosSeleccionados.reduce(
      (acc, p) => acc + p.precio * p.cantidad,
      0
    );
    setTotal(totalVenta);
  }, [productosSeleccionados]);

  const handleCantidadChange = (id, cantidad) => {
    setProductosSeleccionados(prev =>
      prev.map(p =>
        p.producto_id === id ? { ...p, cantidad: parseInt(cantidad) } : p
      )
    );
  };

  const handleAgregarProducto = () => {
    const producto = productos.find(p => p.id === productoSeleccionado);
    if (!producto) return;

    const yaExiste = productosSeleccionados.find(p => p.producto_id === producto.id);
    if (!yaExiste) {
      setProductosSeleccionados(prev => [
        ...prev,
        {
          producto_id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: 1
        }
      ]);
    }
  };
  const handleEliminarProducto = (id) => {
    setProductosSeleccionados(prev =>
      prev.filter(p => p.producto_id !== id)
    );
  };

  const handleSubmit = async () => {
    if (!cliente.nombre.trim()) {
      setMensaje('El nombre del cliente es obligatorio');
      setSnackbarOpen(true);
      return;
    }

    if (productosSeleccionados.length === 0) {
      setMensaje('Debes seleccionar al menos un producto');
      setSnackbarOpen(true);
      return;
    }

    try {
      const venta = {
        cliente,
        productos: productosSeleccionados,
        total
      };

      await axios.post('http://localhost:3001/api/ventas', venta);

      setMensaje('Venta registrada con éxito');
      setSnackbarOpen(true);
      setCliente({ nombre: '', telefono: '' });
      setProductosSeleccionados([]);
      setTotal(0);
    } catch (error) {
      console.error('Error al registrar venta:', error);
      setMensaje('Error al registrar la venta');
      setSnackbarOpen(true);
    }
  };

  return (
   <>
     <Navbar />
    <Box sx={{ maxWidth: 'lg', margin: 'auto', padding: 3 }}>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Punto de Venta
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Formulario de Cliente */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre del Cliente"
              fullWidth
              required
              value={cliente.nombre}
              onChange={e => setCliente({ ...cliente, nombre: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              fullWidth
              value={cliente.telefono}
              onChange={e => setCliente({ ...cliente, telefono: e.target.value })}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Selección de Producto y Cantidad */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Seleccionar Producto</InputLabel>
              <Select
                value={productoSeleccionado}
                onChange={e => setProductoSeleccionado(e.target.value)}
                label="Seleccionar Producto"
              >
                {productos.map(producto => (
                  <MenuItem key={producto.id} value={producto.id}>
                    {producto.nombre} - ${producto.precio.toFixed(2)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAgregarProducto}
              sx={{ height: '100%' }}
            >
              Agregar Producto
            </Button>
          </Grid>
        </Grid>

        {/* Tabla de Productos Seleccionados */}
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Eliminar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productosSeleccionados.map(producto => (
                <TableRow key={producto.producto_id}>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>
                    <Select
                      value={producto.cantidad}
                      onChange={e => handleCantidadChange(producto.producto_id, e.target.value)}
                      sx={{ width: '80px' }}
                    >
                      {[...Array(10).keys()].map(n => (
                        <MenuItem key={n + 1} value={n + 1}>
                          {n + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>${producto.precio.toFixed(2)}</TableCell>
                  <TableCell>${(producto.precio * producto.cantidad).toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleEliminarProducto(producto.producto_id)}
                    >
                      
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} align="right">
                  <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 3 }} />

        {/* Botón de Registrar Venta */}
        <Grid container justifyContent="center" sx={{ mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Registrar Venta
          </Button>
        </Grid>

        {/* Mensaje de Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="info">
            {mensaje}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
    </>
  );
  
  
};

export default PuntoVenta;
