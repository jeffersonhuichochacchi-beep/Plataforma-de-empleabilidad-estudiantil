# 🔧 Fix: Consulta de RUC y DNI (manejo de errores)

## ❌ Problema

La consulta de RUC/DNI en el registro (`/auth/register`) mostrada como **503 (Servidor no disponible)** para todos los RUC, incluso los que existen en SUNAT.

**Error reportado:**
```
Failed to load resource: the server responded with a status of 503 ()
http://localhost:8081/api/consultas/ruc/20552103816
/ruc/20481321596, /dni/20481321, etc → 503
```

## 🔍 Causa raíz

El error NO es un bug del proyecto. Proviene del **proveedor externo APIsPerú** (dniruc.apisperu.com):

1. La **cuenta gratuita** de apisperu **solo permite consultar 2 documentos de demostración**:
   - RUC: `20131312955` (SUNAT) ✅
   - DNI: `12345678` ✅

2. Cualquier **otro RUC/DNI** (aunque exista en SUNAT real) devuelve:
   - **`401`** cuando el plan rechaza la consulta (sin créditos / no cubierto), o
   - **`200` con `success:false`** ("No se encontraron resultados")

3. Antes, el backend capturaba cualquier error y lo devolvía como **503**, con un mensaje genérico que confundía al usuario.

## ✅ Solución Aplicada

Se mejoró el **manejo de errores** para distinguir los casos y dar respuestas claras:

### Backend (`usuarios-service`)

**Archivos nuevos:**
```
src/main/java/com/elp/usuarios_service/exception/DocumentoNoEncontradoException.java
src/main/java/com/elp/usuarios_service/exception/ConsultaProveedorException.java
```

**Modificados:**
```
src/main/java/com/elp/usuarios_service/service/ConsultaDocumentoService.java
src/main/java/com/elp/usuarios_service/controller/ConsultaDocumentoController.java
```

### Nuevos códigos de respuesta

| Situación | Código HTTP | Mensaje |
|-----------|-------------|---------|
| ✅ Documento encontrado | `200` | Datos completos |
| ❌ Documento no existe en el servicio | `404` | "No se encontraron resultados..." |
| ⚠️ Token/créditos/proveedor rechaza | `502` | "El servicio de consultas rechazó la petición (token inválido, créditos agotados o documento no disponible). Revisa tu cuenta en apisperu.com" |
| ⚠️ Otro error del proveedor | `502` | "El servicio de consultas no está disponible..." |
| ❌ Validación (formato inválido) | `400` | Mensaje de formato |

### Frontend (`empleabilidad-frontend`)

**Modificado:**
```
src/features/auth/views/RegisterView.tsx
```

Ahora muestra mensajes claros según el código (404 = no encontrado, 502 = problema del proveedor) y permite **ingresar los datos manualmente** si la consulta falla.

## 🚀 Cómo Reiniciar

El servicio ya fue recompilado (BUILD SUCCESS). Reinicia el backend:

```bash
# En la carpeta raíz, o reinicia la terminal del servicio:
cd usuarios-service/usuarios-service
mvn spring-boot:run
```

## 🧪 Qué Esperar al Probar

- **RUC demo `20131312955`** → devuelve datos de SUNAT ✅
- **RUC real no cubierto por el plan gratuito** → mensaje claro (404/502), ya no 503 confuso
- Para consultar RUC/DNI reales necesitas **comprar créditos** en https://apisperu.com
