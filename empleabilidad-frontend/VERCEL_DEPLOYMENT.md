# 🚀 Guía de Despliegue en Vercel

## 📋 Configuración en Vercel

### 1. **Información del Proyecto**
- **Vercel Team**: Diamantes (Hobby)
- **Project Name**: plataforma-de-empleabilidad-estudiantil
- **Repository**: jeffersonhuichochaochi-beep/Plataforma-de-empleabilidad-estudiantil
- **Branch**: main

### 2. **Application Preset**
Selecciona: **Create React App**

### 3. **Root Directory**
⚠️ **IMPORTANTE**: Haz clic en "Edit" y establece:
```
empleabilidad-frontend
```

### 4. **Build and Output Settings**
Ya están configurados automáticamente en `vercel.json`, pero si necesitas verificar:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 5. **Environment Variables** 🔑
⚠️ **CRÍTICO**: Debes agregar esta variable de entorno:

| Name | Value |
|------|-------|
| `VITE_API_URL` | URL de tu backend en producción |

**Ejemplos de valores para `VITE_API_URL`:**
- Si tu backend está en Railway: `https://tu-backend.railway.app/api`
- Si tu backend está en Render: `https://tu-backend.onrender.com/api`
- Si tu backend está en otro servidor: `https://tu-dominio.com/api`

**Cómo agregar la variable:**
1. Ve a la sección "Environment Variables"
2. Click en "Add New"
3. Name: `VITE_API_URL`
4. Value: Tu URL del backend (sin barra final)
5. Asegúrate de que esté disponible para todos los entornos (Production, Preview, Development)

### 6. **Deploy**
Una vez configurado todo, haz clic en el botón **"Deploy"**

---

## 🔧 Verificación Post-Despliegue

Después de que el despliegue sea exitoso:

1. **Verifica la conexión con el backend**:
   - Abre las DevTools del navegador (F12)
   - Ve a la pestaña Network
   - Intenta hacer login o cualquier acción que llame al backend
   - Verifica que las peticiones vayan a la URL correcta

2. **Verifica los errores de CORS**:
   - Si ves errores de CORS, necesitas configurar tu backend para permitir el dominio de Vercel
   - En tu backend Spring Boot, agrega el dominio de Vercel a la configuración de CORS

3. **Revisa los logs**:
   - En Vercel, ve a tu proyecto > Deployments > [tu despliegue] > View Function Logs
   - Busca cualquier error en tiempo de build o runtime

---

## 🔄 Redespliegues Automáticos

Vercel redesplegará automáticamente tu aplicación cuando:
- Hagas push a la rama `main` en GitHub
- Crees un Pull Request (creará un preview deployment)

---

## 🌐 Dominio Personalizado (Opcional)

Si quieres usar un dominio personalizado:
1. Ve a tu proyecto en Vercel
2. Settings > Domains
3. Add Domain
4. Sigue las instrucciones para configurar los DNS

---

## ⚙️ Configuración de CORS en el Backend

Para que tu frontend en Vercel pueda comunicarse con tu backend, necesitas agregar el dominio de Vercel a la configuración de CORS en tu backend Spring Boot:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "http://localhost:5173",
                    "https://tu-app.vercel.app",
                    "https://tu-dominio-personalizado.com"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

---

## 🐛 Solución de Problemas Comunes

### Error 404 en rutas
✅ Ya configurado en `vercel.json` con rewrites para SPA

### Variables de entorno no funcionan
- Verifica que empiecen con `VITE_`
- Redesprende el proyecto después de agregar variables
- Verifica que uses `import.meta.env.VITE_API_URL` en el código

### Build falla
- Verifica que `package.json` tenga las dependencias correctas
- Asegúrate de que el código compile localmente con `npm run build`
- Revisa los logs de build en Vercel

### Backend no responde
- Verifica que `VITE_API_URL` sea correcta
- Verifica que el backend esté funcionando
- Verifica la configuración de CORS en el backend

---

## 📝 Notas Adicionales

- **TypeScript**: El proyecto usa TypeScript 6.0.2, asegúrate de que compile sin errores
- **React Router**: Configurado con rewrites para funcionar correctamente
- **Vite**: Framework moderno que optimiza automáticamente el build
- **Variables de entorno**: Solo las que empiezan con `VITE_` son accesibles en el cliente

---

## ✅ Checklist Final

- [ ] Root Directory configurado a `empleabilidad-frontend`
- [ ] Variable `VITE_API_URL` agregada con la URL correcta del backend
- [ ] Backend configurado para aceptar peticiones desde Vercel (CORS)
- [ ] Build exitoso en Vercel
- [ ] Login funciona correctamente
- [ ] Todas las peticiones al backend funcionan
- [ ] No hay errores en la consola del navegador

¡Tu aplicación debería estar lista para usar! 🎉
