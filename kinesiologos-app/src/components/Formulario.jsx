import React, { useState } from 'react';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import GeneradorPDF from './GeneradorPDF';
import Logo from '../assets/logo.png';

// Inicializar Supabase
const supabaseUrl = 'https://gqaaucryqhilburlwoxl.supabase.co';
const supabaseKey = 'sb_publ1shable_56o7ssuhT7pd5dp87d970_wH6dc';
const supabase = createClient(supabaseUrl, supabaseKey);

const Formulario = ({ setCurrentPage }) => {
  const [paginaActual, setPaginaActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [cargando, setCargando] = useState(false);
  const [analisisCompleto, setAnalisisCompleto] = useState(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const preguntas = [
    {
      id: 1,
      titulo: "Nombre y Apellido",
      tipo: "texto",
      placeholder: "Tu nombre completo"
    },
    {
      id: 2,
      titulo: "Email",
      tipo: "email",
      placeholder: "tu@email.com"
    },
    {
      id: 3,
      titulo: "Teléfono",
      tipo: "telefono",
      placeholder: "+56 9 XXXX XXXX"
    },
    {
      id: 4,
      titulo: "Ciudad",
      tipo: "texto",
      placeholder: "Tu ciudad"
    },
    {
      id: 5,
      titulo: "¿A qué te dedicas actualmente y qué formaciones has tomado?",
      tipo: "textarea",
      placeholder: "Ej: Kinesiólogo en consulta privada, especialista en deportiva. Formaciones: Pilates clínico, Masaje deportivo..."
    },
    {
      id: 6,
      titulo: "¿En qué etapa profesional estás?",
      tipo: "radio",
      opciones: [
        "Estoy estudiando",
        "Recién egresado/a sin trabajo",
        "Trabajando como empleado",
        "Consulta propia",
        "Combinado (empleado + consulta propia)",
        "No estoy ejerciendo la profesión"
      ]
    },
    {
      id: 7,
      titulo: "¿Cuál es tu situación laboral actual?",
      tipo: "radio",
      opciones: [
        "Trabajo estable y bien remunerado",
        "Trabajo estable pero mal remunerado",
        "Trabajo inestable (a punto de terminar)",
        "Sin trabajo, necesito ingresos urgentes"
      ]
    },
    {
      id: 8,
      titulo: "¿Tienes actualmente algún producto o servicio que ofreces?",
      tipo: "radio",
      opciones: [
        "Sí, consulta presencial activa",
        "Sí, sesiones online establecidas",
        "Ambas (presencial + online)",
        "Ideas sin desarrollar aún",
        "No tengo oferta estructurada"
      ]
    },
    {
      id: 9,
      titulo: "¿Cuál es tu principal objetivo con las redes sociales?",
      tipo: "checkbox",
      opciones: [
        "Atraer pacientes a mi consulta",
        "Vender cursos o formaciones",
        "Crear marca personal",
        "Posicionarme como experto",
        "Generar ingresos pasivos",
        "Otro"
      ]
    },
    {
      id: 10,
      titulo: "¿Qué redes sociales utilizas?",
      tipo: "checkbox",
      opciones: ["Instagram", "TikTok", "Facebook", "YouTube", "LinkedIn", "Ninguna"]
    },
    {
      id: 11,
      titulo: "¿Con qué frecuencia publicas contenido actualmente?",
      tipo: "radio",
      opciones: ["Diariamente", "3-5 veces por semana", "1-2 veces por semana", "Menos de 1 vez por semana", "Casi nunca"]
    },
    {
      id: 12,
      titulo: "¿Cuándo fue la última vez que hiciste una publicación con intención de educar o atraer clientes?",
      tipo: "radio",
      opciones: ["Esta semana", "Hace 1-2 semanas", "Hace 1 mes", "Hace más de 1 mes", "Nunca"]
    },
    {
      id: 13,
      titulo: "¿Cuánto tiempo inviertes semanalmente en crear contenido para redes?",
      tipo: "radio",
      opciones: ["Menos de 2 horas", "2-5 horas", "5-10 horas", "Más de 10 horas", "No dedico tiempo actualmente"]
    },
    {
      id: 14,
      titulo: "¿Con qué frecuencia TE GUSTARÍA publicar?",
      tipo: "radio",
      opciones: ["Diariamente", "3-5 veces por semana", "1-2 veces por semana", "Menos de 1 vez por semana", "No sé / sin preferencia"]
    },
    {
      id: 15,
      titulo: "¿Qué equipo tienes disponible para grabar?",
      tipo: "checkbox",
      opciones: ["Celular", "Trípode", "Micrófono externo", "Cámara", "Aro de luz", "Otro equipo", "No tengo idea qué equipo necesito"]
    },
    {
      id: 16,
      titulo: "¿Qué nivel de conocimiento tienes sobre edición de video?",
      tipo: "radio",
      opciones: ["Nada, no sé editar", "Básico (corto, pego, texto)", "Intermedio (puedo editar reels profesionales)", "Avanzado (manejo múltiples softwares)"]
    },
    {
      id: 17,
      titulo: "¿Qué tipo de contenido te cuesta más crear?",
      tipo: "checkbox",
      opciones: ["Grabar video (no sé cómo hacerlo)", "Editar videos", "Generar ideas de contenido", "Exponerme frente a cámara", "Manejar los algoritmos"]
    },
    {
      id: 18,
      titulo: "¿Cómo describirías tu iluminación / espacio para grabar?",
      tipo: "radio",
      opciones: ["Tengo un espacio definido con buena luz natural", "Tengo luz natural pero sin espacio fijo", "Tengo equipo de iluminación profesional", "Grabo donde puedo, luz variable", "No tengo idea de iluminación"]
    },
    {
      id: 19,
      titulo: "¿Te animas a aparecer en video/reels/lives?",
      tipo: "radio",
      opciones: ["Totalmente, me encanta grabar", "Sí, pero con algo de dificultad", "Me cuesta, pero quiero intentarlo", "Casi no, me avergüenza exponerme", "No, me da demasiado miedo"]
    },
    {
      id: 20,
      titulo: "¿Cómo te sientes al hablar frente a cámara?",
      tipo: "radio",
      opciones: ["Cómodo/a, es natural para mí", "Un poco inseguro/a pero intento", "Muy inseguro/a, me veo raro", "No lo he intentado", "Me parece imposible"]
    },
    {
      id: 21,
      titulo: "¿Sientes que tu conocimiento tiene valor que otros podrían pagar?",
      tipo: "radio",
      opciones: ["Totalmente, tengo certeza", "Sí, en parte", "No estoy muy seguro/a", "No, creo que nadie pagaría"]
    },
    {
      id: 22,
      titulo: "¿Cuál es el pensamiento que más aparece cuando piensas en monetizar?",
      tipo: "checkbox",
      opciones: [
        "Nadie paga por lo que hago",
        "Necesito muchos seguidores para vender",
        "No soy lo suficientemente experto/a",
        "Me da miedo que otros colegas me critiquen",
        "No sé cómo comunicarlo sin sonar vendedor/a",
        "Tengo ideas pero no sé por dónde empezar",
        "Ninguno, me siento seguro/a"
      ]
    },
    {
      id: 23,
      titulo: "¿Qué emociones te dominan actualmente respecto a tu profesión?",
      tipo: "checkbox",
      opciones: [
        "Frustración (no valorizan mi trabajo)",
        "Ansiedad (presión sobre resultados)",
        "Desmotivación (cansancio de no avanzar)",
        "Miedo (a exponerme, al qué dirán)",
        "Esperanza (creo que puedo mejorar)",
        "Satisfacción (me encanta lo que hago)",
        "Confianza (sé que puedo lograrlo)",
        "Cansancio (físico y mental)"
      ]
    },
    {
      id: 24,
      titulo: "Ordena qué te frena PRINCIPALMENTE (1=mayor freno)",
      tipo: "ranking",
      opciones: [
        "Miedo al qué dirán / juicio de colegas",
        "No sé cómo empezar / falta de dirección",
        "Falta de tiempo / cansancio",
        "Inseguridad técnica / miedo al fracaso"
      ]
    },
    {
      id: 25,
      titulo: "¿Sabes a quién quieres ayudar específicamente?",
      tipo: "radio",
      opciones: ["Totalmente, tengo claro mi público", "Tengo una idea vaga", "Apenas estoy explorando", "No, no sé a quién dirigirme"]
    },
    {
      id: 26,
      titulo: "¿Conoces cómo funcionan los algoritmos de redes sociales?",
      tipo: "radio",
      opciones: ["Sí, los entiendo bien", "Básicamente, tengo noción", "No, pero me interesa aprender", "No tengo idea"]
    },
    {
      id: 27,
      titulo: "¿Miras las estadísticas de tus publicaciones?",
      tipo: "radio",
      opciones: ["Regularmente, analizo qué funciona", "A veces, sin estrategia clara", "Casi nunca", "No sé cómo verlas"]
    },
    {
      id: 28,
      titulo: "¿Cuál es tu mayor creencia limitante?",
      tipo: "checkbox",
      opciones: [
        "No soy lo suficientemente inteligente",
        "No tengo suficiente experiencia",
        "No soy lo suficientemente bonito/a",
        "Otros lo hacen mejor que yo",
        "Soy muy viejo/a para empezar",
        "No tengo suficiente dinero",
        "No tengo suficiente tiempo",
        "Ninguna, me siento capaz"
      ]
    },
    {
      id: 29,
      titulo: "¿Cuánto tiempo semanal puedes dedicar a redes sociales?",
      tipo: "radio",
      opciones: ["Menos de 1 hora", "1-3 horas", "3-5 horas", "5-10 horas", "Más de 10 horas"]
    },
    {
      id: 30,
      titulo: "¿Tienes claridad sobre a quién quieres llegar?",
      tipo: "radio",
      opciones: ["No tengo claridad", "Tengo poca claridad", "Tengo claridad moderada", "Tengo bastante claridad", "Tengo total claridad"]
    },
    {
      id: 31,
      titulo: "¿Te gustaría recibir ayuda para mejorar tu presencia en redes?",
      tipo: "radio",
      opciones: ["No", "Sí, estoy interesado", "Sí, muy interesado"]
    },
    {
      id: 32,
      titulo: "¿Cuál es tu principal desafío ahora mismo en redes sociales?",
      tipo: "textarea",
      placeholder: "Cuéntame cuál es tu principal bloqueo..."
    }
  ];

  const handleChange = (id, valor) => {
    setRespuestas({
      ...respuestas,
      [id]: valor
    });
  };

  const handleCheckboxChange = (id, opcion) => {
    const actuales = respuestas[id] || [];
    if (actuales.includes(opcion)) {
      setRespuestas({
        ...respuestas,
        [id]: actuales.filter(o => o !== opcion)
      });
    } else {
      setRespuestas({
        ...respuestas,
        [id]: [...actuales, opcion]
      });
    }
  };

  const puedeAvanzar = () => {
    const pregunta = preguntas[paginaActual];
    const respuesta = respuestas[pregunta.id];
    
    if (pregunta.tipo === 'checkbox') {
      return Array.isArray(respuesta) && respuesta.length > 0;
    } else if (pregunta.tipo === 'ranking') {
      return Array.isArray(respuesta) && respuesta.length === pregunta.opciones.length;
    } else {
      return respuesta && respuesta.toString().trim() !== '';
    }
  };

  const enviarRespuestas = async () => {
    setCargando(true);
    try {
      const respuestasFormato = {
        ...respuestas,
        timestamp: new Date().toISOString()
      };

      // GUARDAR EN SUPABASE
      const { data, error } = await supabase
        .from('respuestas')
        .insert([
          {
            nombre: respuestas[1] || '',
            email: respuestas[2] || '',
            telefono: respuestas[3] || '',
            ciudad: respuestas[4] || '',
            respuestas_json: respuestasFormato
          }
        ]);

      if (error) {
        console.error('Error Supabase:', error);
      } else {
        console.log('Datos guardados en Supabase:', data);
      }

      // ENVIAR A FORMSPREE
      await fetch('https://formspree.io/f/mkjnqken', {
        method: 'POST',
        body: JSON.stringify(respuestasFormato),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Generar análisis
      const analisis = await generarAnalisisConClaude(respuestasFormato);
      setAnalisisCompleto(analisis);
      setMostrarResultado(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al procesar tus respuestas');
    } finally {
      setCargando(false);
    }
  };

  const generarAnalisisConClaude = async (respuestas) => {
    const score = Math.floor(Math.random() * 40 + 60);
    
    return {
      score,
      nombre: respuestas[1] || "Usuario",
      email: respuestas[2] || "",
      telefono: respuestas[3] || "",
      potencialExito: score > 75 ? "MUY ALTO" : score > 60 ? "ALTO" : "MEDIO",
      mensajePrincipal: `Tienes un potencial ${score > 75 ? "EXCELENTE" : "MUY BUENO"} para desarrollar tu marca personal en redes sociales.`,
      recomendaciones: [
        "Enfócate primero en desbloquear tus creencias limitantes",
        "Crea un plan de contenido semanal simple",
        "Comienza con una sola plataforma (recomendamos Instagram)",
        "Establece un espacio fijo y luz adecuada para grabar"
      ]
    };
  };

  if (mostrarResultado) {
    return <GeneradorPDF respuestas={respuestas} analisisCompleto={analisisCompleto} />;
  }

  const pregunta = preguntas[paginaActual];
  if (!pregunta) return null;

  return (
    <div className="formulario-container">
      <div className="formulario-header">
        <div className="logo-container">
          <img src={Logo} alt="Rehabilitación y Educación" />
        </div>
        <h1>Kinesiólogos Digitales</h1>
        <p>Descubre tu potencial en redes sociales</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(paginaActual / preguntas.length) * 100}%` }}></div>
        </div>
        <p style={{ fontSize: '12px', marginTop: '10px', opacity: 0.9 }}>
          Pregunta {paginaActual + 1} de {preguntas.length}
        </p>
      </div>

      <div className="formulario-body">
        <div className="pregunta-grupo">
          <div className="pregunta-numero">Pregunta {paginaActual + 1}</div>
          <div className="pregunta-titulo">{pregunta.titulo}</div>

          {pregunta.tipo === 'texto' && (
            <input
              type="text"
              placeholder={pregunta.placeholder}
              value={respuestas[pregunta.id] || ''}
              onChange={(e) => handleChange(pregunta.id, e.target.value)}
              style={{ width: '100%', padding: '12px 15px', border: '2px solid #cbd5e1', borderRadius: '8px', fontSize: '16px' }}
            />
          )}

          {pregunta.tipo === 'email' && (
            <input
              type="email"
              placeholder={pregunta.placeholder}
              value={respuestas[pregunta.id] || ''}
              onChange={(e) => handleChange(pregunta.id, e.target.value)}
              style={{ width: '100%', padding: '12px 15px', border: '2px solid #cbd5e1', borderRadius: '8px', fontSize: '16px' }}
            />
          )}

          {pregunta.tipo === 'telefono' && (
            <input
              type="tel"
              placeholder={pregunta.placeholder}
              value={respuestas[pregunta.id] || ''}
              onChange={(e) => handleChange(pregunta.id, e.target.value)}
              style={{ width: '100%', padding: '12px 15px', border: '2px solid #cbd5e1', borderRadius: '8px', fontSize: '16px' }}
            />
          )}

          {pregunta.tipo === 'textarea' && (
            <>
              <textarea
                placeholder={pregunta.placeholder}
                value={respuestas[pregunta.id] || ''}
                onChange={(e) => handleChange(pregunta.id, e.target.value)}
                maxLength={200}
              />
              <div className="contador-caracteres">
                {respuestas[pregunta.id]?.length || 0} / 200 caracteres
              </div>
            </>
          )}

          {pregunta.tipo === 'radio' && (
            <div className="opciones">
              {pregunta.opciones.map((opcion, idx) => (
                <label key={idx} className={`opcion ${respuestas[pregunta.id] === opcion ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name={`pregunta-${pregunta.id}`}
                    value={opcion}
                    checked={respuestas[pregunta.id] === opcion}
                    onChange={(e) => handleChange(pregunta.id, e.target.value)}
                  />
                  <label>{opcion}</label>
                </label>
              ))}
            </div>
          )}

          {pregunta.tipo === 'checkbox' && (
            <div className="opciones">
              {pregunta.opciones.map((opcion, idx) => (
                <label key={idx} className={`opcion ${(respuestas[pregunta.id] || []).includes(opcion) ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    checked={(respuestas[pregunta.id] || []).includes(opcion)}
                    onChange={() => handleCheckboxChange(pregunta.id, opcion)}
                  />
                  <label>{opcion}</label>
                </label>
              ))}
            </div>
          )}

          {pregunta.tipo === 'ranking' && (
            <div className="opciones">
              {pregunta.opciones.map((opcion, idx) => (
                <div key={idx} className="opcion">
                  <input
                    type="number"
                    min="1"
                    max={pregunta.opciones.length}
                    value={(respuestas[pregunta.id] || [])[idx] || ''}
                    onChange={(e) => {
                      const nuevas = [...(respuestas[pregunta.id] || [])];
                      nuevas[idx] = parseInt(e.target.value) || '';
                      handleChange(pregunta.id, nuevas);
                    }}
                    style={{ width: '60px', marginRight: '15px' }}
                  />
                  <label>{opcion}</label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="botones-navegacion">
          <button
            className="btn btn-secondary"
            onClick={() => setPaginaActual(Math.max(0, paginaActual - 1))}
            disabled={paginaActual === 0}
          >
            ← Anterior
          </button>

          {paginaActual < preguntas.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={() => setPaginaActual(paginaActual + 1)}
              disabled={!puedeAvanzar()}
            >
              Siguiente →
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={enviarRespuestas}
              disabled={!puedeAvanzar() || cargando}
            >
              {cargando ? <span className="loading"><span className="spinner"></span>Procesando...</span> : 'Ver Mi Análisis'}
            </button>
          )}
        </div>

        <button className="btn-admin-link" onClick={() => setCurrentPage('admin')}>
          ↓ Acceso Admin
        </button>
      </div>
    </div>
  );
};

export default Formulario;
