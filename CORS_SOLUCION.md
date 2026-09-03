# 🔧 Solución al Problema de CORS

## ❌ Problema Detectado

Los 3 microservicios backend no tenían configuración CORS, lo que impedía que el frontend (`http://localhost:5174`) pudiera hacer peticiones a los backends.

**Error:**
```
Access to XMLHttpRequest at 'http://localhost:8081/api/consultas/ruc/...' from origin 'http://localhost:5174' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

---

## ✅ Solución Implementada

He creado la clase `CorsConfig.java` en cada uno de los 3 servicios backend:

### 1. usuarios-service (Puerto 8081)
**Archivo creado:**
```
usuarios-service/src/main/java/com/elp/usuarios_service/config/CorsConfig.java
```

### 2. ofertas-service (Puerto 8082)
**Archivo creado:**
```
ofertas-service/src/main/java/com/elp/ofertas_service/config/CorsConfig.java
```

### 3. postulaciones-service (Puerto 8083)
**Archivo creado:**
```
postulaciones-service/src/main/java/com/elp/postulaciones_service/config/CorsConfig.java
```

---

## 🔑 Configuración CORS Aplicada

La configuración permite:

✅ **Orígenes permitidos:**
- `http://localhost:5173`
- `http://localhost:5174`
- `http://localhost:3000`
- `http://localhost:4200`

✅ **Métodos HTTP:** GET, POST, PUT, DELETE, OPTIONS, PATCH

✅ **Headers:** Todos permitidos (*)

✅ **Credenciales:** Permitidas (cookies, headers de autorización)

✅ **Headers expuestos:** Authorization, Content-Type

---

## 🚀 Cómo Aplicar los Cambios

### Opción 1: Reiniciar cada servicio manualmente

#### 1. usuarios-service
```bash
cd usuarios-service/usuarios-service
mvn clean install
mvn spring-boot:run
```

#### 2. ofertas-service
```bash
cd ofertas-service/ofertas-service
mvn clean install
mvn spring-boot:run
```

#### 3. postulaciones-service
```bash
cd postulaciones-service/postulaciones-service
mvn clean install
mvn spring-boot:run
```

---

### Opción 2: Si estás usando tu IDE (IntelliJ/Eclipse/VSCode)

1. **Detener** todos los servicios en ejecución
2. **Recompilar** el proyecto (Build > Rebuild Project)
3. **Iniciar** cada servicio de nuevo

---

### Opción 3: Si usas Maven desde la raíz

Desde la carpeta raíz del proyecto:

```bash
# Compilar todos los servicios
mvn clean install -f usuarios-service/usuarios-service/pom.xml
mvn clean install -f ofertas-service/ofertas-service/pom.xml
mvn clean install -f postulaciones-service/postulaciones-service/pom.xml

# Iniciar cada servicio (en terminales separadas)
cd usuarios-service/usuarios-service && mvn spring-boot:run
cd ofertas-service/ofertas-service && mvn spring-boot:run
cd postulaciones-service/postulaciones-service && mvn spring-boot:run
```

---

## 🧪 Verificar que Funciona

Una vez que hayas reiniciado los servicios:

1. Asegúrate que los 3 servicios estén corriendo:
   - `http://localhost:8081` (usuarios-service)
   - `http://localhost:8082` (ofertas-service)
   - `http://localhost:8083` (postulaciones-service)

2. Abre el frontend: `http://localhost:5174`

3. Ve al registro y prueba:
   - **Registrar como Profesional** (con DNI)
   - **Registrar como Empresa** (con RUC)

4. Ya **NO** deberías ver el error de CORS

---

## 📝 Puertos de los Servicios

| Servicio | Puerto | URL Base |
|----------|--------|----------|
| **usuarios-service** | 8081 | http://localhost:8081/api |
| **ofertas-service** | 8082 | http://localhost:8082/api |
| **postulaciones-service** | 8083 | http://localhost:8083/api |
| **Frontend** | 5174 | http://localhost:5174 |

---

## ⚠️ Nota Importante

- El **panel admin** (`/admin`) es **independiente** del login de profesionales y empresas
- El panel admin está público sin autenticación (como configuramos)
- Los roles de **profesional** y **empresa** siguen usando el sistema de autenticación normal
- Los 3 roles son **diferentes**:
  - **Admin:** Panel administrativo
  - **Profesional (Candidato):** Buscar empleo y postular
  - **Empresa:** Publicar ofertas

---

## 🎯 Resumen

✅ Archivos CORS creados en los 3 servicios  
✅ Configuración permite frontend en puerto 5174  
✅ Todos los métodos HTTP habilitados  
✅ Headers de autorización configurados  

**Siguiente paso:** Reinicia los 3 backends y prueba el login/registro nuevamente.

---

## 🆘 Si Sigue Sin Funcionar

1. Verifica que los servicios se reiniciaron correctamente
2. Revisa los logs de cada servicio para ver si la configuración CORS se cargó
3. Verifica que los puertos 8081, 8082, 8083 estén disponibles
4. Limpia el caché del navegador (Ctrl + Shift + Delete)
5. Intenta en modo incógnito del navegador
