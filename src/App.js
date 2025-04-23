import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import LineaProduccion from './LineaProduccion';
import PuntoVenta from './PuntoVenta';
import Login from './Login';
import RegistroProduccion from './RegistroProduccion'; // Asegúrate de importar este componente
import ReportarFallas from './ReportarFallas'; // IMPORTANTE: Importa el componente de ReportarFallas
import ProtectedRoute from './ProtectedRoute'; // Importar el componente de rutas protegidas

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública de login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas */}
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/linea-produccion" element={
          <ProtectedRoute>
            <LineaProduccion />
          </ProtectedRoute>
        } />
        <Route path="/punto-venta" element={
          <ProtectedRoute>
            <PuntoVenta />
          </ProtectedRoute>
        } />
        <Route path="/registro-produccion" element={
          <ProtectedRoute>
            <RegistroProduccion />
          </ProtectedRoute>
        } />
        <Route path="/reportar-fallas" element={
          <ProtectedRoute>
            <ReportarFallas />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
