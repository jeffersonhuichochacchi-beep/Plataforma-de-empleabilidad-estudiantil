# 🚀 Guía Completa de Despliegue

## 📦 Arquitectura del Proyecto

```
Frontend (React + Vite) → Vercel
Backend (Spring Boot) → Render  
Database → Supabase PostgreSQL
Storage → Cloudinary
AI → Google Gemini
```

---

## 🎯 Orden de Despliegue

### 1️⃣ Backend en Render (PRIMERO)
📁 `empleabilidad-backend/RENDER_DEPLOYMENT.md`

**Resumen rápido:**
- Lenguaje: Docker o Java
- Root Directory: `empleabilidad-backend`
- Variables de entorno: Ver `RENDER_QUICK_START.md`
- URL resultante: `https://tu-app.onrender.com`

### 2️⃣ Frontend en Vercel (DESPUÉS)
📁 `empleabilidad-frontend/VERCEL_DEPLOYMENT.md`

**Resumen rápido:**
- Framework: Vite (Create React App)
- Root Directory: `empleabilidad-frontend`
- Variable crítica: `VITE_API_URL=https://tu-backend.onrender.com/api`
- URL resultante: `https://tu-app.vercel.app`

---

## ⚙️ Configuración Rápida

### Backend (Render)

```bash
# 1. Navega al backend
cd empleabilidad-backend

# 2. Verifica que todo esté listo (Windows)
.\pre-deploy-check.ps1

# 3. Commit y push
git add .
git commit -m "chore: prepare backend for Render deployment"
git push origin main

# 4. Ve a render.com y sigue: RENDER_QUICK_START.md
```

### Frontend (Vercel)

```bash
# 1. Asegúrate de tener la URL del backend de Render
# 2. Ve a vercel.com
# 3. Sigue: VERCEL_DEPLOYMENT.md
```

---

## 🔑 Variables de Entorno Críticas

### Backend (Render)

```env
# Obligatorias
SUPABASE_DB_URL=...
SUPABASE_DB_USER=...
SUPABASE_DB_PASSWORD=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GEMINI_API_KEY=...
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://tu-app.vercel.app
```

### Frontend (Vercel)

```env
# Solo una variable
VITE_API_URL=https://tu-backend.onrender.com/api
```

---

## ✅ Checklist de Despliegue

### Backend
- [ ] Root Directory: `empleabilidad-backend`
- [ ] Lenguaje: Docker o Java (NO Node)
- [ ] Todas las variables de entorno agregadas
- [ ] Build exitoso
- [ ] Health check funciona: `/actuator/health`
- [ ] Swagger UI accesible: `/swagger-ui/index.html`

### Frontend
- [ ] Root Directory: `empleabilidad-frontend`
- [ ] Framework: Create React App
- [ ] Variable `VITE_API_URL` configurada
- [ ] Build exitoso
- [ ] Login funciona desde el frontend
- [ ] No hay errores de CORS

---

## 🔗 Conexión Frontend-Backend

**Flujo:**
1. Usuario accede a: `https://tu-app.vercel.app`
2. Frontend hace peticiones a: `https://tu-backend.onrender.com/api`
3. Backend valida con: Supabase Auth
4. Backend almacena archivos en: Cloudinary
5. Backend consulta DB: Supabase PostgreSQL

**CORS:** El backend debe permitir el dominio de Vercel:
```java
CORS_ALLOWED_ORIGINS=https://tu-app.vercel.app
```

---

## 🐛 Problemas Comunes

### Backend no responde
✅ Verifica que todas las variables de entorno estén correctas
✅ Revisa los logs en Render
✅ Verifica que Supabase permita conexiones externas

### CORS Error
✅ Verifica `CORS_ALLOWED_ORIGINS` en Render
✅ Asegúrate de incluir el dominio exacto de Vercel (sin barra final)
✅ Redespliegua el backend después de cambiar CORS

### Frontend muestra 404 en rutas
✅ Ya configurado en `vercel.json` con rewrites

### Backend se duerme (plan gratuito)
✅ Primera petición tardará 30-60 segundos
✅ Considera usar UptimeRobot para mantenerlo despierto

---

## 📞 Documentación Detallada

- **Backend**: `empleabilidad-backend/RENDER_DEPLOYMENT.md`
- **Frontend**: `empleabilidad-frontend/VERCEL_DEPLOYMENT.md`
- **Quick Start Backend**: `empleabilidad-backend/RENDER_QUICK_START.md`

---

## 🎉 URLs Finales

Una vez desplegado, tendrás:

- **Frontend**: `https://plataforma-de-empleabilidad-estudiantil.vercel.app`
- **Backend API**: `https://plataforma-de-empleabilidad-estudiantil.onrender.com/api`
- **Swagger UI**: `https://plataforma-de-empleabilidad-estudiantil.onrender.com/swagger-ui/index.html`
- **Health Check**: `https://plataforma-de-empleabilidad-estudiantil.onrender.com/actuator/health`

---

## 🚀 ¡Listo para Producción!

Tu plataforma estará desplegada y lista para usuarios reales.

**Recuerda:**
1. Backend primero (necesitas la URL para el frontend)
2. Frontend después (usa la URL del backend)
3. Verifica que todo funcione
4. Monitorea los logs en ambas plataformas

¡Éxito con tu despliegue! 🎊
