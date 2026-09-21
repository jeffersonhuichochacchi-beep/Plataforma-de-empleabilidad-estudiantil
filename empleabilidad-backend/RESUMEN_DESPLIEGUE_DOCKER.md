# 🐳 Resumen: Despliegue Backend con Docker en Render

## 📋 Configuración del Formulario de Render

### 1️⃣ Información Básica
```
Name: Plataforma-de-empleabilidad-estudiantil
Repository: jeffersonhuichochaochi-beep/Plataforma-de-empleabilidad-estudiantil
Branch: main
```

### 2️⃣ Root Directory ⚠️
```
empleabilidad-backend
```
**¡Haz clic en el campo para editarlo!**

### 3️⃣ Environment
```
Docker
```
**NO selecciones Node**

### 4️⃣ Region
```
Ohio (US East)
```

### 5️⃣ Instance Type
```
Free
```

---

## 🔑 Variables de Entorno (Importación Rápida)

### Método de Importación:

1. En el formulario, busca la sección **"Environment Variables"**
2. Click en **"Add from .env"**
3. Abre el archivo: `render.env`
4. **Selecciona TODO** el contenido (Ctrl+A)
5. **Copia** (Ctrl+C)
6. **Pega** en Render (Ctrl+V)
7. Click en **"Add Variables"**

✅ **26 variables importadas automáticamente**

---

## 📁 Archivo: render.env

### Ubicación:
```
c:\Users\Administrador\Pictures\final\Proyecto_final\empleabilidad-backend\render.env
```

### Contenido:
- ✅ Todas las credenciales de Supabase
- ✅ Todos los tokens de APIs Peru
- ✅ Todas las claves de Cloudinary
- ✅ API Key de Google Gemini
- ✅ Configuración de CORS
- ✅ Configuración de memoria Java
- ✅ **TODO listo para copiar y pegar**

---

## 🚀 Pasos para Desplegar

### Paso 1: Abrir Render
```
https://render.com
```
- Inicia sesión
- Click en "New" > "Web Service"

### Paso 2: Conectar Repositorio
- Selecciona tu repositorio de GitHub
- Click en "Connect"

### Paso 3: Configurar Servicio

| Campo | Valor |
|-------|-------|
| **Name** | Plataforma-de-empleabilidad-estudiantil |
| **Root Directory** | `empleabilidad-backend` ⚠️ |
| **Environment** | Docker |
| **Branch** | main |
| **Region** | Ohio (US East) |
| **Instance Type** | Free |

### Paso 4: Importar Variables de Entorno
1. Scroll hasta "Environment Variables"
2. Click en "Add from .env"
3. Copia todo el contenido de `render.env`
4. Pega en el cuadro de texto
5. Click en "Add Variables"

### Paso 5: Crear Servicio
- Click en **"Create Web Service"**
- Espera 5-10 minutos (primera vez)
- Render detectará automáticamente el `Dockerfile`
- Compilará y desplegará tu aplicación

---

## ⏱️ Tiempo Estimado

- **Build inicial**: 5-10 minutos
- **Builds subsecuentes**: 2-5 minutos (con cache)
- **Primer arranque**: 30-60 segundos

---

## ✅ Verificación Post-Despliegue

### 1. Health Check
```
https://tu-app.onrender.com/actuator/health
```
**Respuesta esperada:**
```json
{
  "status": "UP"
}
```

### 2. Swagger UI
```
https://tu-app.onrender.com/swagger-ui/index.html
```

### 3. Test de Endpoint Público
```bash
curl https://tu-app.onrender.com/api/ofertas/publicas
```

---

## 🌐 URL Final

Después del despliegue obtendrás una URL como:
```
https://plataforma-de-empleabilidad-estudiantil.onrender.com
```

**Guarda esta URL para:**
1. Configurar el frontend en Vercel
2. Actualizar CORS si es necesario
3. Testing y desarrollo

---

## 🔄 Actualizar CORS con Dominio de Vercel

**Después de desplegar el frontend en Vercel:**

1. Obtén tu URL de Vercel (ejemplo: `https://tu-app.vercel.app`)
2. Ve a Render > Tu Servicio > Environment
3. Busca `CORS_ALLOWED_ORIGINS`
4. Edita y actualiza:
   ```
   http://localhost:5173,https://tu-app-real.vercel.app
   ```
5. Guarda (se redesplegará automáticamente)

---

## 📊 Monitoreo

### Logs en Tiempo Real
```
Render Dashboard > Tu Servicio > Logs
```

### Métricas
```
Render Dashboard > Tu Servicio > Metrics
```

---

## 🐛 Problemas Comunes

### Build falla
- ✅ Verifica que `Dockerfile` exista en `empleabilidad-backend/`
- ✅ Verifica que Root Directory esté configurado
- ✅ Revisa los logs de build en Render

### Base de datos no conecta
- ✅ Verifica credenciales de Supabase en Environment Variables
- ✅ Verifica que `SUPABASE_DB_PASSWORD` sea correcta
- ✅ Verifica que Supabase permita conexiones externas

### CORS Error desde el frontend
- ✅ Verifica que `CORS_ALLOWED_ORIGINS` incluya tu dominio de Vercel
- ✅ Sin espacios entre URLs
- ✅ Sin barra final en las URLs
- ✅ Redespliegue después de cambiar CORS

### Servicio "unhealthy"
- ✅ Espera 1-2 minutos después del despliegue
- ✅ Verifica `/actuator/health` manualmente
- ✅ Revisa logs para errores de arranque

---

## 🎯 Siguiente Paso

Una vez que tu backend esté desplegado y funcionando:

1. ✅ Copia la URL del backend
2. ✅ Ve a Vercel y configura el frontend
3. ✅ Agrega la variable en Vercel:
   ```
   VITE_API_URL=https://tu-backend.onrender.com/api
   ```
4. ✅ Despliega el frontend
5. ✅ Prueba login y funcionalidad

---

## 📦 Archivos de Referencia

| Archivo | Descripción |
|---------|-------------|
| `render.env` | ✅ Variables de entorno listas para importar |
| `Dockerfile` | ✅ Configuración Docker |
| `RENDER_DEPLOYMENT.md` | 📖 Guía completa detallada |
| `RENDER_QUICK_START.md` | ⚡ Guía rápida |
| `COMO_IMPORTAR_ENV_RENDER.md` | 📋 Cómo importar variables |

---

## 🎉 ¡Todo Listo!

Tu archivo `render.env` contiene **TODAS** las credenciales necesarias.
Solo necesitas:
1. Copiar
2. Pegar en Render
3. Deploy

¡Así de simple! 🚀
