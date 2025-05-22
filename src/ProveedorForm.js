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
    Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const API_URL = 'http://localhost:3001/api'; // Asegúrate que esta URL sea correcta

const ProveedorForm = () => {
    const [nombre, setNombre] = useState('');
    const [contacto, setContacto] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [direccion, setDireccion] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true); // Para cargar datos al editar

    const navigate = useNavigate();
    const { id } = useParams(); // Obtiene el ID si estamos en modo edición

    const isEditing = Boolean(id); // true si hay un ID, false si es nuevo

    useEffect(() => {
        if (isEditing) {
            const fetchProveedor = async () => {
                try {
                    const response = await axios.get(`${API_URL}/proveedores/${id}`);
                    const data = response.data;
                    setNombre(data.nombre || '');
                    setContacto(data.contacto || '');
                    setTelefono(data.telefono || '');
                    setCorreo(data.correo || '');
                    setDireccion(data.direccion || '');
                    setInitialLoading(false);
                } catch (err) {
                    console.error('Error al cargar proveedor para editar:', err);
                    setSubmitError('Error al cargar la información del proveedor. Intenta recargar la página.');
                    setInitialLoading(false);
                }
            };
            fetchProveedor();
        } else {
            setInitialLoading(false); // No hay carga inicial si es un formulario nuevo
        }
    }, [id, isEditing]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmitError(null);
        setSuccess(false);

        const proveedorData = { nombre, contacto, telefono, correo, direccion };

        try {
            if (isEditing) {
                await axios.put(`${API_URL}/proveedores/${id}`, proveedorData);
                setSuccess(true);
                setTimeout(() => {
                    navigate('/proveedores'); // Regresar a la lista después de editar
                }, 1500);
            } else {
                await axios.post(`${API_URL}/proveedores`, proveedorData);
                setSuccess(true);
                // Limpiar formulario para nuevo registro
                setNombre('');
                setContacto('');
                setTelefono('');
                setCorreo('');
                setDireccion('');
                setTimeout(() => {
                    setSuccess(false); // Ocultar mensaje de éxito después de un tiempo
                }, 2000);
            }
        } catch (err) {
            console.error('Error al guardar proveedor:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setSubmitError(err.response.data.message);
            } else {
                setSubmitError('Error al guardar el proveedor. Inténtalo de nuevo.');
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
                justifyContent: 'flex-start', // Alinea arriba
                minHeight: '100vh',
                background: 'linear-gradient(to bottom right, #f5f7fa, #c3cfe2)',
                padding: 3,
            }}
        >
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, width: '100%', borderRadius: 2, mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Button onClick={() => navigate('/proveedores')} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </Button>
                    <Typography variant="h5" component="h1" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>
                        {isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                    </Typography>
                </Box>
                {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Proveedor {isEditing ? 'actualizado' : 'agregado'} con éxito!
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Nombre del Proveedor"
                        variant="outlined"
                        fullWidth
                        required
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <TextField
                        label="Persona de Contacto"
                        variant="outlined"
                        fullWidth
                        value={contacto}
                        onChange={(e) => setContacto(e.target.value)}
                    />
                    <TextField
                        label="Teléfono"
                        variant="outlined"
                        fullWidth
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                    />
                    <TextField
                        label="Correo Electrónico"
                        variant="outlined"
                        fullWidth
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                    />
                    <TextField
                        label="Dirección"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={3}
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? <CircularProgress size={24} /> : (isEditing ? 'Actualizar Proveedor' : 'Agregar Proveedor')}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default ProveedorForm;
