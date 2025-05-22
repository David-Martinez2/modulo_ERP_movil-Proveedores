import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    CircularProgress,
    Alert,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const API_URL = 'http://localhost:3001/api';

const EstimadoForm = () => {
    const [proveedorId, setProveedorId] = useState('');
    const [productoNombre, setProductoNombre] = useState(''); // Usamos nombre por ahora
    const [fechaEstimada, setFechaEstimada] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [comentarios, setComentarios] = useState('');

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [submitError, setSubmitError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [proveedores, setProveedores] = useState([]); // Para el dropdown de proveedores
    const [productos, setProductos] = useState([]); // Para el dropdown de productos

    const navigate = useNavigate();
    const { id: estimadoId, proveedorId: urlProveedorId } = useParams(); // ID del estimado para editar, o ID del proveedor de la URL

    const isEditing = Boolean(estimadoId);

    // Cargar proveedores y productos, y datos del estimado si estamos editando
    useEffect(() => {
        const fetchFormData = async () => {
            try {
                // Obtener lista de proveedores
                const proveedoresRes = await axios.get(`${API_URL}/proveedores`);
                setProveedores(proveedoresRes.data);

                // Obtener lista de productos
                const productosRes = await axios.get(`${API_URL}/productos`); // Asume que tienes una ruta para productos
                setProductos(productosRes.data);

                if (isEditing) {
                    // Cargar datos del estimado para editar
                    const estimadoRes = await axios.get(`${API_URL}/estimados/${estimadoId}`);
                    const data = estimadoRes.data;
                    setProveedorId(data.proveedor_id || '');
                    setProductoNombre(data.producto_nombre || '');
                    // Formatear la fecha para el input date (YYYY-MM-DD)
                    setFechaEstimada(data.fecha_estimada ? new Date(data.fecha_estimada).toISOString().split('T')[0] : '');
                    setCantidad(data.cantidad || '');
                    setComentarios(data.comentarios || '');
                } else if (urlProveedorId) {
                    // Si venimos de la página de un proveedor específico, preselecciona el proveedor
                    setProveedorId(urlProveedorId);
                }
            } catch (err) {
                console.error('Error al cargar datos del formulario:', err);
                setSubmitError('Error al cargar datos necesarios. Intenta recargar la página.');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchFormData();
    }, [isEditing, estimadoId, urlProveedorId]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmitError(null);
        setSuccess(false);

        const estimadoData = {
            proveedor_id: proveedorId,
            producto_nombre: productoNombre,
            fecha_estimada: fechaEstimada,
            cantidad: parseInt(cantidad, 10), // Asegurarse que es un número
            comentarios: comentarios
        };

        try {
            if (isEditing) {
                await axios.put(`${API_URL}/estimados/${estimadoId}`, estimadoData);
                setSuccess(true);
                setTimeout(() => {
                    navigate(`/proveedores/${proveedorId}/estimados`); // Volver a la lista de estimados del proveedor
                }, 1500);
            } else {
                await axios.post(`${API_URL}/estimados`, estimadoData);
                setSuccess(true);
                // Limpiar formulario para nuevo registro
                setProveedorId(urlProveedorId || ''); // Mantener preseleccionado si venimos de un proveedor
                setProductoNombre('');
                setFechaEstimada('');
                setCantidad('');
                setComentarios('');
                setTimeout(() => {
                    setSuccess(false);
                }, 2000);
            }
        } catch (err) {
            console.error('Error al guardar estimado:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setSubmitError(err.response.data.message);
            } else {
                setSubmitError('Error al guardar el estimado de entrega. Inténtalo de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                minHeight: '100vh',
                background: 'linear-gradient(to bottom right, #f5f7fa, #c3cfe2)',
                padding: 3,
            }}
        >
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, width: '100%', borderRadius: 2, mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Button onClick={() => {
                         if (isEditing) {
                             navigate(`/proveedores/${proveedorId}/estimados`); // Volver a la lista de estimados
                         } else if (urlProveedorId) {
                             navigate(`/proveedores/${urlProveedorId}/estimados`); // Volver si viene de un proveedor
                         } else {
                             navigate('/proveedores'); // Si no hay proveedorId en URL, volver a la lista general de proveedores
                         }
                    }} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </Button>
                    <Typography variant="h5" component="h1" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>
                        {isEditing ? 'Editar Estimado de Entrega' : 'Nuevo Estimado de Entrega'}
                    </Typography>
                </Box>
                {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Estimado {isEditing ? 'actualizado' : 'agregado'} con éxito!
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl fullWidth required>
                        <InputLabel id="proveedor-label">Proveedor</InputLabel>
                        <Select
                            labelId="proveedor-label"
                            id="proveedor-select"
                            value={proveedorId}
                            label="Proveedor"
                            onChange={(e) => setProveedorId(e.target.value)}
                            disabled={isEditing || Boolean(urlProveedorId)} // Deshabilita si edita o si ya viene preseleccionado
                        >
                            {proveedores.map((prov) => (
                                <MenuItem key={prov.id} value={prov.id}>
                                    {prov.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth required>
                        <InputLabel id="producto-label">Producto</InputLabel>
                        <Select
                            labelId="producto-label"
                            id="producto-select"
                            value={productoNombre} // Usamos nombre por ahora
                            label="Producto"
                            onChange={(e) => setProductoNombre(e.target.value)}
                        >
                            {productos.map((prod) => (
                                <MenuItem key={prod.id} value={prod.nombre}>
                                    {prod.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Fecha Estimada"
                        type="date"
                        variant="outlined"
                        fullWidth
                        required
                        value={fechaEstimada}
                        onChange={(e) => setFechaEstimada(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Cantidad"
                        variant="outlined"
                        fullWidth
                        required
                        type="number"
                        inputProps={{ min: 1 }}
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                    />
                    <TextField
                        label="Comentarios"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={3}
                        value={comentarios}
                        onChange={(e) => setComentarios(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? <CircularProgress size={24} /> : (isEditing ? 'Actualizar Estimado' : 'Registrar Estimado')}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default EstimadoForm;
