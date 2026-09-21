# 📦 Cómo Importar Variables de Entorno en Render

## 🎯 Método Rápido: Importar desde render.env

### Paso 1: Durante la Creación del Servicio

Cuando estés en el formulario "New Web Service":

1. Desplázate hasta la sección **"Environment Variables"** (puede estar colapsada)
2. Click en el botón **"Add from .env"**
3. Abre el archivo `render.env` de este directorio
4. **Copia TODO el contenido** del archivo (Ctrl+A, Ctrl+C)
5. **Pega** en el cuadro de texto de Render (Ctrl+V)
6. Click en **"Add Variables"**

✅ ¡Listo! Todas las 25+ variables se agregarán automáticamente.

---

### Paso 2: Después de Crear el Servicio

Si ya creaste el servicio pero olvidaste las variables:

1. Ve a tu servicio en Render Dashboard
2. Click en la pestaña **"Environment"** (menú izquierdo)
3. Scroll hasta abajo
4. Click en **"Add from .env"**
5. Copia y pega el contenido de `render.env`
6. Click en **"Save Changes"**
7. Render redesplegará automáticamente tu servicio

---

## 🔄 Actualizar el Dominio de Vercel en CORS

Una vez que despliegues tu frontend en Vercel y obtengas la URL final, necesitas actualizar la variable `CORS_ALLOWED_ORIGINS`:

### Antes (durante el primer despliegue):
```env
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://plataforma-de-empleabilidad-estudiantil.vercel.app
```

### Después (con tu URL real de Vercel):
```env
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://tu-url-real.vercel.app
```

**Pasos:**
1. Copia tu URL real de Vercel (sin barra final)
2. Ve a Render > Tu Servicio > Environment
3. Busca `CORS_ALLOWED_ORIGINS`
4. Click en el ícono de editar (lápiz)
5. Actualiza el valor
6. Click en "Save Changes"
7. Espera el redespliegue automático

---

## 📋 Variables Incluidas en render.env

El archivo `render.env` incluye **todas** estas variables con sus valores reales:

### ✅ Configuración del Servidor (2)
- `SERVER_PORT`
- `JPA_SHOW_SQL`

### ✅ Base de Datos Supabase (3)
- `SUPABASE_DB_URL`
- `SUPABASE_DB_USER`
- `SUPABASE_DB_PASSWORD`

### ✅ Autenticación Supabase (4)
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ISSUER`

### ✅ Almacenamiento (2)
- `STORAGE_LOCAL_BASE_PATH`
- `STORAGE_CV_MAX_SIZE_MB`

### ✅ APIs Peru (5)
- `APISPERU_TOKEN`
- `APISPERU_AUTH_URL`
- `APISPERU_DNI_URL`
- `APISPERU_RUC_URL`
- `APISPERU_USERNAME`
- `APISPERU_PASSWORD`

### ✅ Cloudinary (3)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### ✅ Google Gemini AI (2)
- `GEMINI_API_KEY`
- `GEMINI_MODEL`

### ✅ CORS (1)
- `CORS_ALLOWED_ORIGINS`

### ✅ Microservicios (2)
- `USUARIOS_SERVICE_URL`
- `OFERTAS_SERVICE_URL`

### ✅ Java Memory (1)
- `JAVA_TOOL_OPTIONS`

### ✅ Admin Seed (1)
- `APP_ADMIN_SEED_ENABLED`

**Total: 26 variables** ✅

---

## 🔐 Seguridad

⚠️ **IMPORTANTE**: El archivo `render.env` contiene credenciales sensibles:

### ✅ Buenas Prácticas:

1. **NO subas `render.env` a Git**
   - Ya está en `.gitignore`
   - Solo úsalo para copiar/pegar en Render

2. **Usa el archivo solo localmente**
   - Cópialo manualmente
   - No lo compartas por email o chat público

3. **Elimínalo después del despliegue** (opcional)
   ```powershell
   Remove-Item render.env
   ```

4. **Rotar credenciales si se exponen**
   - Cambia passwords en Supabase
   - Regenera API keys en Cloudinary
   - Actualiza tokens en APIs Peru

---

## 🎨 Vista Previa en Render

Después de importar, verás algo como:

```
Environment Variables (26)

SERVER_PORT = 8080
JPA_SHOW_SQL = false
SUPABASE_DB_URL = jdbc:postgresql://aws-0-us-west-2...
SUPABASE_DB_USER = postgres.mdayyjszoesorvlymiqv
SUPABASE_DB_PASSWORD = •••••••••••••••
...
CORS_ALLOWED_ORIGINS = http://localhost:5173,https://...
```

Los valores sensibles se mostrarán con puntos (•••) por seguridad.

---

## ✅ Verificación

Para verificar que las variables se cargaron correctamente:

1. Después del despliegue, ve a los **Logs**
2. Busca líneas como:
   ```
   Hikari Pool - Starting...
   Started EmpleabilidadBackendApplication in X seconds
   ```
3. Si ves errores de conexión a DB, verifica las credenciales de Supabase
4. Prueba el health check: `https://tu-app.onrender.com/actuator/health`

---

## 🐛 Troubleshooting

### Error: "Failed to parse .env"
- Verifica que no haya líneas vacías entre variables
- Asegúrate de copiar TODO el archivo, incluidos los comentarios
- Los comentarios (#) son válidos y se ignoran automáticamente

### Error: "Invalid value for X"
- Verifica que no haya espacios antes o después del `=`
- Formato correcto: `KEY=value`
- Formato incorrecto: `KEY = value` o `KEY =value`

### Variable no se aplica
- Haz un "Manual Deploy" para forzar el redespliegue
- Ve a Deployments > Manual Deploy

---

## 📞 Próximo Paso

Después de importar las variables:

1. ✅ Verifica que todas estén en Render
2. ✅ Click en **"Create Web Service"** o **"Save Changes"**
3. ✅ Espera que el build termine (5-10 minutos)
4. ✅ Verifica el health check
5. ✅ Copia la URL de tu backend
6. ✅ Configura el frontend en Vercel con esa URL

🎉 ¡Tu backend estará listo!
