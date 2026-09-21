# ✅ Checklist: Despliegue en Render con Docker

## Antes de Empezar

- [ ] Tienes cuenta en Render.com
- [ ] Tu repositorio está en GitHub
- [ ] Archivo `render.env` está disponible
- [ ] Tienes acceso a copiar/pegar

---

## Paso a Paso

### 1. Crear Servicio en Render

- [ ] Ir a https://render.com
- [ ] Click en "New" > "Web Service"
- [ ] Conectar repositorio de GitHub
- [ ] Seleccionar: `jeffersonhuichochaochi-beep/Plataforma-de-empleabilidad-estudiantil`
- [ ] Click en "Connect"

### 2. Configurar Información Básica

- [ ] **Name**: `Plataforma-de-empleabilidad-estudiantil`
- [ ] **Region**: `Ohio (US East)`
- [ ] **Branch**: `main`
- [ ] **Instance Type**: `Free`

### 3. Configurar Root Directory ⚠️ IMPORTANTE

- [ ] Click en el campo **"Root Directory"**
- [ ] Escribir: `empleabilidad-backend`
- [ ] Verificar que aparezca en el campo

### 4. Seleccionar Environment

- [ ] Cambiar de "Node" a **"Docker"**
- [ ] Verificar que diga "Docker" seleccionado

### 5. Variables de Entorno (El paso más importante)

- [ ] Scroll hasta la sección "Environment Variables"
- [ ] Click en **"Add from .env"**
- [ ] Abrir archivo: `render.env`
- [ ] Seleccionar TODO (Ctrl+A)
- [ ] Copiar (Ctrl+C)
- [ ] Pegar en Render (Ctrl+V)
- [ ] Click en "Add Variables"
- [ ] Verificar que aparezcan 26 variables

### 6. Crear y Desplegar

- [ ] Revisar que todo esté correcto
- [ ] Click en **"Create Web Service"**
- [ ] Esperar el build (5-10 minutos)
- [ ] Ver los logs en tiempo real

---

## Verificación Post-Despliegue

### 1. Verificar Build Exitoso

- [ ] Build se completó sin errores
- [ ] Estado del servicio: "Live" (verde)
- [ ] No hay errores en los logs

### 2. Verificar Health Check

- [ ] Copiar la URL de tu servicio
- [ ] Abrir: `https://tu-app.onrender.com/actuator/health`
- [ ] Debe mostrar: `{"status":"UP"}`

### 3. Verificar Swagger UI

- [ ] Abrir: `https://tu-app.onrender.com/swagger-ui/index.html`
- [ ] Debe cargar la documentación de la API

### 4. Test de Endpoint

- [ ] Probar endpoint público:
  ```bash
  curl https://tu-app.onrender.com/api/ofertas/publicas
  ```
- [ ] Debe devolver JSON sin error 500

---

## Guardar Información

- [ ] Copiar URL del backend: `https://_____.onrender.com`
- [ ] Guardar en un lugar seguro
- [ ] URL será necesaria para Vercel

---

## Después del Despliegue

### Configurar Frontend en Vercel

- [ ] Ir a vercel.com
- [ ] Crear nuevo proyecto
- [ ] Root Directory: `empleabilidad-frontend`
- [ ] Agregar variable: `VITE_API_URL`
- [ ] Valor: `https://tu-backend.onrender.com/api`
- [ ] Deploy

### Actualizar CORS (Si es necesario)

- [ ] Obtener URL final de Vercel
- [ ] Ir a Render > Environment
- [ ] Editar `CORS_ALLOWED_ORIGINS`
- [ ] Agregar URL de Vercel
- [ ] Guardar (redespliegue automático)

---

## Testing End-to-End

- [ ] Abrir frontend en Vercel
- [ ] Intentar hacer login
- [ ] Login funciona correctamente
- [ ] Ver ofertas públicas
- [ ] Crear usuario
- [ ] Subir CV
- [ ] Todo funciona sin errores de CORS

---

## 🎉 ¡Despliegue Completo!

Si marcaste todas las casillas, tu aplicación está completamente desplegada y funcionando en producción.

---

## 🐛 Si Algo Falla

### Build falla
- [ ] Verificar Root Directory: `empleabilidad-backend`
- [ ] Verificar que Environment sea "Docker"
- [ ] Revisar logs de build

### Base de datos no conecta
- [ ] Verificar `SUPABASE_DB_PASSWORD`
- [ ] Verificar `SUPABASE_DB_URL`
- [ ] Verificar que Supabase esté activo

### CORS Error
- [ ] Verificar `CORS_ALLOWED_ORIGINS`
- [ ] Incluir URL exacta de Vercel
- [ ] Sin espacios, sin barra final
- [ ] Redesplegar después de cambiar

### Health Check falla
- [ ] Esperar 2-3 minutos más
- [ ] Revisar logs en Render
- [ ] Verificar que todas las variables estén configuradas

---

## 📞 Ayuda

- 📖 Guía completa: `RENDER_DEPLOYMENT.md`
- ⚡ Guía rápida: `RENDER_QUICK_START.md`
- 📋 Importar variables: `COMO_IMPORTAR_ENV_RENDER.md`
- 🐳 Resumen Docker: `RESUMEN_DESPLIEGUE_DOCKER.md`

---

**Fecha de despliegue**: _____________

**URL del backend**: _____________

**URL del frontend**: _____________

**Notas adicionales**:
_________________________________________________
_________________________________________________
_________________________________________________
