
- IMPLEMENTAR CARGAR DE CV EN LA NUEVE Y GUARDAR EN NUBE Cloudinary 

- Para conectar la carga de archivos en la nube con un procesamiento automático mediante Inteligencia Artificial desde tu backend en Spring Boot, la mejor alternativa gratuita y funcional en 2026 es utilizar la API de Google Gemini mediante el modelo gemini-2.5-flash.


--- PARA LEER LOS CV CARGADOS DESDE EL PANEL DEL RECLUTADORES OSEA LA EMPRESA PUEDA LEER CON IA LOS CV  PIENSO USARS

Gemini ofrece un nivel gratuito (Free Tier) generoso con límites por minuto/día más que suficientes para pruebas, admite la lectura directa de documentos PDF nativos (sin necesidad de instalar librerías OCR pesadas para extraer texto previo) y cuenta con SDK oficial para Java.

- Detalles de la clave de API GOOGLE AI STUDIO
- Clave de API: AQ.Ab8RN6JBfhX9nwtucKEwQnkpGV0TxhhshUSYrQoBt6IFXeNTcw
Nombre: Gemini API Key CV
Nombre del proyecto: projects/101285430990
Número del proyecto : 101285430990



Opción: Cloudinary (La más sencilla con URL directa)
Plataforma enfocada en gestión de medios (imágenes y documentos).

Límite gratuito: Se maneja por créditos (aprox. 1 GB a 25 GB según el uso de ancho de banda).

Ventaja principal: Te devuelve inmediatamente una URL pública segura ([https://res.cloudinary.com/.../mi_cv.pdf](https://res.cloudinary.com/.../mi_cv.pdf)) que guardas directo en PostgreSQL.

Caso de uso ideal: Si no quieres configurar Buckets ni políticas de permisos/S3.

Claves API 
Nombre de la nube: fiprgfpd

API Key (Clave API): 924293376719341
	
API Secret: _ShIpCa-jNRLYumAERDsnu-vfhM


GUARADAR EN POSTRESS SQL SOLO LAS URL DE LOS CV SUBIDOS 


S
[ Frontend: React + TS ]
        │
        ▼ (Sube archivo multipart / form-data)
[ Backend: Spring Boot ]
        │
        ├─► 1. Sube PDF a Cloudinary / Cloudflare R2 / Supabase (Obtiene URL)
        │
        ├─► 2. Envía PDF a la API de Gemini con el Prompt de Filtrado
        │
        └─► 3. Guarda en PostgreSQL:
                - cv_url (URL pública del archivo)
                - cumple_requerimientos (BOOLEAN)
                - porcentaje_coincidencia (INTEGER)
                - resumen_ia (TEXT)



# Cloudinary Keys
cloudinary.cloud-name=TU_CLOUD_NAME
cloudinary.api-key=TU_API_KEY
cloudinary.api-secret=TU_API_SECRET

# API Key de Google Gemini (Gratis desde Google AI Studio)
gemini.api.key=TU_GEMINI_API_KEY


-------------------------------------------------

EJEMPLO DE USUOS CODIGOS:
---------------------------------------------------



Configuración en Spring Boot
1. Agregar dependencias a tu pom.xml
Para interactuar con la nube (usando Cloudinary como ejemplo de almacenamiento) y consumir la API de IA:

XML
<dependencies>
    <!-- Spring Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Cloudinary (Almacenamiento Nube) -->
    <dependency>
        <groupId>com.cloudinary</groupId>
        <artifactId>cloudinary-http44</artifactId>
        <version>1.38.0</version>
    </dependency>

    <!-- Google Gen AI SDK -->
    <dependency>
        <groupId>com.google.genai</groupId>
        <groupId>google-genai</groupId>
        <version>0.1.1</version>
    </dependency>
</dependencies>
Implementation Completa en Backend (Spring Boot)
1. DTO de respuesta estructurada para el Filtro de IA
Java
package com.sistema.empleos.dto;

public class ResultadoEvaluacionDTO {
    private boolean cumpleRequerimientos;
    private int porcentajeCoincidencia;
    private String resumenEvaluacion;
    private String habilidadesEncontradas;

    // Getters y Setters
    public boolean isCumpleRequerimientos() { return cumpleRequerimientos; }
    public void setCumpleRequerimientos(boolean cumpleRequerimientos) { this.cumpleRequerimientos = cumpleRequerimientos; }

    public int getPorcentajeCoincidencia() { return porcentajeCoincidencia; }
    public void setPorcentajeCoincidencia(int porcentajeCoincidencia) { this.porcentajeCoincidencia = porcentajeCoincidencia; }

    public String getResumenEvaluacion() { return resumenEvaluacion; }
    public void setResumenEvaluacion(String resumenEvaluacion) { this.resumenEvaluacion = resumenEvaluacion; }

    public String getHabilidadesEncontradas() { return habilidadesEncontradas; }
    public void setHabilidadesEncontradas(String habilidadesEncontradas) { this.habilidadesEncontradas = habilidadesEncontradas; }
}
2. Servicio de Almacenamiento en la Nube (CloudinaryService.java)
Java
package com.sistema.empleos.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
    }

    public String subirCv(MultipartFile file) throws IOException {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "raw",
                        "folder", "cvs_postulaciones"
                )
        );
        return uploadResult.get("secure_url").toString();
    }
}
3. Servicio de Evaluación con IA (GeminiAiService.java)
Java
package com.sistema.empleos.service;

import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.Part;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class GeminiAiService {

    private final Client client;

    public GeminiAiService(@Value("${gemini.api.key}") String apiKey) {
        // Inicializa el cliente oficial de Google Gen AI
        this.client = Client.builder().apiKey(apiKey).build();
    }

    public String evaluarCvContraPerfil(MultipartFile pdfFile, String perfilRequerido) throws IOException {
        byte[] pdfBytes = pdfFile.getBytes();

        // 1. Convertir el archivo PDF adjunto en un elemento binario compatible con la API
        Part pdfPart = Part.fromBytes(pdfBytes, "application/pdf");

        // 2. Definir el prompt pidiendo respuesta en formato JSON estricto
        String prompt = "Actúa como un reclutador experto IT. Revisa el CV en PDF adjunto y evalúalo contra el siguiente perfil requerido:\n\n"
                + "REQUISITOS DEL PUESTO:\n" + perfilRequerido + "\n\n"
                + "Responde EXCLUSIVAMENTE en formato JSON con la siguiente estructura sin bloques markdown adicional:\n"
                + "{\n"
                + "  \"cumpleRequerimientos\": true/false,\n"
                + "  \"porcentajeCoincidencia\": 0-100,\n"
                + "  \"resumenEvaluacion\": \"Breve explicación del por qué cumple o no\",\n"
                + "  \"habilidadesEncontradas\": \"Lista de tecnologías detectadas en el CV\"\n"
                + "}";

        Part textPart = Part.fromText(prompt);

        Content content = Content.builder()
                .addPart(pdfPart)
                .addPart(textPart)
                .build();

        // 3. Ejecutar la inferencia usando el modelo gemini-2.5-flash
        GenerateContentResponse response = client.models.generateContent(
                "gemini-2.5-flash",
                content,
                null
        );

        return response.text();
    }
}