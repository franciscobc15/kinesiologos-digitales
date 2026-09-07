import React, { useState, useEffect } from 'react';

const Dashboard = ({ setAdminLoggedIn, setCurrentPage }) => {
  const [respuestas, setRespuestas] = useState([
    {
      id: 1,
      nombre: "Carolina Bernal",
      email: "carolina@email.com",
      telefono: "+56 9 XXXX XXXX",
      ciudad: "San Pedro de Atacama",
      fecha: "2024-01-15",
      puntuacion: 72,
      potencial: "ALTO",
      redes: ["Instagram", "Facebook"],
      agendada: false
    },
    {
      id: 2,
      nombre: "Pablo Rodríguez",
      email: "pablo@email.com",
      telefono: "+56 9 XXXX XXXX",
      ciudad: "Santiago",
      fecha: "2024-01-14",
      puntuacion: 85,
      potencial: "MUY ALTO",
      redes: ["Instagram", "TikTok"],
      agendada: true
    }
  ]);

  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);

  const respuestasFiltradas = respuestas.filter(r => {
    const coincideTexto = r.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                         r.email.toLowerCase().includes(busqueda.toLowerCase());
    const coincideFiltro = filtro === 'todos' || 
                          (filtro === 'agendadas' && r.agendada) ||
                          (filtro === 'no-agendadas' && !r.agendada);
    return coincideTexto && coincideFiltro;
  });

  const estadisticas = {
    total: respuestas.length,
    agendadas: respuestas.filter(r => r.agendada).length,
    tasa_conversion: Math.round((respuestas.filter(r => r.agendada).length / respuestas.length) * 100),
    promedio_score: Math.round(respuestas.reduce((acc, r) => acc + r.puntuacion, 0) / respuestas.length)
  };

  const marcarAgendada = (id) => {
    setRespuestas(respuestas.map(r => 
      r.id === id ? { ...r, agendada: !r.agendada } : r
    ));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard Kinesiólogos Digitales</h1>
          <p style={{ fontSize: '14px', opacity: 0.9, marginTop: '5px' }}>
            Gestiona y analiza las respuestas de evaluación
          </p>
        </div>
        <button 
          className="btn-logout"
          onClick={() => {
            setAdminLoggedIn(false);
            setCurrentPage('formulario');
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-label">Total Evaluados</div>
          <div className="stat-value">{estadisticas.total}</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#f97316' }}>
          <div className="stat-label">Agendadas</div>
          <div className="stat-value" style={{ color: '#f97316' }}>{estadisticas.agendadas}</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#22c55e' }}>
          <div className="stat-label">Tasa de Conversión</div>
          <div className="stat-value" style={{ color: '#22c55e' }}>{estadisticas.tasa_conversion}%</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#8b5cf6' }}>
          <div className="stat-label">Score Promedio</div>
          <div className="stat-value" style={{ color: '#8b5cf6' }}>{estadisticas.promedio_score}/100</div>
        </div>
      </div>

      <div className="respuestas-tabla" style={{ marginBottom: '30px' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '10px 15px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              style={{
                padding: '10px 15px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value="todos">Todas</option>
              <option value="agendadas">Agendadas</option>
              <option value="no-agendadas">No Agendadas</option>
            </select>
          </div>
        </div>

        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Ciudad</th>
              <th>Score</th>
              <th>Potencial</th>
              <th>Fecha</th>
              <th>Agendada</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {respuestasFiltradas.map(respuesta => (
              <tr key={respuesta.id}>
                <td><strong>{respuesta.nombre}</strong></td>
                <td>{respuesta.email}</td>
                <td>{respuesta.ciudad}</td>
                <td>
                  <span className="puntuacion-badge">
                    {respuesta.puntuacion}
                  </span>
                </td>
                <td>
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    background: respuesta.puntuacion > 75 ? '#dbeafe' : '#fef3c7',
                    color: respuesta.puntuacion > 75 ? '#0c4a6e' : '#92400e',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {respuesta.potencial}
                  </span>
                </td>
                <td>{new Date(respuesta.fecha).toLocaleDateString('es-CL')}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={respuesta.agendada}
                    onChange={() => marcarAgendada(respuesta.id)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </td>
                <td>
                  <button
                    className="btn-ver-detalles"
                    onClick={() => setRespuestaSeleccionada(respuesta)}
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {respuestasFiltradas.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            <p>No se encontraron resultados</p>
          </div>
        )}
      </div>

      {respuestaSeleccionada && (
        <DetallesModal 
          respuesta={respuestaSeleccionada}
          onClose={() => setRespuestaSeleccionada(null)}
        />
      )}
    </div>
  );
};

function DetallesModal({ respuesta, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        width: '90%'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#0891b2' }}>Detalles de {respuesta.nombre}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ 
          background: '#f0f9fb',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', marginBottom: '5px' }}>
                Email
              </p>
              <p style={{ fontWeight: '600' }}>{respuesta.email}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', marginBottom: '5px' }}>
                Teléfono
              </p>
              <p style={{ fontWeight: '600' }}>{respuesta.telefono}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', marginBottom: '5px' }}>
                Ciudad
              </p>
              <p style={{ fontWeight: '600' }}>{respuesta.ciudad}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', marginBottom: '5px' }}>
                Fecha
              </p>
              <p style={{ fontWeight: '600' }}>{new Date(respuesta.fecha).toLocaleDateString('es-CL')}</p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#0891b2', marginBottom: '10px' }}>Score y Potencial</h3>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Puntuación</p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#0891b2' }}>
                {respuesta.puntuacion}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Potencial</p>
              <span style={{
                display: 'inline-block',
                padding: '8px 16px',
                background: respuesta.puntuacion > 75 ? '#dbeafe' : '#fef3c7',
                color: respuesta.puntuacion > 75 ? '#0c4a6e' : '#92400e',
                borderRadius: '8px',
                fontWeight: '600'
              }}>
                {respuesta.potencial}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ color: '#0891b2', marginBottom: '10px' }}>Redes Utilizadas</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {respuesta.redes.map((red, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  background: '#e0f2fe',
                  color: '#0c4a6e',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                {red}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: '#0891b2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
