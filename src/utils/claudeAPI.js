/**
 * Integración con Claude API para generar análisis profesional
 * Este archivo será usado por una Cloud Function de Firebase
 */

export const generarAnalisisConClaude = async (respuestas) => {
  /**
   * Las respuestas vienen del formulario en este formato:
   * {
   *   1: "Nombre",
   *   2: "email@mail.com",
   *   3: "teléfono",
   *   4: "ciudad",
   *   5: "descripción profesional",
   *   6: "etapa profesional",
   *   ... etc
   * }
   */

  const prompt = construirPrompt(respuestas);

  try {
    const response = await fetch('/api/analizar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        respuestas,
        prompt
      })
    });

    const datos = await response.json();
    return datos;
  } catch (error) {
    console.error('Error al generar análisis:', error);
    throw error;
  }
};

const construirPrompt = (respuestas) => {
  return `
Eres un experto en marketing digital para kinesiólogos con +5 años de experiencia. 
Basándote en las respuestas de este cuestionario, debes generar un análisis profesional completo.

RESPUESTAS DEL CUESTIONARIO:
${formatearRespuestas(respuestas)}

DEBES GENERAR UN ANÁLISIS JSON con la siguiente estructura:
{
  "nombre": "nombre del usuario",
  "email": "email",
  "ciudad": "ciudad",
  "telefono": "teléfono",
  "fecha": "fecha actual",
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
  "fortalezas": [3-5 fortalezas identificadas],
  "desafios_principales": [3-5 desafíos principales],
  "analisis_emocional": {
    "emociones_principales": ["emoción 1", "emoción 2"],
    "puntuaciones_emocionales": {
      "frustración": 0-10,
      "ansiedad": 0-10,
      "miedo": 0-10,
      "esperanza": 0-10,
      "motivación": 0-10
    },
    "resumen": "resumen del estado emocional actual"
  },
  "barreras_identificadas": [
    {
      "barrera": "nombre de la barrera",
      "impacto": "CRÍTICO (5/5)" | "ALTO (4/5)" | "MEDIO (3/5)" | "BAJO (2/5)",
      "descripcion": "descripción detallada"
    }
  ],
  "recursos_disponibles": {
    "equipo_tecnico": ["recurso 1", "recurso 2"],
    "espacio_grabacion": "descripción",
    "iluminacion": "descripción"
  },
  "nivel_actual_vs_objetivo": {
    "produccion_video": { "actual": 1, "objetivo_90_dias": 4 },
    "edicion": { "actual": 2, "objetivo_90_dias": 4 },
    "estrategia_contenido": { "actual": 1, "objetivo_90_dias": 4 },
    "conocimiento_algoritmos": { "actual": 1, "objetivo_90_dias": 3 },
    "exposicion_camara": { "actual": 1, "objetivo_90_dias": 4 },
    "seguridad_para_vender": { "actual": 1, "objetivo_90_dias": 4 }
  },
  "recomendaciones_inmediatas": [4-5 acciones prioritarias ordenadas],
  "pronostico_profesional": {
    "timeframe": "X-Y MESES",
    "objetivo": "descripción del objetivo a lograr",
    "descripcion": "descripción del pronóstico"
  },
  "mensaje_principal": "mensaje motivador principal basado en el análisis"
}

IMPORTANTE:
- Sé empático y motivador pero realista
- Identifica las barreras verdaderas, no minimices
- Las recomendaciones deben ser accionables y específicas
- El análisis debe reflejar el contexto latinoamericano de un kinesiólogo
- Pondera el estado emocional con peso significativo
`;
};

const formatearRespuestas = (respuestas) => {
  let texto = '';
  const preguntas = {
    1: 'Nombre y Apellido',
    2: 'Email',
    3: 'Teléfono',
    4: 'Ciudad',
    5: 'Dedicación y Formaciones',
    6: 'Etapa profesional',
    7: 'Situación laboral',
    8: 'Productos/servicios',
    9: 'Objetivos con redes',
    10: 'Redes sociales que usa',
    11: 'Frecuencia actual',
    12: 'Última publicación',
    13: 'Tiempo invertido',
    14: 'Frecuencia deseada',
    15: 'Equipo disponible',
    16: 'Nivel de edición',
    17: 'Contenido difícil',
    18: 'Iluminación/espacio',
    19: 'Disposición video',
    20: 'Seguridad frente a cámara',
    21: 'Valor del conocimiento',
    22: 'Pensamientos limitantes',
    23: 'Emociones actuales',
    24: 'Orden de frenos',
    25: 'Público objetivo',
    26: 'Conocimiento algoritmos',
    27: 'Análisis estadísticas',
    28: 'Motivaciones',
    29: 'Plan de contenido',
    30: 'Comunicación oferta',
    31: 'Interés en ayuda',
    32: 'Tipo de acompañamiento'
  };

  for (let i = 1; i <= 32; i++) {
    const respuesta = respuestas[i];
    if (respuesta) {
      texto += `\n${i}. ${preguntas[i]}: ${JSON.stringify(respuesta)}`;
    }
  }

  return texto;
};

export default generarAnalisisConClaude;
