import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Importa useNavigate aquí
import './Proveedores.css'; // Mantenemos tu CSS si aún lo usas para estilos específicos

import { // Importa todos los componentes de Material-UI en un solo bloque
    Box,
    Typography,
    Button,
    Paper,
    CircularProgress, // Para el loading
    Alert,            // Para el error
    List,             // Para la lista de proveedores si quieres usarla
    ListItem,
    ListItemText,
    IconButton,       // Para los iconos de editar/eliminar
    Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // El icono de flecha
import EditIcon from '@mui/icons-material/Edit';     // Icono para editar
import DeleteIcon from '@mui/icons-material/Delete'; // Icono para eliminar
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Icono para añadir nuevo

// Asegúrate que esta URL sea la correcta para tu backend
const API_URL = 'http://localhost:3001/api';

const Proveedores = () => {
    const navigate = useNavigate();
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProveedores();
    }, []);

    const fetchProveedores = async () => {
        try {
            const response = await axios.get(`${API_URL}/proveedores`);
            setProveedores(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error al obtener proveedores:', err);
            setError('Error al cargar los proveedores. Intenta recargar la página.');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este proveedor? Esto también eliminará sus estimados de entrega asociados.')) {
            try {
                await axios.delete(`${API_URL}/proveedores/${id}`); // Usa API_URL
                fetchProveedores();
            } catch (err) {
                console.error('Error al eliminar proveedor:', err);
                setError('Error al eliminar el proveedor. Verifica que no tenga entradas de inventario asociadas.');
            }
        }
    };

    // --- Renderizado Condicional con Material-UI ---
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
                <Button sx={{ mt: 2 }} onClick={() => navigate('/')} startIcon={<ArrowBackIcon />}>
                    Volver al Menú Principal
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
                    {/* Botón para volver al menú principal */}
                    <Button onClick={() => navigate('/')} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </Button>
                    <Typography variant="h5" component="h1" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>
                        Gestión de Proveedores
                    </Typography>
                </Box>

                {/* Botón para agregar un nuevo proveedor */}
                <Button
                    component={Link}
                    to="/proveedores/nuevo"
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{ mb: 3 }}
                >
                    Registrar Nuevo Proveedor
                </Button>

                {proveedores.length === 0 ? (
                    <Alert severity="info">No hay proveedores registrados. <Link to="/proveedores/nuevo">¡Agrega uno!</Link></Alert>
                ) : (
                    <List sx={{ width: '100%' }}> {/* Usamos List de MUI */}
                        {proveedores.map(proveedor => (
                            <React.Fragment key={proveedor.id}>
                                <ListItem
                                    secondaryAction={ // Acciones a la derecha del ListItem
                                        <Box>
                                            <IconButton edge="end" aria-label="edit" component={Link} to={`/proveedores/editar/${proveedor.id}`}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(proveedor.id)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                            <IconButton edge="end" aria-label="view-estimados" component={Link} to={`/proveedores/${proveedor.id}/estimados`}>
                                                {/* Puedes usar un icono para "ver" o "lista", por ejemplo ListAltIcon o VisibilityIcon */}
                                                Ver Estimados
                                            </IconButton>
                                        </Box>
                                    }
                                >
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6">
                                                {proveedor.nombre}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2" color="text.primary">
                                                    Contacto: {proveedor.contacto || 'N/A'}
                                                </Typography>
                                                <br />
                                                <Typography component="span" variant="body2" color="text.secondary">
                                                    Teléfono: {proveedor.telefono || 'N/A'}
                                                </Typography>
                                                <br />
                                                <Typography component="span" variant="body2" color="text.secondary">
                                                    Correo: {proveedor.correo || 'N/A'}
                                                </Typography>
                                                <br />
                                                <Typography component="span" variant="body2" color="text.secondary">
                                                    Dirección: {proveedor.direccion || 'N/A'}
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

export default Proveedores;
