import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Asegúrate de tener un archivo CSS para estilos adicionales.

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Verifica si ya hay un token en localStorage y redirige si ya está logueado
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token en localStorage:', token); // Verifica que el token exista
    if (token) {
      navigate('/'); // Si el token existe, redirige al home
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log('Intentando iniciar sesión con:', { username, password }); // Verifica qué se está enviando

    try {
      // Enviar solicitud POST al backend para hacer login
      const response = await axios.post('http://localhost:3001/api/login', {
        username,
        password
      });

      console.log('Respuesta del servidor:', response); // Verifica la respuesta del backend

      // Guardar el token recibido en localStorage
      localStorage.setItem('token', response.data.token);

      // Redirigir al Home (o página principal)
      navigate('/');
    } catch (err) {
      console.error('Error al hacer login:', err.response ? err.response.data : err.message);
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Entrar</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
