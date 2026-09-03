# 🚀 Inicio Rápido - Sistema de Empleabilidad

## 1️⃣ Iniciar Backend (3 servicios)

Ejecutar el script batch:
```bash
cd c:\Users\Administrador\Pictures\final\Proyecto_final
start-all-services.bat
```

Esto iniciará:
- ✅ usuarios-service (puerto 8081)
- ✅ ofertas-service (puerto 8082)  
- ✅ postulaciones-service (puerto 8083)

**Esperar 30-45 segundos** hasta que todos los servicios estén listos.

---

## 2️⃣ Iniciar Frontend

```bash
cd empleabilidad-frontend
npm run dev
```

Abrir navegador en: `http://localhost:5173`

---

## 3️⃣ Crear Primera Oferta (Como Empresa)

1. **Login:** `http://localhost:5173/auth/login`
   - Usar cuenta con rol **EMPRESA** o **RECLUTADOR**

2. **Ir a:** `http://localhost:5173/empresa/ofertas`

3. **Clic en:** "Nueva Oferta"

4. **Llenar formulario:**
   ```
   Título: Desarrollador Full Stack
   Descripción: Buscamos un desarrollador...
   Área: Tecnología
   Ubicación: Lima, Perú
   Fecha vencimiento: [seleccionar fecha futura]
   Nivel: Senior
   Modalidad: Remoto
   Contrato: Tiempo Completo
   Salario mín: 3000
   Salario máx: 6000
   ```

5. **Clic en:** "Publicar Oferta"

6. ✅ **Resultado:** Toast de éxito + oferta en tabla

---

## 4️⃣ Ver Ofertas (Como Candidato)

1. **Cerrar sesión** o usar navegador incógnito

2. **Login:** `http://localhost:5173/auth/login`
   - Usar cuenta con rol **CANDIDATO**

3. **Ir a:** `http://localhost:5173/candidato/buscar`

4. ✅ **Resultado:** Ver oferta creada con toda su información

5. **Clic en oferta** para ver detalles completos

---

## 5️⃣ Buscar Ofertas

1. En `/candidato/buscar`

2. Escribir en buscador: "Full Stack"

3. Clic en "Buscar"

4. ✅ **Resultado:** Lista filtrada de ofertas

---

## 🔧 Verificación Rápida

### ¿Backend funcionando?
```bash
curl http://localhost:8082/api/ofertas
```
✅ Debería retornar JSON con ofertas

### ¿Frontend funcionando?
Abrir: `http://localhost:5173`
✅ Debería cargar la landing page

### ¿Base de datos OK?
```bash
psql -U postgres -d db_empleabilidad -c "SET search_path TO schema_ofertas; SELECT COUNT(*) FROM ofertas;"
```
✅ Debería mostrar cantidad de ofertas

---

## ❌ Solución Rápida de Problemas

### "No hay ofertas disponibles"
- Crear oferta desde `/empresa/ofertas`

### Error 500 al cargar ofertas
- Reiniciar servicio de ofertas (puerto 8082)

### Frontend no carga
```bash
cd empleabilidad-frontend
npm install
npm run dev
```

### CORS Error
- Verificar que los 3 servicios backend estén corriendo

---

## 📖 Documentación Completa

Para más detalles, ver:
- `RESUMEN_FINAL_COMPLETO.md` - Documentación completa
- `CREACION_OFERTAS_FUNCIONANDO.md` - Guía de creación
- `BUSQUEDA_CANDIDATOS_FUNCIONANDO.md` - Guía de búsqueda
- `VERIFICAR_SISTEMA.md` - Checklist y troubleshooting

---

**¡Listo! El sistema está funcionando completamente.** 🎉
