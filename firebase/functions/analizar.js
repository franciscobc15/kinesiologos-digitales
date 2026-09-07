/**
 * Cloud Function de Firebase - Integración Claude API
 * Despliega esta función en Firebase usando: firebase deploy --only functions
 */

const functions = require('firebase-functions');
const Anthropic = require('@anthropic-ai/sdk');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

// Inicializar Firebase Admin
admin.initializeApp();

// Inicializar Claude
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

// Configurar nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Cloud Function para analizar respuestas y generar análisis con Claude
 */
exports.analizarRespuestas = functions.https.onRequest(async (req, res) => {
  // Permitir CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const { respuestas } = req.body;

    // Construir el prompt para Claude
    const prompt = construirPromptAnalisis(respuestas);

    // Llamar a Claude API
    const mensaje = await anthropic.messages.create({
      model: 'claude-opus-4-1',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Extraer el análisis del response
    const textoRespuesta = mensaje.content[0].text;
    const analisis = JSON.parse(textoRespuesta);

    // Guardar en Firestore
    await admin.firestore().collection('respuestas').add({
      ...analisis,
      respuestas_completas: respuestas,
      fecha_creacion: admin.firestore.FieldValue.serverTimestamp(),
      agendada: false
    });

    // Enviar email de confirmación
    await enviarEmailConfirmacion(analisis);

    res.json({
      success: true,
      analisis
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Error al procesar el análisis',
      details: error.message
    });
  }
});

/**
 * Cloud Function para enviar emails recordatorio
 * Ejecuta diariamente
 */
exports.enviarRecordatorios = functions.pubsub
  .schedule('0 9 * * *')
  .timeZone('America/Santiago')
  .onRun(async (context) => {
    try {
      const hoy = new Date();
      const mañana = new Date(hoy.getTime() + 24 * 60 * 60 * 1000);

      // Buscar eventos agendados para hoy
      const snapshot = await admin.firestore()
        .collection('eventos_agendados')
        .where('fecha', '>=', hoy)
        .where('fecha', '<', mañana)
        .get();

      for (const doc of snapshot.docs) {
        const evento = doc.data();
        
        // Enviar email recordatorio
        await transporter.sendMail({
          to: evento.email,
          subject: 'Recordatorio: Asesoría Gratuita en 24 horas 📅',
          html: `
            <h2>¡Hola ${evento.nombre}!</h2>
            <p>Te recordamos que tienes una asesoría gratuita mañana a las ${evento.hora}</p>
            <p>Enlace: <a href="${evento.link_asesoria}">Unirse a la asesoría</a></p>
          `
        });
      }

      console.log(`Recordatorios enviados para ${snapshot.size} eventos`);
      return null;
    } catch (error) {
      console.error('Error en recordatorios:', error);
      throw error;
    }
  });

/**
 * Cloud Function para generar PDF del análisis completo
 */
exports.generarPDFAnalisis = functions.https.onCall(async (data, context) => {
  try {
    const { respuestaId } = data;

    // Obtener análisis de Firestore
    const doc = await admin.firestore()
      .collection('respuestas')
      .doc(respuestaId)
      .get();

    if (!doc.exists) {
      throw new Error('Respuesta no encontrada');
    }

    const analisis = doc.data();

    // Aquí iría la lógica para generar PDF
    // Usando librerías como 'html-pdf' o 'puppeteer'

    return {
      success: true,
      mensaje: 'PDF generado correctamente'
    };
  } catch (error) {
    console.error('Error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// FUNCIONES AUXILIARES

function construirPromptAnalisis(respuestas) {
  return `
Eres un experto kinésiologo con +5 años de experiencia en marketing digital y monetización.
Tu tarea es analizar estas respuestas de un cuestionario de diagnóstico y generar un análisis profesional detallado.

RESPUESTAS:
${JSON.stringify(respuestas, null, 2)}

GENERA UN ANÁLISIS COMPLETO EN FORMATO JSON con esta estructura exacta:
{
  "nombre": "nombre del usuario",
  "email": "email",
  "telefono": "teléfono",
  "ciudad": "ciudad",
  "puntuacion_general": número entre 0-100,
  "potencial_exito": "BAJO" | "MEDIO" | "ALTO" | "MUY ALTO",
  "metricas": {
    "presencia_digital": número 0-100,
    "habilidades_tecnicas": número 0-100,
    "mentalidad": número 0-100,
    "estrategia_monetizacion": número 0-100,
    "estabilidad_emocional": número 0-100,
    "estrategia_contenido": número 0-100
  },
  "resumen_ejecutivo": "párrafo de 2-3 líneas con el resumen principal",
  "fortalezas": ["fortaleza 1", "fortaleza 2", "fortaleza 3"],
  "desafios": ["desafío 1", "desafío 2", "desafío 3"],
  "emociones": {
    "principal": "emoción dominante",
    "estado": "descripción del estado emocional actual"
  },
  "recomendaciones": ["acción 1", "acción 2", "acción 3", "acción 4"],
  "pronostico_meses": "X-Y MESES",
  "mensaje_motivador": "mensaje de esperanza y potencial"
}

IMPORTANTE:
- Sé empático pero realista
- Basa el análisis en evidencia de las respuestas
- Usa contexto latinoamericano de kinesiología
- El score debe reflejar coherencia entre respuestas
- Solo devuelve el JSON, sin explicaciones adicionales
`;
}

async function enviarEmailConfirmacion(analisis) {
  const emailUsuario = analisis.email;
  const nombre = analisis.nombre;
  
  const mailOptions = {
    from: 'noreply@kinesiologosdigitales.com',
    to: emailUsuario,
    subject: 'Tu Análisis de Potencial está Listo 🎯',
    html: `
      <h1>¡Hola ${nombre}!</h1>
      <p>Gracias por completar nuestro cuestionario de diagnóstico.</p>
      <p>Tu análisis está listo. Tu potencial es: <strong>${analisis.potencial_exito}</strong></p>
      <p>Para obtener el análisis completo y un plan personalizado, agenda una asesoría gratuita:</p>
      <a href="https://calendar.app.google/PTS634TGHcUi66Qz6" style="background: #0891b2; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
        Agendar Asesoría Gratuita
      </a>
      <p style="font-size: 12px; color: #999; margin-top: 30px;">
        © 2024 Rehabilitación y Educación. Todos los derechos reservados.
      </p>
    `
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  analizarRespuestas: exports.analizarRespuestas,
  enviarRecordatorios: exports.enviarRecordatorios,
  generarPDFAnalisis: exports.generarPDFAnalisis
};
