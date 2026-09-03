package com.elp.usuarios_service.service;

import com.elp.usuarios_service.dto.DniConsultaResponseDTO;
import com.elp.usuarios_service.dto.RucConsultaResponseDTO;
import com.elp.usuarios_service.exception.ConsultaProveedorException;
import com.elp.usuarios_service.exception.DocumentoNoEncontradoException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Map;

@Service
@Slf4j
public class ConsultaDocumentoService {

    private final RestTemplate restTemplate;

    @Value("${apisperu.token:}")
    private String directToken;

    @Value("${apisperu.auth-url}")
    private String authUrl;

    @Value("${apisperu.dni-url}")
    private String dniUrl;

    @Value("${apisperu.ruc-url}")
    private String rucUrl;

    @Value("${apisperu.username:}")
    private String username;

    @Value("${apisperu.password:}")
    private String password;

    private String cachedToken = null;
    private Instant tokenExpiresAt = Instant.EPOCH;

    public ConsultaDocumentoService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private synchronized String obtenerToken() {
        if (directToken != null && !directToken.trim().isEmpty()) {
            return directToken.trim();
        }

        if (cachedToken != null && Instant.now().isBefore(tokenExpiresAt)) {
            log.debug("Usando token de APIsPERU desde cache");
            return cachedToken;
        }

        log.info("Autenticando con APIsPERU para obtener nuevo token...");
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            Map<String, String> body = Map.of("username", username, "password", password);
            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(authUrl, request, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                cachedToken = (String) response.getBody().get("token");
                tokenExpiresAt = Instant.now().plusSeconds(22 * 3600);
                log.info("Token de APIsPERU obtenido exitosamente");
                return cachedToken;
            } else {
                throw new RuntimeException("Respuesta inesperada al autenticar con APIsPERU: " + response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("Error al autenticar con APIsPERU: {}", e.getMessage());
            throw new RuntimeException("No se pudo autenticar con el servicio de consultas.");
        }
    }

    private HttpHeaders headersConToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(obtenerToken());
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    public DniConsultaResponseDTO consultarDni(String dni) {
        if (dni == null || !dni.matches("[0-9]{8}")) {
            throw new IllegalArgumentException("El DNI debe tener exactamente 8 digitos numericos");
        }
        String token = obtenerToken();
        String url = dniUrl + "/" + dni + "?token=" + token;
        log.info("Consultando DNI {} en APIsPERU - URL: {}", dni, url);
        try {
            // No usar headers Bearer, solo el token en la URL
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Void> request = new HttpEntity<>(headers);
            ResponseEntity<DniConsultaResponseDTO> response = restTemplate.exchange(
                    url, HttpMethod.GET, request, DniConsultaResponseDTO.class);
            DniConsultaResponseDTO resultado = response.getBody();
            if (resultado == null || Boolean.FALSE.equals(resultado.getSuccess()) || resultado.getNombres() == null) {
                String errorMsg = (resultado != null && resultado.getMessage() != null)
                        ? resultado.getMessage() : "No se encontraron datos para el DNI ingresado";
                throw new DocumentoNoEncontradoException(errorMsg);
            }
            String nombreCompleto = (resultado.getNombres() + " " +
                    (resultado.getApellidoPaterno() != null ? resultado.getApellidoPaterno() : "") + " " +
                    (resultado.getApellidoMaterno() != null ? resultado.getApellidoMaterno() : "")).trim();
            resultado.setNombreCompleto(nombreCompleto);
            resultado.setSuccess(true);
            return resultado;
        } catch (HttpClientErrorException.Unauthorized e) {
            log.warn("Token invalido, expirado o sin creditos al consultar DNI {}: {}", dni, e.getResponseBodyAsString());
            throw new ConsultaProveedorException(
                    "El servicio de consultas rechazó la petición (token inválido, créditos agotados o documento no disponible en el plan). Revisa tu cuenta en apisperu.com");
        } catch (HttpClientErrorException e) {
            log.error("Error HTTP al consultar DNI {}: {} - {}", dni, e.getStatusCode(), e.getResponseBodyAsString());
            throw new ConsultaProveedorException("El servicio de consultas no está disponible en este momento (error " + e.getStatusCode().value() + "). Inténtalo nuevamente.");
        }
    }

    public RucConsultaResponseDTO consultarRuc(String ruc) {
        if (ruc == null || !ruc.matches("[0-9]{11}")) {
            throw new IllegalArgumentException("El RUC debe tener exactamente 11 digitos numericos");
        }
        String token = obtenerToken();
        String url = rucUrl + "/" + ruc + "?token=" + token;
        log.info("Consultando RUC {} en APIsPERU - URL: {}", ruc, url);
        try {
            // No usar headers Bearer, solo el token en la URL
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Void> request = new HttpEntity<>(headers);
            ResponseEntity<RucConsultaResponseDTO> response = restTemplate.exchange(
                    url, HttpMethod.GET, request, RucConsultaResponseDTO.class);
            RucConsultaResponseDTO resultado = response.getBody();
            if (resultado == null || Boolean.FALSE.equals(resultado.getSuccess()) || resultado.getRazonSocial() == null) {
                String errorMsg = (resultado != null && resultado.getMessage() != null)
                        ? resultado.getMessage() : "No se encontraron datos para el RUC ingresado";
                throw new DocumentoNoEncontradoException(errorMsg);
            }
            resultado.setSuccess(true);
            return resultado;
        } catch (HttpClientErrorException.Unauthorized e) {
            log.warn("Token invalido, expirado o sin creditos al consultar RUC {}: {}", ruc, e.getResponseBodyAsString());
            throw new ConsultaProveedorException(
                    "El servicio de consultas rechazó la petición (token inválido, créditos agotados o documento no disponible en el plan). Revisa tu cuenta en apisperu.com");
        } catch (HttpClientErrorException e) {
            log.error("Error HTTP al consultar RUC {}: {} - {}", ruc, e.getStatusCode(), e.getResponseBodyAsString());
            throw new ConsultaProveedorException("El servicio de consultas no está disponible en este momento (error " + e.getStatusCode().value() + "). Inténtalo nuevamente.");
        }
    }
}