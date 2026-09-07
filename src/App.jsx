import React, { useState } from 'react';
import './App.css';
import Formulario from './components/Formulario';
import Dashboard from './components/Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('formulario'); // 'formulario' o 'admin'
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  return (
    <div className="app">
      {!adminLoggedIn && currentPage === 'formulario' && (
        <Formulario setCurrentPage={setCurrentPage} />
      )}
      
      {currentPage === 'admin' && !adminLoggedIn && (
        <LoginAdmin setAdminLoggedIn={setAdminLoggedIn} setCurrentPage={setCurrentPage} />
      )}
      
      {adminLoggedIn && currentPage === 'admin' && (
        <Dashboard setAdminLoggedIn={setAdminLoggedIn} setCurrentPage={setCurrentPage} />
      )}
    </div>
  );
}

function LoginAdmin({ setAdminLoggedIn, setCurrentPage }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Contraseña simple (cambiar en producción)
    if (password === 'kinetk2024') {
      setAdminLoggedIn(true);
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Dashboard Admin</h1>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Ingresar</button>
        </form>
        <button 
          className="back-btn" 
          onClick={() => setCurrentPage('formulario')}
        >
          Volver
        </button>
      </div>
    </div>
  );
}

export default App;
