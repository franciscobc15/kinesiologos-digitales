# 🎯 Kinesiólogos Digitales - Aplicación de Diagnóstico

Aplicación interactiva que permite a kinesiólogos responder un cuestionario de 32 preguntas y recibir un análisis personalizado de su potencial en redes sociales.

## 📋 Características

✅ **Formulario interactivo** de 32 preguntas con progreso visual
✅ **Análisis automático** con Claude AI
✅ **Generación de 2 PDFs**: análisis corto para usuario, completo para admin
✅ **Dashboard admin** para gestionar respuestas
✅ **Integración Google Calendar** para agendar asesorías
✅ **Emails automáticos** de confirmación y recordatorios
✅ **Paleta de colores** profesional de Rehabilitación y Educación
✅ **Responsive** y optimizado para móviles

## 🚀 Setup Rápido (5 minutos)

### Paso 1: Clonar repositorio
```bash
git clone [tu-repo]
cd kinesiologos-app
npm install
```

### Paso 2: Crear archivo .env
```bash
cp .env.example .env.local
```

Edita `.env.local` con:
```
VITE_FIREBASE_API_KEY=xxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxx
VITE_FIREBASE_APP_ID=xxxx
VITE_CLAUDE_API_KEY=sk-ant-api03-...
```

### Paso 3: Ejecutar en desarrollo
```bash
npm run dev
```

La app abrirá automáticamente en `http://localhost:3000`

### Paso 4: Build para producción
```bash
npm run build
```

## 📦 Estructura del Proyecto

```
kinesiologos-app/
├── src/
│   ├── components/
│   │   ├── Formulario.jsx       # Formulario interactivo (32 preguntas)
│   │   ├── GeneradorPDF.jsx     # Generación de PDFs
│   │   └── Dashboard.jsx        # Admin panel
│   ├── utils/
│   │   └── claudeAPI.js         # Integración Claude API
│   ├── assets/
│   │   └── logo.png             # Logo Rehabilitación y Educación
│   ├── App.jsx                  # Componente principal
│   ├── App.css                  # Estilos (paleta oficial)
│   └── main.jsx                 # Entrada React
├── firebase/
│   ├── functions/
│   │   └── analizar.js          # Cloud Functions
│   └── firebaseConfig.js        # Configuración Firebase
├── public/
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 🔐 Configuración Detallada

### 1. Crear Firebase Project

1. Ve a https://console.firebase.google.com
2. Crea nuevo proyecto: "kinesiologos-digitales"
3. Habilita Firestore Database
4. Habilita Cloud Functions
5. Copia credenciales en `.env.local`

### 2. Setup Claude API

1. Ve a https://console.anthropic.com
2. Crea cuenta y get API key
3. Agrega en `.env.local`: `VITE_CLAUDE_API_KEY=sk-ant-api03-...`

### 3. Configurar Emails (SendGrid)

1. Ve a https://sendgrid.com
2. Crea cuenta gratuita
3. Get API key
4. Configura en Firebase Environment Variables:

```bash
firebase functions:config:set sendgrid.api_key="SG..."
firebase deploy --only functions
```

### 4. Google Calendar Integration

Ya configurado. Link: https://calendar.app.google/PTS634TGHcUi66Qz6

## 🎨 Paleta de Colores

Tomada del logo oficial de Rehabilitación y Educación:

```css
--color-primary: #0891b2      /* Azul Teal */
--color-primary-dark: #0e7490
--color-accent: #ef4444       /* Rojo */
--color-accent-light: #f97316  /* Naranja */
--color-background: #f0f9fb
--color-surface: #ffffff
--color-text: #1e293b
--color-border: #cbd5e1
--color-success: #22c55e
```

## 📊 Flujo del Usuario

```
1. Usuario ingresa a la app
   ↓
2. Responde 32 preguntas (5-10 min)
   ↓
3. Sistema llama Claude API para análisis
   ↓
4. Genera 2 PDFs automáticamente:
   - PDF CORTO: "Tu Potencial de Éxito" (para usuario)
   - PDF COMPLETO: Análisis profesional (para admin)
   ↓
5. Usuario ve resumen + botón para descargar + agendar
   ↓
6. Admin ve todas las respuestas en dashboard
```

## 👨‍💼 Login Admin

**URL:** http://localhost:3000
**Contraseña:** `kinetk2024` (cambiar en producción)

Dashboard muestra:
- Total de evaluados
- Tasa de conversión
- Tabla con todas las respuestas
- Detalles de cada kinesiólogo
- Checkbox para marcar "agendadas"

## 📧 Emails Automáticos

### Email al completar cuestionario
```
To: usuario@email.com
Subject: Tu Análisis de Potencial está Listo 🎯

Mensaje con:
- Confirmación de envío
- Potencial identificado (ALTO/MUY ALTO/etc)
- Botón para agendar asesoría
```

### Email de recordatorio (24h antes)
```
To: usuario@email.com
Subject: Recordatorio: Asesoría Gratuita en 24 horas 📅

Mensaje con:
- Fecha y hora de la asesoría
- Link para unirse
```

## 🚀 Deployment en Vercel

### 1. Push a GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy a Vercel
```bash
npm i -g vercel
vercel
```

### 3. Configurar variables de entorno en Vercel
Dashboard → Settings → Environment Variables
- Agregar todas las variables del `.env.local`

### 4. Deploy Firebase Functions
```bash
firebase login
firebase deploy --only functions
```

## 📈 Estructura de Datos Firestore

```javascript
// Collection: respuestas
{
  id: auto-generated,
  nombre: "Carolina Bernal",
  email: "carolina@email.com",
  telefono: "+56 9 XXXX XXXX",
  ciudad: "San Pedro de Atacama",
  puntuacion_general: 72,
  potencial_exito: "ALTO",
  metricas: {
    presencia_digital: 10,
    habilidades_tecnicas: 40,
    // ... más métricas
  },
  respuestas_completas: { /* todas las 32 respuestas */ },
  fecha_creacion: timestamp,
  agendada: false
}
```

## 🔄 API Endpoints (Cloud Functions)

### POST /api/analizar
Recibe respuestas del formulario y llama Claude API
```javascript
Request:
{
  respuestas: { 1: "nombre", 2: "email", ... }
}

Response:
{
  success: true,
  analisis: { /* análisis completo */ }
}
```

### GET /api/respuestas
Obtiene todas las respuestas (solo para admin autenticado)

### POST /api/agendar
Crea evento en Google Calendar

## 🛠️ Troubleshooting

### "Error: Cannot find module 'react'"
```bash
npm install
npm run dev
```

### "CORS error"
Revisa configuración de Firebase CORS en `firebase.json`

### "API key inválida"
- Verifica que la key esté en `.env.local`
- Revisa que sea una key de Anthropic (comienza con `sk-ant-api03`)
- Regenera la key si es necesario

### Los emails no se envían
- Verifica que SendGrid está configurado en Firebase
- Revisa que tienes crédito en la cuenta

## 📱 Responsive Design

- ✅ Desktop (1200px+)
- ✅ Tablet (768px-1199px)
- ✅ Mobile (< 768px)

Probado en:
- Chrome, Firefox, Safari
- iPhone, Android
- iPad, tablets genéricos

## 🔐 Seguridad

- API keys no se envían al cliente (solo en backend)
- Firestore Rules restringen acceso
- Contraseña admin hasheada (cambiar en producción)
- Inputs sanitizados contra XSS
- CORS configurado correctamente

## 📝 Licencia

© 2024 Rehabilitación y Educación. Todos los derechos reservados.

## 👨‍💻 Soporte

Para dudas o issues:
- Email: francisco.bustamante.c@mail.pucv.cl
- WhatsApp: +56 9 XXXX XXXX

---

**Última actualización:** Enero 2024
**Versión:** 1.0.0
