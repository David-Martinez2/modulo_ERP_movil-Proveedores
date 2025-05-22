import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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

const EntradasInventario = () => {
    const navigate = useNavigate();
    const [entradas, setEntradas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    useEffect(() => {
        fetchEntradas();
    }, []);

    const fetchEntradas = async () => {
        try {
            const response = await axios.get(`${API_URL}/entradas-inventario`);
            setEntradas(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar entradas de inventario:', err);
            setError('Error al cargar las entradas de inventario. Intenta recargar la página.');
            setLoading(false);
        }
    };

    const handleDeleteEntrada = async (entradaId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta entrada de inventario?')) {
            try {
                await axios.delete(`${API_URL}/entradas-inventario/${entradaId}`);
                setEntradas(entradas.filter(ent => ent.id !== entradaId));
                setDeleteSuccess(true);
                setTimeout(() => setDeleteSuccess(false), 2000);
            } catch (err) {
                console.error('Error al eliminar entrada de inventario:', err);
                setError('Error al eliminar la entrada de inventario.');
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
                <Button sx={{ mt: 2 }} onClick={() => navigate('/')} startIcon={<ArrowBackIcon />}>
                    Volver a Inicio
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
                    <Button onClick={() => navigate('/')} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </Button>
                    <Typography variant="h5" component="h1" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>
                        Gestión de Entradas de Inventario
                    </Typography>
                </Box>

                {deleteSuccess && <Alert severity="success" sx={{ mb: 2 }}>Entrada de inventario eliminada con éxito.</Alert>}

                <Button
                    component={Link}
                    to="/entradas-inventario/nuevo"
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{ mb: 3 }}
                >
                    Registrar Nueva Entrada
                </Button>

                {entradas.length === 0 ? (
                    <Alert severity="info">No hay entradas de inventario registradas.</Alert>
                ) : (
                    <List>
                        {entradas.map((entrada) => (
                            <React.Fragment key={entrada.id}>
                                <ListItem
                                    secondaryAction={
                                        <Box>
                                            <IconButton edge="end" aria-label="edit" component={Link} to={`/entradas-inventario/editar/${entrada.id}`}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteEntrada(entrada.id)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </Box>
                                    }
                                >
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6">
                                                Producto: {entrada.producto_nombre} (Cantidad: {entrada.cantidad})
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2" color="text.primary">
                                                    Fecha de Entrada: {new Date(entrada.fecha_entrada).toLocaleDateString()}
                                                </Typography>
                                                <br />
                                                <Typography component="span" variant="body2" color="text.secondary">
                                                    Proveedor: {entrada.proveedor_nombre || 'N/A'}
                                                </Typography>
                                                <br />
                                                <Typography component="span" variant="body2" color="text.secondary">
                                                    Comentarios: {entrada.comentarios || 'N/A'}
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

export default EntradasInventario;
