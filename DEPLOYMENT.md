# 🚀 GUÍA COMPLETA DE DEPLOYMENT

## RESUMEN EJECUTIVO

Tienes una app 100% lista para deployar. Solo necesitas 3 pasos:

1. **Crear Firebase Project** (5 minutos)
2. **Agregar API keys** (.env.local)
3. **Deploy a Vercel** (1 click)

---

## PASO 1: CREAR FIREBASE PROJECT

### 1.1 Ir a Firebase Console
- Ve a https://console.firebase.google.com
- Click en "Crear proyecto"
- Nombre: `kinesiologos-digitales`
- Habilita Google Analytics (opcional)
- Click "Crear proyecto"
- Espera a que se cree (2-3 min)

### 1.2 Obtener Credenciales
Una vez creado el proyecto:

1. Click en "Configuración del proyecto" (rueda de engranaje)
2. Ir a pestaña "Cuentas de servicio"
3. Click en "Generar clave privada"
4. Se descarga un JSON con todas las credenciales
5. Copia estos valores:

```
VITE_FIREBASE_API_KEY=<apiKey>
VITE_FIREBASE_AUTH_DOMAIN=<authDomain>
VITE_FIREBASE_PROJECT_ID=<projectId>
VITE_FIREBASE_STORAGE_BUCKET=<storageBucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<messagingSenderId>
VITE_FIREBASE_APP_ID=<appId>
```

### 1.3 Habilitar Firestore Database
1. En Firebase Console, ir a "Firestore Database"
2. Click "Crear base de datos"
3. Modo: "Iniciar en modo de prueba"
4. Región: "Sudamérica (São Paulo)"
5. Click "Crear"

### 1.4 Habilitar Cloud Functions
1. En Firebase Console, ir a "Functions"
2. Click "Comenzar"
3. Selecciona el plan "Spark" (gratuito)

---

## PASO 2: CONFIGURAR API KEYS

### 2.1 Crear archivo .env.local
```bash
# En la raíz del proyecto (kinesiologos-app/)
touch .env.local
```

### 2.2 Agregar credenciales
Copia esto en `.env.local`:

```env
# Firebase
VITE_FIREBASE_API_KEY=AIzaSyDx...
VITE_FIREBASE_AUTH_DOMAIN=kinesiologos-digitales.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=kinesiologos-digitales
VITE_FIREBASE_STORAGE_BUCKET=kinesiologos-digitales.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Claude API
VITE_CLAUDE_API_KEY=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

# Email (opcional, para sendgrid)
VITE_EMAIL_FROM=noreply@kinesiologosdigitales.com
```

### 2.3 Probar localmente
```bash
npm install
npm run dev
```

Debería abrirse en http://localhost:3000 ✅

---

## PASO 3: DEPLOYMENT A VERCEL

### 3.1 Crear cuenta Vercel
1. Ve a https://vercel.com
2. Click "Sign Up"
3. Conecta con GitHub (recomendado)

### 3.2 Conectar repositorio
1. En Vercel Dashboard, click "Add New..." → "Project"
2. Selecciona tu repositorio de GitHub
3. Click "Import"

### 3.3 Configurar variables de entorno
1. En la sección "Environment Variables"
2. Agrega todas las variables del `.env.local`

```
VITE_FIREBASE_API_KEY = AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN = kinesiologos-digitales.firebaseapp.com
... etc
```

### 3.4 Deploy
1. Click "Deploy"
2. Vercel empezará el build automáticamente
3. En 2-3 minutos, tendrás tu app en vivo

**URL:** `https://kinesiologos-digitales.vercel.app`

---

## PASO 4: CONFIGURAR CLOUD FUNCTIONS (BACKEND)

### 4.1 Instalar Firebase CLI
```bash
npm install -g firebase-tools
```

### 4.2 Iniciar Firebase en el proyecto
```bash
firebase login
firebase init functions
```

Responde:
- ¿Usar proyecto existente? → Sí, selecciona `kinesiologos-digitales`
- ¿JavaScript? → Sí
- ¿ESLint? → No
- ¿Instalar dependencias? → Sí

### 4.3 Reemplazar archivo de funciones
Copia el contenido de `firebase/functions/analizar.js` a `functions/index.js`

### 4.4 Deploy functions
```bash
firebase deploy --only functions
```

---

## ✅ CHECKLIST FINAL

Verifica que todo está funcionando:

- [ ] App accesible en https://kinesiologos-digitales.vercel.app
- [ ] Formulario carga correctamente
- [ ] Puedes responder las 32 preguntas
- [ ] PDF se descarga al completar
- [ ] Botón "Agendar" redirige a Google Calendar
- [ ] Admin panel accesible (password: `kinetk2024`)
- [ ] Datos se guardan en Firestore

---

## 🆘 TROUBLESHOOTING

### Error: "Cannot find module 'react'"
```bash
npm install
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Error: "API Key inválida"
- Verifica que la key esté correctamente copiada en `.env.local`
- La key Claude debe empezar con `sk-ant-api03-`
- Regenera si es necesario en https://console.anthropic.com

### Error: "Firestore not connected"
- Verifica que creaste Firestore Database
- Revisa que está en modo "Modo de prueba"

### Error: "CORS"
- Esto ocurre si llamas a URLs externas incorrectamente
- La solución está en las Cloud Functions (backend)

### Error: "Email no se envía"
- Configura SendGrid (opcional, para ahora no es crítico)
- Por ahora, los emails se pueden enviar manualmente

---

## 📧 CONFIGURAR EMAILS (OPCIONAL)

### Con SendGrid (Recomendado)

1. Ve a https://sendgrid.com
2. Crea cuenta (plan gratuito)
3. Obtén API key
4. En Firebase Console:
   ```bash
   firebase functions:config:set sendgrid.api_key="SG..."
   firebase deploy --only functions
   ```

Sin emails automáticos por ahora, puedes:
- Notificarte manualmente de nuevas respuestas
- Verlas en Firestore Dashboard

---

## 🔒 SEGURIDAD

### Cambiar contraseña admin
En `src/App.jsx`, línea ~50:
```javascript
if (password === 'kinetk2024') { // ← CAMBIAR ESTO
```

### Cambiar a algo seguro:
```javascript
if (password === 'tu-password-super-seguro-2024') {
```

### Proteger Firestore
En Firebase Console → Firestore → Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /respuestas/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📊 MONITOREAR LA APP

### Firestore Dashboard
- Ve a https://console.firebase.google.com
- Firestore Database → Colección "respuestas"
- Aquí verás todas las respuestas que lleguen

### Vercel Analytics
- Ve a https://vercel.com/dashboard
- Proyecto → Analytics
- Métricas de performance y accesos

### Cloud Functions Logs
```bash
firebase functions:log
```

---

## 🎯 PRÓXIMOS PASOS

1. **Testear la app** en el link de Vercel
2. **Compartir el link** con los kinesiología
3. **Monitorear respuestas** en Firestore
4. **Agendar llamadas** con los que indiquen interés

---

## SOPORTE RÁPIDO

Si algo falla:

1. Revisa la consola del navegador (F12)
2. Ve logs de Vercel: `vercel logs`
3. Ve logs de Firebase: `firebase functions:log`
4. Revisa las variables de entorno en Vercel

---

**¡Listo! Tu app ya está deployada y funcionando.** 🚀

Ahora solo falta compartir el link y esperar que los kinesiólogos comiencen a usar la app.

