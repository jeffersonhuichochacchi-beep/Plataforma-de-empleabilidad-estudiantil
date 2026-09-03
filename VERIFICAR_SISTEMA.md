# 🔍 Verificación Rápida del Sistema

## Checklist de Verificación

### Backend Services

#### 1. Usuarios Service (Puerto 8081)
```bash
curl http://localhost:8081/api/health
```
✅ Esperado: Respuesta exitosa

#### 2. Ofertas Service (Puerto 8082)
```bash
curl http://localhost:8082/api/ofertas
```
✅ Esperado: JSON con lista de ofertas (puede estar vacía)

#### 3. Postulaciones Service (Puerto 8083)
```bash
curl http://localhost:8083/api/health
```
✅ Esperado: Respuesta exitosa

### Frontend (Puerto 5173)

```bash
# Verificar que el servidor esté corriendo
curl http://localhost:5173
```
✅ Esperado: HTML de la aplicación

### Base de Datos

```bash
# Verificar schemas
psql -U postgres -d db_empleabilidad -c "SELECT schema_name FROM information_schema.schemata WHERE schema_name LIKE 'schema_%';"
```
✅ Esperado: 
- schema_usuarios
- schema_ofertas
- schema_postulaciones

```bash
# Verificar categorías
psql -U postgres -d db_empleabilidad -c "SET search_path TO schema_ofertas; SELECT COUNT(*) FROM categorias_oferta WHERE activo = true;"
```
✅ Esperado: 10 categorías

## Flujo de Prueba Completo

### 1. Crear Oferta como Empresa

1. Navegar a `http://localhost:5173/auth/login`
2. Iniciar sesión como **EMPRESA** o **RECLUTADOR**
3. Navegar a `http://localhost:5173/empresa/ofertas`
4. Hacer clic en "Nueva Oferta"
5. Completar formulario:
   ```
   Título: Desarrollador Full Stack React & Node.js
   Descripción: Trabajo en modalidad remota...
   Área: Tecnología
   Ubicación: Lima, Perú
   Fecha vencimiento: [fecha futura]
   Nivel: Experto
   Modalidad: Remoto
   Contrato: Medio Tiempo
   Salario mín: 2000
   Salario máx: 5000
   ```
6. Hacer clic en "Publicar Oferta"
7. ✅ Verificar toast: "Oferta publicada con éxito!"
8. ✅ Verificar que aparezca en la tabla con estado "PUBLICADA"

### 2. Ver Oferta como Candidato

1. Cerrar sesión (o usar navegador en incógnito)
2. Navegar a `http://localhost:5173/auth/login`
3. Iniciar sesión como **CANDIDATO**
4. Navegar a `http://localhost:5173/candidato/buscar`
5. ✅ Verificar que aparezca la oferta creada
6. ✅ Verificar que muestre:
   - Título correcto
   - Descripción
   - Tags (Medio Tiempo, Remoto, Experto, Tecnología)
   - Salario: S/2000 - S/5000
   - Ubicación: Lima, Perú
   - Fecha publicación
7. Hacer clic en la tarjeta o botón "Ver detalles"
8. ✅ Verificar que navegue a `/empleos/{id}`

### 3. Buscar Ofertas

1. En `/candidato/buscar`
2. Escribir en buscador: "React"
3. Hacer clic en "Buscar"
4. ✅ Verificar que filtre ofertas que contengan "React"

## Problemas Comunes y Soluciones

### ❌ "No hay ofertas disponibles"

**Causa:** No hay ofertas en estado PUBLICADA en la BD

**Solución:**
```bash
# Verificar ofertas en BD
psql -U postgres -d db_empleabilidad -c "SET search_path TO schema_ofertas; SELECT id, titulo, estado FROM ofertas;"

# Si existen pero no están publicadas, actualizarlas:
# (Solo para testing, en producción usar la UI)
```

### ❌ Error 500 al cargar ofertas

**Causa:** Servicio de ofertas no está corriendo

**Solución:**
```bash
# Verificar procesos Java
Get-Process -Name "java" | Select-Object Id, StartTime

# Reiniciar servicio
cd ofertas-service\ofertas-service
./mvnw spring-boot:run
```

### ❌ Frontend no carga

**Causa:** Servidor de desarrollo no está corriendo

**Solución:**
```bash
cd empleabilidad-frontend
npm run dev
```

### ❌ CORS Error en consola

**Causa:** CORS no configurado correctamente

**Solución:**
```bash
# Verificar que CorsConfig.java tenga:
# - http://localhost:5173 en allowedOrigins
# - Métodos: GET, POST, PUT, PATCH, DELETE, OPTIONS
# - Headers: Authorization, Content-Type
# - allowCredentials: true
```

### ❌ "Usuario no autenticado" al crear oferta

**Causa:** Token JWT no válido o expirado

**Solución:**
1. Cerrar sesión
2. Volver a iniciar sesión
3. Intentar crear oferta nuevamente

### ❌ Categoría no existe

**Causa:** Categoría con ID hardcodeado no está en BD

**Solución:**
```bash
# Ejecutar seed de categorías
psql -U postgres -d db_empleabilidad -f ofertas-service/seed-categorias.sql
```

## Estados del Sistema

### ✅ Sistema Saludable

- Todos los servicios respondiendo en sus puertos
- Base de datos accesible con todos los schemas
- Frontend cargando sin errores en consola
- Ofertas se crean y publican correctamente
- Ofertas se visualizan en vista de candidato

### ⚠️ Sistema Parcialmente Funcional

- Algunos servicios no responden
- Hay errores en logs pero sistema sigue funcionando
- CORS warnings pero requests pasan

### ❌ Sistema No Funcional

- Servicios no inician
- Base de datos no conecta
- Frontend no carga
- Errores críticos en consola

## Comandos Útiles

### PowerShell (Windows)

```powershell
# Ver servicios Java corriendo
Get-Process -Name "java" | Select-Object Id, StartTime

# Verificar puerto ocupado
Test-NetConnection -ComputerName localhost -Port 8082

# Matar proceso en puerto específico
$connection = Get-NetTCPConnection -LocalPort 8082
Stop-Process -Id $connection.OwningProcess -Force

# Ver logs de PostgreSQL
Get-Content "C:\Program Files\PostgreSQL\17\data\log\*.log" -Tail 50
```

### PostgreSQL

```sql
-- Ver todas las ofertas
SET search_path TO schema_ofertas;
SELECT id, titulo, estado, fecha_creacion FROM ofertas ORDER BY fecha_creacion DESC;

-- Ver categorías
SELECT id, nombre, activo FROM categorias_oferta;

-- Estadísticas
SELECT 
  estado, 
  COUNT(*) as cantidad 
FROM ofertas 
GROUP BY estado;

-- Ofertas publicadas
SELECT COUNT(*) FROM ofertas WHERE estado = 'PUBLICADA';
```

## Logs a Revisar

### Backend (ofertas-service)
```
2026-09-03T17:22:40.293  INFO ... : Started OfertasServiceApplication
```
✅ Servicio iniciado correctamente

### Frontend (Consola del Navegador)
```
Enviando payload: {...}
Oferta creada: {...}
```
✅ Oferta creada sin errores

### PostgreSQL
```
INSERT 0 1
```
✅ Inserción exitosa

## Métricas de Rendimiento

- **Tiempo de carga de ofertas**: < 500ms
- **Tiempo de creación de oferta**: < 1s
- **Tamaño de respuesta**: ~2-5KB por oferta
- **Requests concurrentes soportados**: 100+

---

**Última actualización:** 03/09/2026  
**Versión del sistema:** 1.0.0  
**Estado esperado:** ✅ Todos los checks en verde
