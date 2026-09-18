Hola. Necesito reorganizar la arquitectura backend de mi proyecto sin cambiar su funcionalidad actual.

## CONTEXTO DEL PROYECTO

Tengo un proyecto principal ubicado en:

C:\Users\Administrador\Pictures\final\Proyecto_final

Actualmente tengo:

### Frontend
- empleabilidad-frontend

### Backends independientes
- ofertas-service
- postulaciones-service
- usuarios-service

Los tres backends son proyectos independientes desarrollados con Spring Boot y actualmente funcionan correctamente. Los tres se conectan y trabajan con mi frontend `empleabilidad-frontend`.

Actualmente debo iniciar cada backend por separado utilizando:

.\mvnw.cmd spring-boot:run

Quiero cambiar esta arquitectura para tener UN SOLO proyecto backend.

## OBJETIVO PRINCIPAL

Quiero que los tres backends:

- ofertas-service
- postulaciones-service
- usuarios-service

se integren dentro de un único proyecto llamado:

C:\Users\Administrador\Pictures\final\Proyecto_final\empleabilidad-backend

El objetivo es que desde `empleabilidad-backend` pueda ejecutar solamente:

.\mvnw.cmd spring-boot:run

y que con ese único comando se levanten los tres servicios/módulos:

- Ofertas
- Postulaciones
- Usuarios

No quiero tener que ejecutar tres comandos diferentes.

## IMPORTANTE: CONSERVAR LA FUNCIONALIDAD

Los tres backends actuales YA SON FUNCIONALES.

Por lo tanto, la migración debe ser conservadora.

NO quiero que se modifique innecesariamente:

- La lógica de negocio.
- Los endpoints existentes.
- Los nombres de los endpoints.
- Los métodos HTTP.
- Las entidades.
- Los DTO.
- Los repositorios.
- Los servicios.
- Los controladores.
- Las configuraciones importantes.
- La comunicación actual con el frontend.
- Las respuestas JSON.
- La conexión con la base de datos.
- Las funcionalidades que actualmente ya funcionan.

El frontend `empleabilidad-frontend` debe seguir funcionando exactamente igual después de la migración.

## FORMA DE REALIZAR LA MIGRACIÓN

Quiero convertir los tres proyectos Spring Boot independientes en un único proyecto backend organizado correctamente.

La estructura puede organizarse mediante paquetes/carpetas, por ejemplo:

empleabilidad-backend/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── ...
│   │   └── resources/
│   │
│   └── test/
│
├── .mvn/
├── mvnw
├── mvnw.cmd
├── pom.xml
└── ...

Dentro del código Java quiero mantener una organización clara para cada funcionalidad:

- ofertas
- postulaciones
- usuarios

Por ejemplo, si es necesario:

com.proyecto.empleabilidad.ofertas
com.proyecto.empleabilidad.postulaciones
com.proyecto.empleabilidad.usuarios

o una estructura equivalente que sea técnicamente correcta.

## SOBRE LOS ARCHIVOS

Para ahorrar tiempo, si es técnicamente seguro, puedes reutilizar/copiarlos/moverlos desde los tres proyectos actuales hacia `empleabilidad-backend`.

Principalmente quiero reutilizar el código Java existente en lugar de reescribirlo desde cero.

Sin embargo, NO copies archivos de forma ciega.

Antes de mover o copiar algo, revisa:

- package de cada clase.
- imports.
- dependencias Maven.
- application.properties / application.yml.
- configuración de Spring Boot.
- clases principales `@SpringBootApplication`.
- configuración de bases de datos.
- puertos.
- CORS.
- variables de entorno.
- configuraciones de seguridad.
- configuraciones de JWT si existen.
- conexiones entre servicios.
- rutas/endpoints.
- dependencias duplicadas.
- beans duplicados.
- nombres de componentes.
- cualquier conflicto que pueda aparecer al juntar los tres proyectos.

## POM.XML

Quiero que `empleabilidad-backend` tenga un único `pom.xml` principal.

Debes revisar los `pom.xml` actuales de:

- ofertas-service
- postulaciones-service
- usuarios-service

y consolidar sus dependencias en el nuevo `pom.xml`.

No agregues dependencias innecesarias.

Si existen versiones diferentes de una misma dependencia, determina cuál debe utilizarse para evitar conflictos.

## CLASE PRINCIPAL DE SPRING BOOT

Quiero que `empleabilidad-backend` tenga una única clase principal de Spring Boot con:

@SpringBootApplication

Esta clase debe ser capaz de detectar correctamente los controladores, servicios, repositorios y componentes de los tres módulos.

Si actualmente existen tres clases `@SpringBootApplication`, analiza si deben eliminarse, modificarse o convertirse en clases de configuración para evitar múltiples contextos Spring innecesarios.

## CONFIGURACIÓN

Debes revisar y consolidar correctamente las configuraciones actuales.

Especialmente:

- `application.properties`
- `application.yml`
- configuración de base de datos
- puertos
- CORS
- seguridad
- JWT
- variables de entorno
- configuración de Spring
- archivos SQL
- configuración de Hibernate/JPA

Si los tres proyectos utilizan diferentes bases de datos o diferentes configuraciones, NO las combines de forma incorrecta.

Mantén el comportamiento actual.

## BASE DE DATOS

Los tres backends actualmente funcionan con sus respectivas configuraciones de base de datos.

No quiero que se eliminen tablas, datos ni configuraciones existentes.

Si existe algún archivo como:

`seed-categorias.sql`

debe analizarse y mantenerse si actualmente es necesario para el funcionamiento.

## PUERTOS

Actualmente cada backend puede tener su propio puerto.

Al convertirlos en una sola aplicación Spring Boot, analiza los puertos actuales.

Como ahora habrá una única aplicación, determina cómo mantener funcionando correctamente el frontend y los endpoints.

Si es necesario cambiar alguna URL o configuración del frontend debido a la consolidación, indícalo explícitamente y modifica solamente lo estrictamente necesario.

## RESULTADO ESPERADO

Al finalizar quiero tener:

C:\Users\Administrador\Pictures\final\Proyecto_final\empleabilidad-backend

como ÚNICO proyecto backend.

Desde esa carpeta quiero ejecutar:

.\mvnw.cmd spring-boot:run

y que se inicie todo el backend:

- módulo de ofertas
- módulo de postulaciones
- módulo de usuarios

No quiero ejecutar:

.\mvnw.cmd spring-boot:run

en tres carpetas diferentes.

## MUY IMPORTANTE

No hagas una reescritura completa del proyecto.

Quiero una MIGRACIÓN / CONSOLIDACIÓN del código existente.

Prioriza:

1. Reutilizar el código actual.
2. Mantener la funcionalidad existente.
3. Mantener compatibilidad con el frontend.
4. Evitar cambios innecesarios.
5. Evitar eliminar funcionalidades.
6. Evitar cambiar endpoints sin necesidad.
7. Evitar cambios en la base de datos.
8. Mantener una estructura limpia y organizada.

## ANTES DE MODIFICAR

Primero analiza los tres proyectos actuales:

- ofertas-service
- postulaciones-service
- usuarios-service

Identifica:

- estructura de carpetas
- packages
- clases principales
- dependencias
- configuraciones
- endpoints
- bases de datos
- puertos
- comunicación entre servicios
- posibles conflictos

Después propón la estructura final de `empleabilidad-backend`.

NO realices cambios destructivos sin indicarlo primero.

Si encuentras algo que pueda romper la funcionalidad actual, detente y explícame el problema antes de eliminarlo o modificarlo.

## VERIFICACIÓN FINAL

Después de realizar la migración, verifica que:

1. `.\mvnw.cmd spring-boot:run` funciona desde `empleabilidad-backend`.
2. Spring Boot inicia correctamente.
3. No existen errores de beans duplicados.
4. No existen errores de packages/imports.
5. No existen conflictos de dependencias Maven.
6. Los controladores de ofertas funcionan.
7. Los controladores de postulaciones funcionan.
8. Los controladores de usuarios funcionan.
9. Las conexiones a las bases de datos funcionan.
10. El frontend `empleabilidad-frontend` puede seguir consumiendo los endpoints.
11. Las funcionalidades existentes siguen funcionando.

Si alguna prueba no puede realizarse automáticamente, indícame exactamente qué debo ejecutar para comprobarla.

## REGLA PRINCIPAL

El resultado final debe ser funcionalmente equivalente a los tres backends actuales, pero administrado como UN SOLO proyecto Spring Boot.

Actualmente:

ofertas-service       → ejecutar por separado
postulaciones-service → ejecutar por separado
usuarios-service      → ejecutar por separado

Quiero:

empleabilidad-backend → UN SOLO `.\mvnw.cmd spring-boot:run`

No quiero perder ninguna funcionalidad existente.