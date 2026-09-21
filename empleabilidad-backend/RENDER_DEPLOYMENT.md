# 🚀 Guía de Despliegue Backend en Render

## 🔧 Configuración en Render

### ⚠️ CORRECCIÓN IMPORTANTE
En la captura que compartiste, seleccionaste **Node** como lenguaje. Tu backend es **Java/Spring Boot**, así que necesitas cambiar esto.

### 1. **Información Básica**

- **Name**: `Plataforma-de-empleabilidad-estudiantil`
- **Project**: `empleabilidad-backend` (opcional, lo puedes agregar después)
- **Language**: ❌ ~~Node~~ → ✅ **Docker** (Recomendado) o **Java**
- **Branch**: `main`
- **Region**: `Ohio (US East)` (o la región más cercana a tus usuarios)

### 2. **Root Directory** ⚠️ IMPORTANTE

Haz clic en el campo **Root Directory** y establece:
```
empleabilidad-backend
```

### 3. **Build Command**

Si eliges **Docker** (Recomendado):
```bash
# Render detectará automáticamente el Dockerfile
```

Si eliges **Java**:
```bash
./mvnw clean install -DskipTests
```

### 4. **Start Command**

Si eliges **Docker**:
```bash
# Render usará el ENTRYPOINT del Dockerfile automáticamente
```

Si eliges **Java**:
```bash
java -Dserver.port=$PORT -jar target/empleabilidad-backend-0.0.1-SNAPSHOT.jar
```

### 5. **Environment Variables** 🔑

⚠️ **CRÍTICO**: Debes agregar todas estas variables de entorno. Haz clic en "Advanced" para expandir la sección de variables de entorno.

#### Variables Obligatorias:

| Name | Value | Nota |
|------|-------|------|
| `SERVER_PORT` | `8080` | Puerto que Render asigna |
| `JPA_SHOW_SQL` | `false` | Reduce logs en producción |
| **Database (Supabase)** | | |
| `SUPABASE_DB_URL` | `jdbc:postgresql://aws-0-us-west-2.pooler.supabase.com:5432/postgres?currentSchema=public` | Tu URL de Supabase |
| `SUPABASE_DB_USER` | `postgres.mdayyjszoesorvlymiqv` | Tu usuario de Supabase |
| `SUPABASE_DB_PASSWORD` | `tu-password-real` | ⚠️ Usa tu password real |
| **Supabase Auth** | | |
| `SUPABASE_URL` | `https://mdayyjszoesorvlymiqv.supabase.co` | Tu proyecto Supabase |
| `SUPABASE_ANON_KEY` | `tu-anon-key` | Clave pública |
| `SUPABASE_SERVICE_ROLE_KEY` | `tu-service-role-key` | ⚠️ Clave secreta |
| `SUPABASE_ISSUER` | `https://mdayyjszoesorvlymiqv.supabase.co/auth/v1` | Issuer JWT |
| **Cloudinary** | | |
| `CLOUDINARY_CLOUD_NAME` | `fiprgfpd` | Tu cloud name |
| `CLOUDINARY_API_KEY` | `924293376719341` | Tu API key |
| `CLOUDINARY_API_SECRET` | `tu-api-secret` | ⚠️ Tu secret real |
| **Gemini AI** | | |
| `GEMINI_API_KEY` | `tu-gemini-key` | ⚠️ Tu key real |
| `GEMINI_MODEL` | `gemini-2.0-flash-exp` | Modelo a usar |
| **APIs Peru** | | |
| `APISPERU_TOKEN` | `tu-token` | Token de APIs Peru |
| `APISPERU_USERNAME` | `Botsito1` | Tu usuario |
| `APISPERU_PASSWORD` | `tu-password` | ⚠️ Tu password real |
| **CORS (Importante para Vercel)** | | |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,https://plataforma-de-empleabilidad-estudiantil.vercel.app` | URLs permitidas separadas por coma |

#### Variables Opcionales:

| Name | Value | Descripción |
|------|-------|-------------|
| `JAVA_TOOL_OPTIONS` | `-Xmx512m -Xms256m` | Límites de memoria para el plan gratuito |
| `STORAGE_LOCAL_BASE_PATH` | `/tmp` | Path temporal en Render |
| `STORAGE_CV_MAX_SIZE_MB` | `5` | Tamaño máximo de CVs |

---

## 📋 Pasos Detallados para Render

### Opción A: Usando Docker (Recomendado) 🐳

1. **New Web Service** en Render
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Name**: `Plataforma-de-empleabilidad-estudiantil`
   - **Root Directory**: `empleabilidad-backend`
   - **Environment**: `Docker`
   - **Instance Type**: `Free`
4. Agrega todas las variables de entorno listadas arriba
5. Click en **Create Web Service**

### Opción B: Usando Java Native

1. **New Web Service** en Render
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Name**: `Plataforma-de-empleabilidad-estudiantil`
   - **Root Directory**: `empleabilidad-backend`
   - **Environment**: `Java`
   - **Build Command**: `./mvnw clean install -DskipTests`
   - **Start Command**: `java -Dserver.port=$PORT -jar target/empleabilidad-backend-0.0.1-SNAPSHOT.jar`
4. Agrega todas las variables de entorno
5. Click en **Create Web Service**

---

## 🔍 Verificación Post-Despliegue

### 1. **Health Check**
Una vez desplegado, verifica que el health check esté funcionando:
```
https://tu-app.onrender.com/actuator/health
```

Deberías ver:
```json
{
  "status": "UP"
}
```

### 2. **Swagger UI**
Verifica la documentación de la API:
```
https://tu-app.onrender.com/swagger-ui/index.html
```

### 3. **Test de Endpoints**
Prueba algunos endpoints públicos:
```bash
# Listar ofertas públicas
curl https://tu-app.onrender.com/api/ofertas/publicas

# Health check
curl https://tu-app.onrender.com/actuator/health
```

---

## 🌐 Actualizar Frontend con la URL del Backend

Una vez desplegado tu backend en Render, obtendrás una URL como:
```
https://plataforma-de-empleabilidad-estudiantil.onrender.com
```

**Actualiza la variable de entorno en Vercel:**

1. Ve a tu proyecto en Vercel
2. Settings > Environment Variables
3. Edita `VITE_API_URL` y establece:
   ```
   https://tu-app.onrender.com/api
   ```
4. Redespliegua tu frontend (Vercel lo hará automáticamente)

---

## ⚠️ Limitaciones del Plan Gratuito de Render

### 1. **Hibernación (Sleep)**
- Tu servicio se dormirá después de **15 minutos de inactividad**
- La primera petición después de dormir puede tardar **30-60 segundos**
- Solución temporal: Usar un servicio como [UptimeRobot](https://uptimerobot.com/) para hacer ping cada 10 minutos

### 2. **Memoria y CPU Limitadas**
- 512 MB de RAM
- CPU compartida
- Por eso configuramos `JAVA_TOOL_OPTIONS=-Xmx512m -Xms256m`

### 3. **Build Time**
- El build inicial puede tardar 5-10 minutos
- Los rebuilds son más rápidos gracias al cache

---

## 🐛 Solución de Problemas Comunes

### Build Falla

**Error: Maven no encuentra dependencias**
```bash
# Verifica que ./mvnw tenga permisos de ejecución
chmod +x mvnw
git add mvnw
git commit -m "fix: add execute permission to mvnw"
git push
```

**Error: Java version mismatch**
```bash
# Verifica que Render use Java 21
# En Render Dashboard > Environment > Environment Variables
# Agrega: JAVA_VERSION=21
```

### Application No Inicia

**Error: Port binding**
- Asegúrate de usar `SERVER_PORT=$PORT` o `server.port=${SERVER_PORT:8080}`
- Render asigna el puerto dinámicamente a través de la variable `$PORT`

**Error: Database connection**
- Verifica que las credenciales de Supabase sean correctas
- Verifica que la URL de la base de datos incluya `?currentSchema=public`
- Verifica que Supabase permita conexiones desde Render

### CORS Errors

Si ves errores de CORS desde tu frontend:

1. Verifica que `CORS_ALLOWED_ORIGINS` incluya tu dominio de Vercel
2. Formato correcto: `http://localhost:5173,https://tu-app.vercel.app`
3. Sin espacios entre las URLs
4. Sin barra final en las URLs

### Health Check Falla

Si Render marca tu servicio como "unhealthy":

1. Verifica que `/actuator/health` responda correctamente
2. Ve a Logs en Render y busca errores
3. Puede que necesites aumentar el timeout del health check

---

## 🔐 Seguridad

### Variables Sensibles
⚠️ **NUNCA** subas al repositorio:
- Passwords de base de datos
- API keys
- Service role keys
- Tokens de autenticación

### .gitignore
Asegúrate de que `.env` esté en tu `.gitignore`:
```
.env
.env.local
.env.production
```

### Rotación de Credenciales
Si accidentalmente expones credenciales:
1. Rota inmediatamente en el servicio correspondiente (Supabase, Cloudinary, etc.)
2. Actualiza las variables de entorno en Render
3. Redespliegua

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

Aquí puedes ver:
- CPU usage
- Memory usage
- Request latency
- Request count

---

## 🚀 Mejoras Futuras

### Upgrade a Plan Pago
Si tu aplicación crece, considera:
- **Starter Plan ($7/mes)**: Sin hibernación, más recursos
- **Standard Plan ($25/mes)**: Más CPU y RAM, mejor performance

### Base de Datos Dedicada
Considera migrar de Supabase Pooler a:
- Render PostgreSQL (managed)
- AWS RDS
- Railway PostgreSQL

### CDN y Caching
Configura Cloudflare frente a Render para:
- Mejor performance global
- DDoS protection
- SSL/TLS gratuito

---

## ✅ Checklist Final

Antes de marcar como completo, verifica:

- [ ] Root Directory configurado a `empleabilidad-backend`
- [ ] Todas las variables de entorno agregadas correctamente
- [ ] Build exitoso en Render
- [ ] Health check responde: `/actuator/health`
- [ ] Swagger UI accesible: `/swagger-ui/index.html`
- [ ] Base de datos conectada correctamente
- [ ] CORS configurado con dominio de Vercel
- [ ] Frontend actualizado con la URL del backend
- [ ] Login funciona desde el frontend
- [ ] No hay errores en los logs de Render

---

## 📞 Recursos Adicionales

- [Documentación oficial de Render](https://render.com/docs)
- [Render + Spring Boot Guide](https://render.com/docs/deploy-spring-boot)
- [Supabase + External Clients](https://supabase.com/docs/guides/database/connecting-to-postgres)

¡Tu backend está listo para producción! 🎉
