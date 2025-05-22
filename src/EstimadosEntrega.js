import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Paper,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const API_URL = 'http://localhost:3001/api'; // Asegúrate que esta URL sea correcta

const EstimadosEntrega = () => {
    const { proveedorId } = useParams(); // Obtenemos el ID del proveedor de la URL
    const navigate = useNavigate();

    const [proveedor, setProveedor] = useState(null);
    const [estimados, setEstimados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener detalles del proveedor
                const proveedorRes = await axios.get(`${API_URL}/proveedores/${proveedorId}`);
                setProveedor(proveedorRes.data);

                // Obtener estimados de entrega para ese proveedor
                const estimadosRes = await axios.get(`${API_URL}/proveedores/${proveedorId}/estimados`);
                setEstimados(estimadosRes.data);
                setLoading(false);
            } catch (err) {
                console.error('Error al cargar datos:', err);
                setError('Error al cargar la información. Intenta recargar la página.');
                setLoading(false);
            }
        };

        fetchData();
    }, [proveedorId]);

    const handleDeleteEstimado = async (estimadoId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este estimado de entrega?')) {
            try {
                await axios.delete(`${API_URL}/estimados/${estimadoId}`);
                setEstimados(estimados.filter(est => est.id !== estimadoId)); // Actualiza la lista en el UI
                setDeleteSuccess(true);
                setTimeout(() => setDeleteSuccess(false), 2000); // Oculta el mensaje de éxito
            } catch (err) {
                console.error('Error al eliminar estimado:', err);
                setError('Error al eliminar el estimado de entrega.');
            }
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Alert severity="error">{error}</Alert>
                <Button sx={{ mt: 2 }} onClick={() => navigate('/proveedores')} startIcon={<ArrowBackIcon />}>
                    Volver a Proveedores
                </Button>
            </Box>
        );
    }

    if (!proveedor) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Alert severity="warning">Proveedor no encontrado.</Alert>
                <Button sx={{ mt: 2 }} onClick={() => navigate('/proveedores')} startIcon={<ArrowBackIcon />}>
                    Volver a Proveedores
                </Button>
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
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 800, width: '100%', borderRadius: 2, mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Button onClick={() => navigate('/proveedores')} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </Button>
                    <Typography variant="h5" component="h1" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>
                        Estimados de Entrega para {proveedor.nombre}
                    </Typography>
                </Box>

                {deleteSuccess && <Alert severity="success" sx={{ mb: 2 }}>Estimado eliminado con éxito.</Alert>}

                <Button
                    component={Link}
                    to={`/estimados/nuevo/${proveedorId}`} 
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{ mb: 3 }}
                >
                    Registrar Nuevo Estimado
                </Button>

                {estimados.length === 0 ? (
                    <Alert severity="info">No hay estimados de entrega registrados para este proveedor.</Alert>
                ) : (
                    <List>
                        {estimados.map((estimado) => (
                            <React.Fragment key={estimado.id}>
                                <ListItem
                                    secondaryAction={
                                        <Box>
                                            <IconButton edge="end" aria-label="edit" component={Link} to={`/estimados/editar/${estimado.id}`}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteEstimado(estimado.id)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </Box>
                                    }
                                >
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6">
                                                Producto: {estimado.producto_nombre} (Cantidad: {estimado.cantidad})
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2" color="text.primary">
                                                    Fecha Estimada: {new Date(estimado.fecha_estimada).toLocaleDateString()}
                                                </Typography>
                                                <br />
                                                <Typography component="span" variant="body2" color="text.secondary">
                                                    Comentarios: {estimado.comentarios || 'N/A'}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </Paper>
        </Box>
    );
};

export default EstimadosEntrega;
