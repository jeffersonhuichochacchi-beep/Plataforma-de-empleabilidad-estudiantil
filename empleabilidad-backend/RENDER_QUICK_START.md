# 🚀 Render - Guía Rápida de Configuración

## ⚡ Configuración Rápida

### 1️⃣ Información Básica
```
Name: Plataforma-de-empleabilidad-estudiantil
Language: Docker (o Java)
Branch: main
Region: Ohio (US East)
```

### 2️⃣ Root Directory ⚠️
```
empleabilidad-backend
```
**¡NO olvides hacer clic en "Edit" y agregarlo!**

### 3️⃣ Build & Start Commands

**Si eliges Docker:**
- Build: (automático)
- Start: (automático)

**Si eliges Java:**
- Build: `./mvnw clean install -DskipTests`
- Start: `java -Dserver.port=$PORT -jar target/empleabilidad-backend-0.0.1-SNAPSHOT.jar`

### 4️⃣ Variables de Entorno (Copiar y Pegar)

```env
SERVER_PORT=8080
JPA_SHOW_SQL=false

# Database
SUPABASE_DB_URL=jdbc:postgresql://aws-0-us-west-2.pooler.supabase.com:5432/postgres?currentSchema=public
SUPABASE_DB_USER=postgres.mdayyjszoesorvlymiqv
SUPABASE_DB_PASSWORD=TU_PASSWORD_REAL_AQUI

# Supabase Auth
SUPABASE_URL=https://mdayyjszoesorvlymiqv.supabase.co
SUPABASE_ANON_KEY=TU_ANON_KEY_AQUI
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY_AQUI
SUPABASE_ISSUER=https://mdayyjszoesorvlymiqv.supabase.co/auth/v1

# Cloudinary
CLOUDINARY_CLOUD_NAME=fiprgfpd
CLOUDINARY_API_KEY=924293376719341
CLOUDINARY_API_SECRET=TU_API_SECRET_AQUI

# Gemini AI
GEMINI_API_KEY=TU_GEMINI_KEY_AQUI
GEMINI_MODEL=gemini-2.0-flash-exp

# APIs Peru
APISPERU_TOKEN=TU_TOKEN_AQUI
APISPERU_USERNAME=Botsito1
APISPERU_PASSWORD=TU_PASSWORD_AQUI

# CORS - Actualiza con tu dominio de Vercel
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://plataforma-de-empleabilidad-estudiantil.vercel.app

# Opcional
JAVA_TOOL_OPTIONS=-Xmx512m -Xms256m
```

### 5️⃣ Después del Despliegue

1. **Obtén la URL de tu backend:**
   ```
   https://plataforma-de-empleabilidad-estudiantil.onrender.com
   ```

2. **Actualiza Vercel:**
   - Ve a tu proyecto en Vercel
   - Settings > Environment Variables
   - Edita `VITE_API_URL`
   - Valor: `https://tu-app.onrender.com/api`
   - Guarda y redespliegua

3. **Verifica que funcione:**
   - Health: `https://tu-app.onrender.com/actuator/health`
   - Swagger: `https://tu-app.onrender.com/swagger-ui/index.html`

---

## ⚠️ IMPORTANTE: Error Común

❌ **NO selecciones "Node" como lenguaje** (como en tu captura)
✅ **Selecciona "Docker" o "Java"**

---

## 📞 ¿Problemas?

Lee el archivo completo: `RENDER_DEPLOYMENT.md`
