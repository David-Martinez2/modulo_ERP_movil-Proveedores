import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import LineaProduccion from './LineaProduccion';
import PuntoVenta from './PuntoVenta';
import Login from './Login';
import RegistroProduccion from './RegistroProduccion';
import ReportarFallas from './ReportarFallas'; // IMPORTANTE: Importa el componente de ReportarFallas
import ProtectedRoute from './ProtectedRoute'; // Importar el componente de rutas protegidas
import Proveedores from './Proveedores';
import ProveedorForm from './ProveedorForm'; 
import EstimadosEntrega from './EstimadosEntrega';
import EstimadoForm from './EstimadoForm';
import EntradasInventario from './EntradasInventario';
import EntradaForm from './EntradaForm'; 

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
        <Route path="/proveedores" element=
          {<ProtectedRoute>
          <Proveedores />
          </ProtectedRoute>} 
          />
          
          <Route path="/proveedores" element={<ProtectedRoute><Proveedores /></ProtectedRoute>} />
    <Route path="/proveedores/nuevo" element={<ProtectedRoute><ProveedorForm /></ProtectedRoute>} /> 
    <Route path="/proveedores/editar/:id" element={<ProtectedRoute><ProveedorForm /></ProtectedRoute>} /> 
    
    <Route path="/proveedores/:proveedorId/estimados" element={<ProtectedRoute><EstimadosEntrega /></ProtectedRoute>} />
    <Route path="/estimados/nuevo/:proveedorId?" element={<ProtectedRoute><EstimadoForm /></ProtectedRoute>} /> 
    <Route path="/estimados/editar/:id" element={<ProtectedRoute><EstimadoForm /></ProtectedRoute>} />
    
     <Route path="/entradas-inventario" element={<ProtectedRoute><EntradasInventario /></ProtectedRoute>} />
    <Route path="/entradas-inventario/nuevo" element={<ProtectedRoute><EntradaForm /></ProtectedRoute>} />
    <Route path="/entradas-inventario/editar/:id" element={<ProtectedRoute><EntradaForm /></ProtectedRoute>} />
        
      </Routes>
    </Router>
  );
}

export default App;
