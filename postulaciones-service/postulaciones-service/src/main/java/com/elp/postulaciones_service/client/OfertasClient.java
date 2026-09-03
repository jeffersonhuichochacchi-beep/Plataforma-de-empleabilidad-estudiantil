package com.elp.postulaciones_service.client;

import com.elp.postulaciones_service.dto.externo.OfertaResumenDTO;
import com.elp.postulaciones_service.exception.ExternalServiceException;
import com.elp.postulaciones_service.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OfertasClient {

    private final RestClient restClient;

    @Value("${app.ofertas-service.url:http://localhost:8082}")
    private String ofertasServiceUrl;

    public OfertaResumenDTO validarOferta(UUID ofertaId, String jwtToken) {
        return restClient.get()
                .uri(ofertasServiceUrl + "/api/ofertas/internos/{uuid}/validacion", ofertaId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {
                    if (response.getStatusCode().value() == 404) {
                        throw new ResourceNotFoundException("La oferta no existe o no se encontro en el sistema de ofertas");
                    }
                    throw new ExternalServiceException("Error del cliente al validar oferta: " + response.getStatusCode());
                })
                .onStatus(HttpStatusCode::is5xxServerError, (request, response) -> {
                    throw new ExternalServiceException("El servicio de ofertas no esta disponible actualmente. Por favor intente mas tarde.");
                })
                .body(OfertaResumenDTO.class);
    }
}