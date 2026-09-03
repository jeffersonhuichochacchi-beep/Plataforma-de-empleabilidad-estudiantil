# ✅ Funcionalidad de Creación de Ofertas Laborales

## Estado: FUNCIONAL ✓

La funcionalidad de creación de ofertas laborales desde el panel de empresa (`/empresa/ofertas`) está completamente operativa.

## Cambios Realizados

### 1. **Backend - Servicio de Ofertas** 
#### Problemas Identificados y Solucionados:
- ❌ **Schema de base de datos no existía** → ✅ Creado `schema_ofertas`
- ❌ **Tablas no estaban creadas** → ✅ Reiniciado servicio para que Hibernate las cree
- ❌ **No había categorías en la BD** → ✅ Insertadas 10 categorías (incluyendo Tecnología con ID fijo)
- ❌ **Faltaba configuración JWT** → ✅ Agregada clave JWT al application.properties

#### Archivos Modificados:
- `ofertas-service/src/main/resources/application.properties` - Agregada configuración JWT
- `ofertas-service/seed-categorias.sql` - Script para insertar categorías

#### Estado del Servicio:
```
✓ Puerto: 8082
✓ Base de datos: PostgreSQL - db_empleabilidad
✓ Schema: schema_ofertas
✓ Tablas creadas: 6 tablas
  - ofertas
  - categorias_oferta (10 categorías activas)
  - requisitos_oferta
  - auditoria_ofertas
  - habilidades
  - ofertas_habilidades
✓ CORS configurado correctamente
```

### 2. **Frontend - Formulario de Creación**
#### Mejoras Implementadas:
- ✅ Mejor manejo de errores con logging detallado en consola
- ✅ Valores por defecto en selectores (Nivel, Modalidad, Contrato)
- ✅ Validación de salarios (permite null si están vacíos)
- ✅ Mensajes de error más descriptivos
- ✅ Todas las opciones de enum disponibles en selectores

#### Archivo Modificado:
- `empleabilidad-frontend/src/features/jobs/components/CreateJobModal.tsx`

## Flujo de Creación de Oferta

1. **Usuario accede** a `http://localhost:5173/empresa/ofertas`
2. **Clic en "Nueva Oferta"** abre el modal de creación
3. **Completa el formulario:**
   - Título del Puesto ✓
   - Descripción ✓
   - Área Profesional ✓
   - Ubicación (opcional)
   - Fecha de vencimiento ✓
   - Nivel de experiencia (selector) ✓
   - Modalidad (selector) ✓
   - Tipo de contrato (selector) ✓
   - Salario mínimo y máximo (opcional)

4. **Al hacer clic en "Publicar Oferta":**
   - Frontend envía payload a `POST /api/ofertas?empresaId={userId}`
   - Backend crea oferta en estado `BORRADOR`
   - Frontend automáticamente publica la oferta con `PATCH /api/ofertas/{id}/publicar`
   - Oferta queda en estado `PUBLICADA` y acepta postulaciones

5. **Resultado:**
   - Toast de éxito mostrado
   - Modal se cierra
   - Lista de ofertas se actualiza automáticamente
   - Nueva oferta visible en la tabla

## Endpoints del Backend

### Ofertas (puerto 8082)
```
GET    /api/ofertas              - Listar ofertas (público)
GET    /api/ofertas/{id}          - Ver detalle (público)
POST   /api/ofertas              - Crear oferta (requiere auth EMPRESA/RECLUTADOR)
PUT    /api/ofertas/{id}          - Actualizar oferta (requiere auth)
PATCH  /api/ofertas/{id}/publicar - Publicar oferta (requiere auth)
PATCH  /api/ofertas/{id}/pausar   - Pausar oferta (requiere auth)
PATCH  /api/ofertas/{id}/cerrar   - Cerrar oferta (requiere auth)
```

### Categorías
```
GET    /api/categorias           - Listar categorías (requiere auth)
GET    /api/categorias/{id}      - Ver categoría (requiere auth)
```

## Verificación

### Backend
```bash
# Verificar servicio corriendo
curl http://localhost:8082/api/ofertas

# Verificar categorías en BD
psql -U postgres -d db_empleabilidad -c "SET search_path TO schema_ofertas; SELECT id, nombre FROM categorias_oferta;"
```

### Frontend
```bash
# Navegar a panel de empresa
http://localhost:5173/empresa/ofertas

# Iniciar sesión como empresa
# Crear nueva oferta desde el botón "Nueva Oferta"
```

## Categorías Disponibles

1. **Tecnología** (ID fijo: `6982324e-9a26-4c22-9634-fd18b5d3f0c1`) ← Usada por defecto en el formulario
2. Ventas
3. Marketing
4. Recursos Humanos
5. Finanzas
6. Administración
7. Logística
8. Salud
9. Educación
10. Otros

## Enums Soportados

### Nivel de Experiencia
- SIN_EXPERIENCIA
- PRACTICANTE
- JUNIOR
- SEMI_SENIOR
- SENIOR
- EXPERTO (por defecto en formulario)

### Modalidad
- PRESENCIAL
- REMOTO (por defecto en formulario)
- HIBRIDO

### Tipo de Contrato
- TIEMPO_COMPLETO
- MEDIO_TIEMPO (por defecto en formulario)
- FREELANCE
- TEMPORAL
- POR_PROYECTO
- PRACTICAS

### Jornada
- DIURNA (fijo en formulario)

## Debugging

Si algo falla, revisar:

1. **Consola del navegador** - logs detallados del payload y errores
2. **Logs del servicio ofertas** - terminal donde corre el servicio
3. **Base de datos** - verificar que existan registros en las tablas

```sql
-- Verificar ofertas creadas
SET search_path TO schema_ofertas;
SELECT id, titulo, estado, fecha_creacion FROM ofertas ORDER BY fecha_creacion DESC LIMIT 5;

-- Verificar categorías
SELECT COUNT(*) FROM categorias_oferta WHERE activo = true;
```

## Próximos Pasos (Opcional)

- [ ] Agregar selector dinámico de categorías (fetch desde API)
- [ ] Agregar gestión de requisitos en el formulario
- [ ] Implementar edición de ofertas existentes
- [ ] Agregar vista detalle de oferta
- [ ] Implementar cambios de estado (pausar, cerrar) desde la tabla

---

**Fecha:** 03/09/2026  
**Estado:** ✅ Completamente funcional  
**Probado:** ✓ Backend y Frontend integrados
