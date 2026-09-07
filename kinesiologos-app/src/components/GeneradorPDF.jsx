import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';

const GeneradorPDF = ({ respuestas, analisisCompleto }) => {
  const [generando, setGenerando] = useState(false);

  const descargarPDFCorto = () => {
    setGenerando(true);
    
    const elemento = document.getElementById('pdf-corto');
    const opciones = {
      margin: 10,
      filename: `Potencial_${respuestas[1]?.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opciones).from(elemento).save();
    setGenerando(false);
  };

  const agendar = () => {
    window.open('https://calendar.app.google/PTS634TGHcUi66Qz6', '_blank');
  };

  return (
    <div className="resultado-container">
      <div id="pdf-corto" style={{ padding: '40px', background: 'white' }}>
        <div className="resultado-header">
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>
            {analisisCompleto.potencialExito === 'MUY ALTO' ? '⭐⭐⭐' : '⭐⭐'}
          </div>
          <h1 className="resultado-titulo">Tu Potencial de Éxito</h1>
          <p className="resultado-descripcion" style={{ fontSize: '18px', color: '#0891b2', fontWeight: '600' }}>
            {analisisCompleto.potencialExito}
          </p>
        </div>

        <div style={{ 
          background: 'rgba(8, 145, 178, 0.1)', 
          padding: '20px', 
          borderLeft: '4px solid #0891b2',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1e293b' }}>
            {analisisCompleto.mensajePrincipal}
          </p>
        </div>

        <div style={{ textAlign: 'left', marginBottom: '30px' }}>
          <h3 style={{ color: '#0891b2', marginBottom: '15px', fontSize: '18px' }}>
            Puntos clave para tu desarrollo:
          </h3>
          <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
            {analisisCompleto.recomendaciones.map((rec, idx) => (
              <li key={idx} style={{ marginBottom: '10px' }}>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        <div className="cta-mensaje">
          <h3 style={{ color: '#0891b2', marginBottom: '10px' }}>Siguiente paso:</h3>
          <p>Si te gustaría que te pueda ayudar a lograr tu potencial, agenda una asesoría GRATUITA para analizar tu resultado completo y crear un plan personalizado.</p>
        </div>
      </div>

      <div className="resultado-acciones">
        <button 
          className="btn-descargar"
          onClick={descargarPDFCorto}
          disabled={generando}
        >
          {generando ? '⏳ Generando PDF...' : '📄 Descargar Mi Análisis'}
        </button>

        <button 
          className="btn-agendar"
          onClick={agendar}
        >
          📅 Agendar Asesoría Gratuita
        </button>

        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '15px' }}>
          Tu análisis completo será revisado en la asesoría personalizada
        </p>
      </div>
    </div>
  );
};

export default GeneradorPDF;
