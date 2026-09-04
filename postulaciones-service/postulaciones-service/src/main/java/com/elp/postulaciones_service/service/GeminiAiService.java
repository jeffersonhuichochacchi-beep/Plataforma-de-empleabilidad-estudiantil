package com.elp.postulaciones_service.service;

import com.elp.postulaciones_service.dto.ResultadoEvaluacionDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.concurrent.TimeUnit;

/**
 * Servicio para evaluar CVs usando Google Gemini AI
 */
@Service
@Slf4j
public class GeminiAiService {

    private final String apiKey;
    private final String model;
    private final OkHttpClient httpClient;
    private final ObjectMapper objectMapper;

    public GeminiAiService(
            @Value("${gemini.api.key}") String apiKey,
            @Value("${gemini.model}") String model) {
        this.apiKey = apiKey;
        this.model = model;
        this.objectMapper = new ObjectMapper();
        
        // Cliente HTTP con timeout mayor para procesamiento de PDFs
        this.httpClient = new OkHttpClient.Builder()
                .connectTimeout(60, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .writeTimeout(60, TimeUnit.SECONDS)
                .build();
        
        log.info("GeminiAiService inicializado con modelo: {}", model);
    }

    /**
     * Evalúa un CV contra el perfil requerido de una oferta usando Google Gemini AI
     * 
     * @param pdfFile Archivo PDF del CV
     * @param perfilRequerido Descripción de requisitos de la oferta
     * @return ResultadoEvaluacionDTO con la evaluación estructurada
     * @throws IOException Si hay error en la comunicación con la API
     */
    public ResultadoEvaluacionDTO evaluarCvContraPerfil(MultipartFile pdfFile, String perfilRequerido) 
            throws IOException {
        
        log.info("Iniciando evaluación de CV con Gemini AI. Archivo: {}, Tamaño perfil: {} caracteres", 
                pdfFile.getOriginalFilename(), perfilRequerido.length());
        
        try {
            // 1. Convertir PDF a Base64
            byte[] pdfBytes = pdfFile.getBytes();
            String pdfBase64 = Base64.getEncoder().encodeToString(pdfBytes);
            
            // 2. Construir el prompt para la IA
            String prompt = construirPromptEvaluacion(perfilRequerido);
            
            // 3. Construir el body de la petición JSON
            String requestBody = construirRequestBody(prompt, pdfBase64, pdfFile.getContentType());
            
            // 4. Llamar a la API de Gemini
            String responseJson = llamarGeminiApi(requestBody);
            
            // 5. Parsear y retornar la respuesta
            ResultadoEvaluacionDTO resultado = parsearRespuestaGemini(responseJson);
            
            log.info("Evaluación completada. Cumple requerimientos: {}, Porcentaje: {}%", 
                    resultado.isCumpleRequerimientos(), resultado.getPorcentajeCoincidencia());
            
            return resultado;
            
        } catch (Exception e) {
            log.error("Error al evaluar CV con Gemini AI: {}", e.getMessage(), e);
            
            // Retornar resultado por defecto en caso de error
            return ResultadoEvaluacionDTO.builder()
                    .cumpleRequerimientos(false)
                    .porcentajeCoincidencia(0)
                    .resumenEvaluacion("Error al evaluar el CV con IA: " + e.getMessage())
                    .habilidadesEncontradas("No disponible")
                    .build();
        }
    }

    /**
     * Construye el prompt optimizado para la evaluación
     */
    private String construirPromptEvaluacion(String perfilRequerido) {
        return """
                Actúa como un reclutador experto en tecnología. Revisa el CV en PDF adjunto y evalúalo contra el siguiente perfil requerido:
                
                REQUISITOS DEL PUESTO:
                %s
                
                Responde EXCLUSIVAMENTE en formato JSON válido sin bloques markdown ni texto adicional. Usa exactamente esta estructura:
                {
                  "cumpleRequerimientos": true o false,
                  "porcentajeCoincidencia": número entre 0 y 100,
                  "resumenEvaluacion": "Breve explicación del por qué cumple o no (máximo 300 caracteres)",
                  "habilidadesEncontradas": "Lista de tecnologías y habilidades clave detectadas en el CV"
                }
                
                IMPORTANTE: Responde SOLO con el JSON, sin texto antes ni después.
                """.formatted(perfilRequerido);
    }

    /**
     * Construye el body JSON para la API de Gemini
     */
    private String construirRequestBody(String prompt, String pdfBase64, String mimeType) throws IOException {
        // Ajustar mimeType si es necesario
        if (mimeType == null || mimeType.isEmpty()) {
            mimeType = "application/pdf";
        }
        
        String jsonBody = """
                {
                  "contents": [{
                    "parts": [
                      {
                        "inline_data": {
                          "mime_type": "%s",
                          "data": "%s"
                        }
                      },
                      {
                        "text": "%s"
                      }
                    ]
                  }],
                  "generationConfig": {
                    "temperature": 0.4,
                    "topK": 32,
                    "topP": 1,
                    "maxOutputTokens": 2048
                  }
                }
                """.formatted(
                    mimeType,
                    pdfBase64,
                    prompt.replace("\"", "\\\"").replace("\n", "\\n")
                );
        
        return jsonBody;
    }

    /**
     * Llama a la API de Gemini y retorna la respuesta JSON
     */
    private String llamarGeminiApi(String requestBody) throws IOException {
        String url = String.format(
                "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                model, apiKey
        );
        
        RequestBody body = RequestBody.create(
                requestBody,
                MediaType.parse("application/json; charset=utf-8")
        );
        
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("Content-Type", "application/json")
                .build();
        
        log.debug("Enviando petición a Gemini API...");
        
        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "Sin detalles";
                log.error("Error en API de Gemini. Código: {}, Body: {}", response.code(), errorBody);
                throw new IOException("Error en API de Gemini: " + response.code() + " - " + errorBody);
            }
            
            String responseBody = response.body().string();
            log.debug("Respuesta recibida de Gemini API");
            return responseBody;
        }
    }

    /**
     * Parsea la respuesta JSON de Gemini y extrae el resultado estructurado
     */
    private ResultadoEvaluacionDTO parsearRespuestaGemini(String responseJson) throws IOException {
        try {
            JsonNode root = objectMapper.readTree(responseJson);
            
            // Extraer el texto generado
            String textoGenerado = root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
            
            log.debug("Texto generado por Gemini: {}", textoGenerado);
            
            // Limpiar posibles bloques markdown
            textoGenerado = textoGenerado.trim()
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();
            
            // Parsear el JSON interno
            JsonNode evaluacion = objectMapper.readTree(textoGenerado);
            
            return ResultadoEvaluacionDTO.builder()
                    .cumpleRequerimientos(evaluacion.path("cumpleRequerimientos").asBoolean(false))
                    .porcentajeCoincidencia(evaluacion.path("porcentajeCoincidencia").asInt(0))
                    .resumenEvaluacion(evaluacion.path("resumenEvaluacion").asText("Sin evaluación"))
                    .habilidadesEncontradas(evaluacion.path("habilidadesEncontradas").asText("No especificadas"))
                    .build();
                    
        } catch (Exception e) {
            log.error("Error al parsear respuesta de Gemini: {}", e.getMessage(), e);
            log.error("Respuesta JSON recibida: {}", responseJson);
            throw new IOException("Error al parsear respuesta de Gemini: " + e.getMessage(), e);
        }
    }
}
