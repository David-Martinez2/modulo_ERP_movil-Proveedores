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

const EntradaForm = () => {
    const [proveedorId, setProveedorId] = useState('');
    const [productoNombre, setProductoNombre] = useState(''); // Usamos nombre por ahora
    const [cantidad, setCantidad] = useState('');
    const [fechaEntrada, setFechaEntrada] = useState(new Date().toISOString().split('T')[0]); // Fecha actual por defecto
    const [comentarios, setComentarios] = useState('');

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [submitError, setSubmitError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [proveedores, setProveedores] = useState([]);
    const [productos, setProductos] = useState([]);

    const navigate = useNavigate();
    const { id: entradaId } = useParams(); // ID de la entrada para editar

    const isEditing = Boolean(entradaId);

    useEffect(() => {
        const fetchFormData = async () => {
            try { 
                // Obtener lista de proveedores
                const proveedoresRes = await axios.get(`${API_URL}/proveedores`);
                setProveedores(proveedoresRes.data);

                // Obtener lista de productos
                const productosRes = await axios.get(`${API_URL}/productos`);
                setProductos(productosRes.data);

                if (isEditing) {
                    // Cargar datos de la entrada para editar
                    const entradaRes = await axios.get(`${API_URL}/entradas-inventario/${entradaId}`);
                    const data = entradaRes.data;
                    setProveedorId(data.proveedor_id || '');
                    setProductoNombre(data.producto_nombre || '');
                    setCantidad(data.cantidad || '');
                    setFechaEntrada(data.fecha_entrada ? new Date(data.fecha_entrada).toISOString().split('T')[0] : '');
                    setComentarios(data.comentarios || '');
                }
            } catch (err) {
                console.error('Error al cargar datos del formulario:', err);
                setSubmitError('Error al cargar datos necesarios. Intenta recargar la página.');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchFormData();
    }, [isEditing, entradaId]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmitError(null);
        setSuccess(false);

        const entradaData = {
            proveedor_id: proveedorId || null, // Puede ser nulo si no se selecciona
            producto_nombre: productoNombre,
            cantidad: parseInt(cantidad, 10),
            fecha_entrada: fechaEntrada,
            comentarios: comentarios
        };

        try {
            if (isEditing) {
                await axios.put(`${API_URL}/entradas-inventario/${entradaId}`, entradaData);
                setSuccess(true);
                setTimeout(() => {
                    navigate('/entradas-inventario'); // Regresar a la lista de entradas
                }, 1500);
            } else {
                await axios.post(`${API_URL}/entradas-inventario`, entradaData);
                setSuccess(true);
                // Limpiar formulario para nuevo registro
                setProveedorId('');
                setProductoNombre('');
                setCantidad('');
                setFechaEntrada(new Date().toISOString().split('T')[0]);
                setComentarios('');
                setTimeout(() => {
                    setSuccess(false);
                }, 2000);
            }
        } catch (err) {
            console.error('Error al guardar entrada de inventario:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setSubmitError(err.response.data.message);
            } else {
                setSubmitError('Error al guardar la entrada de inventario. Inténtalo de nuevo.');
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
                    <Button onClick={() => navigate('/entradas-inventario')} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </Button>
                    <Typography variant="h5" component="h1" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>
                        {isEditing ? 'Editar Entrada de Inventario' : 'Registrar Entrada de Inventario'}
                    </Typography>
                </Box>
                {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Entrada {isEditing ? 'actualizada' : 'registrada'} con éxito!
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="proveedor-label">Proveedor (Opcional)</InputLabel>
                        <Select
                            labelId="proveedor-label"
                            id="proveedor-select"
                            value={proveedorId}
                            label="Proveedor (Opcional)"
                            onChange={(e) => setProveedorId(e.target.value)}
                        >
                            <MenuItem value=""><em>Ninguno</em></MenuItem>
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
                            value={productoNombre}
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
                        label="Fecha de Entrada"
                        type="date"
                        variant="outlined"
                        fullWidth
                        required
                        value={fechaEntrada}
                        onChange={(e) => setFechaEntrada(e.target.value)}
                        InputLabelProps={{ shrink: true }}
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
                        {loading ? <CircularProgress size={24} /> : (isEditing ? 'Actualizar Entrada' : 'Registrar Entrada')}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default EntradaForm;
