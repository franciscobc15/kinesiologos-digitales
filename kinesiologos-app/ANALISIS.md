# 📊 CÓMO FUNCIONA EL ANÁLISIS CON CLAUDE

## Resumen del Flujo

```
Usuario responde 32 preguntas
        ↓
Datos se envían a Cloud Function
        ↓
Claude API analiza las respuestas
        ↓
Genera análisis en JSON
        ↓
Se guarda en Firestore
        ↓
Se genera PDF
        ↓
Usuario ve resumen
Admin ve análisis completo
```

---

## Las 32 Preguntas y Qué Miden

### BLOQUE 1: DATOS BÁSICOS (4 preguntas)
- **Q1-4:** Captura de información de contacto
- **Propósito:** Identificar al usuario

### BLOQUE 2: SITUACIÓN PROFESIONAL (5 preguntas)
- **Q5:** Dedicación actual + formaciones
- **Q6:** Etapa profesional (7 opciones)
- **Q7:** Situación laboral actual
- **Q8:** Productos/servicios que ofrece
- **Q9:** Objetivos con redes sociales
- **Propósito:** Mapear su contexto profesional

### BLOQUE 3: PRESENCIA EN REDES (5 preguntas)
- **Q10:** Qué redes utiliza
- **Q11:** Frecuencia actual de publicación
- **Q12:** Última publicación educativa
- **Q13:** Tiempo invertido semanalmente
- **Q14:** Frecuencia deseada
- **Propósito:** Evaluar actividad digital actual vs. potencial

### BLOQUE 4: BLOQUEOS TÉCNICOS (4 preguntas)
- **Q15:** Equipo disponible
- **Q16:** Nivel de edición de video
- **Q17:** Contenido más difícil de crear
- **Q18:** Iluminación/espacio para grabar
- **Propósito:** Identificar barreras técnicas reales

### BLOQUE 5: MENTALIDAD & EMOCIONES (10 preguntas)
- **Q19:** Disposición a aparecer en video
- **Q20:** Seguridad frente a cámara
- **Q21:** Valor percibido del conocimiento
- **Q22:** Pensamientos limitantes (multi-select)
- **Q23:** Emociones actuales (multi-select)
- **Q24:** Ordenar qué te frena principalmente
- **Q25:** Claridad del público objetivo
- **Q26:** Conocimiento de algoritmos
- **Q27:** Análisis de estadísticas
- **Q28:** Motivaciones actuales (multi-select)
- **Propósito:** Evaluar estado emocional y mental (LA PARTE MÁS IMPORTANTE)

### BLOQUE 6: RECURSOS & CLARIDAD (2 preguntas)
- **Q29:** Plan de contenido definido
- **Q30:** Comunicación de oferta
- **Propósito:** Evaluar preparación estratégica

### BLOQUE 7: CONVERSIÓN (2 preguntas)
- **Q31:** Interés en ayuda
- **Q32:** Tipo de acompañamiento deseado
- **Propósito:** Captar leads y cerrar la venta

---

## Cómo Claude Genera el Análisis

### 1. SCORING DE MÉTRICAS (6 dimensiones)

Claude analiza cada respuesta y asigna puntuaciones 0-100 en:

#### **Presencia Digital** (0-100)
```
Basado en:
- Q10: Redes que usa (1-6 redes = 0-100)
- Q11: Frecuencia actual (nunca = 0, diario = 100)
- Q12: Última publicación (hace >1mes = 0, esta semana = 100)

Fórmula: (redes_utilizadas × 16) + (frecuencia × 30) + (recencia × 20)
```

#### **Habilidades Técnicas** (0-100)
```
Basado en:
- Q15: Equipo disponible (sin equipo = 0, equipo completo = 80)
- Q16: Nivel de edición (nada = 0, avanzado = 100)
- Q17: Dificultades técnicas (todas = 0, ninguna = 100)

Fórmula: (equipo × 30) + (edicion × 50) + (confort × 20)
```

#### **Mentalidad** (0-100)
```
Basado en:
- Q19: Disposición video (miedo = 0, encanta = 100)
- Q20: Seguridad frente a cámara
- Q21: Valor del conocimiento

Fórmula: Promedio ponderado de estas 3 preguntas
```

#### **Estrategia de Monetización** (0-100)
```
Basado en:
- Q29: Plan de contenido (no = 0, sí definido = 80)
- Q30: Comunicación de oferta (no sé = 0, clara = 100)
- Q8: Si tiene producto/servicio (no = 0, sí = 60)

Fórmula: Promedio ponderado
```

#### **Estabilidad Emocional** (0-100)
```
Basado en:
- Q23: Emociones negativas (frustración, ansiedad, miedo, desmotivación)
- Q24: Orden de frenos (cuántos bloqueos tiene)
- Q28: Motivaciones positivas

Fórmula: (emociones_positivas × 40) - (emociones_negativas × 30) + base_100
```

#### **Estrategia de Contenido** (0-100)
```
Basado en:
- Q29: Plan de contenido definido
- Q25: Claridad de público objetivo
- Q26: Conocimiento de algoritmos
- Q27: Análisis de estadísticas

Fórmula: Promedio ponderado de estas 4
```

### 2. SCORE GENERAL (0-100)

```
Score General = (
  Presencia_Digital × 0.20 +
  Habilidades_Tecnicas × 0.15 +
  Mentalidad × 0.25 +          ← MÁS PESO EN MENTALIDAD
  Estrategia_Monetizacion × 0.15 +
  Estabilidad_Emocional × 0.15 +
  Estrategia_Contenido × 0.10
)

Rangos:
- 0-40: BAJO - Mucho por trabajar
- 41-60: MEDIO - Potencial moderado
- 61-75: ALTO - Buen potencial
- 76-100: MUY ALTO - Potencial excelente
```

### 3. IDENTIFICACIÓN DE FORTALEZAS

Claude busca:
- Equipo técnico disponible
- Claridad de público objetivo
- Habilidades de comunicación
- Motivación presente
- Conocimiento profesional
- Disposición a aprender

### 4. IDENTIFICACIÓN DE DESAFÍOS

Claude prioriza por impacto:

**CRÍTICO (5/5) - Bloquea todo:**
- Creencias limitantes fuertes ("nadie paga")
- Miedo paralizante a exponerse
- Carga emocional múltiple
- Sin oferta estructurada

**ALTO (4/5) - Ralentiza mucho:**
- Miedo al juicio de colegas
- Sin estrategia de contenido
- Inseguridad para vender
- Inconsistencia en publicación

**MEDIO (3/5) - Limita:**
- Falta de tiempo
- Conocimiento técnico bajo
- Equipo limitado

### 5. ANÁLISIS EMOCIONAL

Claude identifica:
- **Emoción dominante:** La que aparece más
- **Patrón emocional:** Si hay combinaciones destructivas
- **Energía disponible:** Si hay esperanza/motivación
- **Urgencia:** Si necesita ingresos ya

### 6. PRONÓSTICO A 90 DÍAS

Basado en todo lo anterior, Claude sugiere:
- **Timeline:** 2-6 meses para resultados
- **Primer hito:** Qué debe lograr en 90 días
- **Recomendaciones:** Acciones priorizadas

---

## Ejemplo de Análisis (Carolina Bernal)

### Respuestas Clave:
```
Q5: "Kinesiologa a domicilio"
Q6: "Recién egresado sin trabajo"
Q7: "Sin trabajo, necesito ingresos urgentes"
Q8: "No tengo oferta estructurada"
Q11: "Menos de 2 horas"
Q12: "Hace más de 1 mes"
Q20: "Me cuesta un poco, pero lo intento"
Q21: "Sí, totalmente"
Q22: ["Me da miedo que otros colegas me critiquen", "No sé por dónde empezar"]
Q23: ["Esperanza"]
Q28: ["Generar ingresos"]
```

### Análisis Generado:
```
Puntuación: 72/100 → ALTO

Fortalezas:
✓ Urgencia real genera combustible para acción
✓ Conocimiento claro: kinesiología general
✓ Disposición a aprender
✓ Esperanza presente (no desmotivación total)

Desafíos:
! Miedo al juicio de colegas (CRÍTICO 5/5)
! No tengo trabajo estable (presión económica)
! No sé por dónde empezar (parálisis)
! Consulta a domicilio (difícil de escalar)

Emociones:
- Principal: Esperanza + presión económica
- Frenos: Miedo social + falta de dirección

Pronóstico:
3-6 MESES para estabilizar con ingresos de redes
Necesita: desbloqueo emocional + plan simple
```

---

## Prompt de Claude (Resumido)

```
"Eres experto en marketing para kinesiólogos.
Analiza estas 32 respuestas y genera:

1. Puntuaciones en 6 métricas
2. Fortalezas identificadas (máx 5)
3. Desafíos con nivel de impacto
4. Análisis emocional
5. Barreras priorizadas
6. Recomendaciones accionables
7. Pronóstico a X meses

Sé realista pero empático.
Pondera mucho el estado emocional.
Usa contexto latinoamericano."
```

---

## Validación de Calidad

Claude análisis son de alta calidad porque:

✅ Basado en 32 puntos de datos (no 1-2 preguntas)
✅ Múltiples dimensiones medidas (no solo técnica)
✅ Estado emocional tiene peso significativo
✅ Análisis realista, no falso optimismo
✅ Recomendaciones priorizadas y accionables
✅ Contexto profesional latinoamericano

---

## Cómo Usan Esta Información en la Asesoría

En la llamada 1:1, revisas:

1. **Puntuación general** ← Posicionamiento
2. **Gráfico de 6 métricas** ← Dónde está fuerte/débil
3. **Análisis emocional** ← Por dónde empezar
4. **Barreras priorizadas** ← Qué trabajar primero
5. **Recomendaciones** ← Plan de 90 días

Esto te permite tener conversación super personalizadas en 15 minutos.

---

**Resultado:** Análisis profundo, personalizado y accionable que posiciona bien tu programa de acompañamiento.

