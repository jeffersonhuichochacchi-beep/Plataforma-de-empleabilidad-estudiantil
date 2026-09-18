1 -﻿spring.application.name=empleabilidad-backend
     2 -
     3 -server.port=8081
     4 -
     5 -# PostgreSQL Configuration
     6 -spring.datasource.url=jdbc:postgresql://localhost:5432/db_empleabilidad?currentSchema=public
     7 -spring.datasource.username=postgres
     8 -# IMPORTANTE: Reemplazar con la contrasena correcta
     9 -spring.datasource.password=1234
    10 -spring.datasource.driver-class-name=org.postgresql.Driver
    11 -
    12 -# JPA / Hibernate
    13 -spring.jpa.hibernate.ddl-auto=validate
    14 -spring.jpa.show-sql=true
    15 -spring.jpa.properties.hibernate.format_sql=true
    16 -spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
    17 -spring.jpa.properties.hibernate.default_schema=public
    18 -spring.jpa.properties.hibernate.hbm2ddl.create_namespaces=true
    19 -
    20 -# Configuracion conservada del servicio de usuarios
    21 -storage.local.base-path=${STORAGE_LOCAL_BASE_PATH:${java.io.tmpdir}}
    22 -storage.cv.max-size-mb=${STORAGE_CV_MAX_SIZE_MB:5}
    23 -apisperu.token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Imxlb2NyaXNwYWl0YW5AZ21haWwuY29tIn0.B1FXdA8jdiP7
        gi30QMYfKvRXq0WjWCTHA5i1fzlukug
    24 -apisperu.auth-url=https://facturacion.apisperu.com/api/v1/auth/login
    25 -apisperu.dni-url=https://dniruc.apisperu.com/api/v1/dni
    26 -apisperu.ruc-url=https://dniruc.apisperu.com/api/v1/ruc
    27 -apisperu.username=Botsito1
    28 -apisperu.password=Contreras30
    29 -
    30 -# JWT Secret
    31 -jwt.secret=my-super-secret-key-that-should-be-changed-in-production
    32 -
    33 -# Cuenta administrativa local para pruebas; desactivar en producciÃ³n.
    34 -app.admin.seed.enabled=true
    35 -app.admin.seed.email=admin@empleapro.local
    36 -app.admin.seed.password=Admin123!
    37 -
    38 -# External Services URLs
    39 -usuarios.service.url=http://localhost:8081
    40 -app.usuarios-service.url=http://localhost:8081
    41 -app.ofertas-service.url=http://localhost:8081
    42 -usuarios.service.url=http://localhost:8081
    43 -ofertas.service.url=http://localhost:8081
    44 -
    45 -# Cloudinary Configuration
    46 -cloudinary.cloud-name=fiprgfpd
    47 -cloudinary.api-key=924293376719341
    48 -cloudinary.api-secret=_ShIpCa-jNRLYumAERDsnu-vfhM
    49 -
    50 -# Google Gemini AI Configuration
    51 -gemini.api.key=AIzaSyAb8RN6JBfhX9nwtucKEwQnkpGV0TxhhshUSYrQoBt6IFXeNTcw
    52 -gemini.model=gemini-2.0-flash-exp
    53 -
    54 -# File Upload Configuration
    55 -spring.servlet.multipart.enabled=true
    56 -spring.servlet.multipart.max-file-size=10MB
    57 -spring.servlet.multipart.max-request-size=10MB
    58 -