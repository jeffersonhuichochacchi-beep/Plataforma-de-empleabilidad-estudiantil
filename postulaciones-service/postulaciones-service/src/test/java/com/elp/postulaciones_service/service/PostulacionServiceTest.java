package com.elp.postulaciones_service.service;

import com.elp.postulaciones_service.client.OfertasClient;
import com.elp.postulaciones_service.client.UsuariosClient;
import com.elp.postulaciones_service.dto.externo.OfertaResumenDTO;
import com.elp.postulaciones_service.dto.postulacion.PostulacionRequest;
import com.elp.postulaciones_service.dto.postulacion.PostulacionResponse;
import com.elp.postulaciones_service.exception.BusinessException;
import com.elp.postulaciones_service.exception.DuplicatePostulationException;
import com.elp.postulaciones_service.mapper.PostulacionMapper;
import com.elp.postulaciones_service.model.Postulacion;
import com.elp.postulaciones_service.repository.AuditoriaPostulacionRepository;
import com.elp.postulaciones_service.repository.HistorialPostulacionRepository;
import com.elp.postulaciones_service.repository.PostulacionRepository;
import com.elp.postulaciones_service.util.SecurityUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostulacionServiceTest {

    @Mock
    private PostulacionRepository postulacionRepository;
    @Mock
    private HistorialPostulacionRepository historialRepository;
    @Mock
    private AuditoriaPostulacionRepository auditoriaRepository;
    @Mock
    private EstadoPostulacionService estadoPostulacionService;
    @Mock
    private PostulacionMapper postulacionMapper;
    @Mock
    private OfertasClient ofertasClient;
    @Mock
    private UsuariosClient usuariosClient;

    @InjectMocks
    private PostulacionServiceImpl postulacionService;

    private MockedStatic<SecurityUtils> securityUtilsMock;

    private UUID candidatoId;
    private UUID ofertaId;
    private UUID empresaId;
    private PostulacionRequest request;

    @BeforeEach
    void setUp() {
        securityUtilsMock = Mockito.mockStatic(SecurityUtils.class);
        securityUtilsMock.when(SecurityUtils::getJwtToken).thenReturn("mock-jwt");

        candidatoId = UUID.randomUUID();
        ofertaId = UUID.randomUUID();
        empresaId = UUID.randomUUID();

        request = new PostulacionRequest();
        request.setOfertaId(ofertaId);
        request.setEmpresaId(empresaId);
    }

    @AfterEach
    void tearDown() {
        securityUtilsMock.close();
    }

    @Test
    void crearPostulacionExito() {
        when(postulacionRepository.existsByCandidatoIdAndOfertaId(candidatoId, ofertaId)).thenReturn(false);

        OfertaResumenDTO ofertaMock = new OfertaResumenDTO();
        ofertaMock.setAceptaPostulaciones(true);
        ofertaMock.setEstado("ACTIVA");
        ofertaMock.setEmpresaId(empresaId);
        when(ofertasClient.validarOferta(eq(ofertaId), anyString())).thenReturn(ofertaMock);

        Postulacion guardada = new Postulacion();
        when(postulacionRepository.saveAndFlush(any(Postulacion.class))).thenReturn(guardada);
        when(postulacionMapper.toResponse(any())).thenReturn(new PostulacionResponse());

        assertDoesNotThrow(() -> postulacionService.crearPostulacion(candidatoId, request));
        verify(postulacionRepository).saveAndFlush(any(Postulacion.class));
    }

    @Test
    void crearPostulacionDuplicadaPreCheck() {
        when(postulacionRepository.existsByCandidatoIdAndOfertaId(candidatoId, ofertaId)).thenReturn(true);

        assertThrows(DuplicatePostulationException.class, () -> postulacionService.crearPostulacion(candidatoId, request));
    }

    @Test
    void crearPostulacionDuplicadaConcurrencia() {
        when(postulacionRepository.existsByCandidatoIdAndOfertaId(candidatoId, ofertaId)).thenReturn(false);

        OfertaResumenDTO ofertaMock = new OfertaResumenDTO();
        ofertaMock.setAceptaPostulaciones(true);
        ofertaMock.setEstado("ACTIVA");
        ofertaMock.setEmpresaId(empresaId);
        when(ofertasClient.validarOferta(eq(ofertaId), anyString())).thenReturn(ofertaMock);

        when(postulacionRepository.saveAndFlush(any(Postulacion.class))).thenThrow(new DataIntegrityViolationException("Unique constraint"));

        assertThrows(DuplicatePostulationException.class, () -> postulacionService.crearPostulacion(candidatoId, request));
    }

    @Test
    void crearPostulacionOfertaCerrada() {
        when(postulacionRepository.existsByCandidatoIdAndOfertaId(candidatoId, ofertaId)).thenReturn(false);

        OfertaResumenDTO ofertaMock = new OfertaResumenDTO();
        ofertaMock.setAceptaPostulaciones(false); // cerrada
        ofertaMock.setEstado("CERRADA");
        when(ofertasClient.validarOferta(eq(ofertaId), anyString())).thenReturn(ofertaMock);

        assertThrows(BusinessException.class, () -> postulacionService.crearPostulacion(candidatoId, request));
    }

    @Test
    void crearPostulacionEmpresaInvalida() {
        when(postulacionRepository.existsByCandidatoIdAndOfertaId(candidatoId, ofertaId)).thenReturn(false);

        OfertaResumenDTO ofertaMock = new OfertaResumenDTO();
        ofertaMock.setAceptaPostulaciones(true);
        ofertaMock.setEstado("ACTIVA");
        ofertaMock.setEmpresaId(UUID.randomUUID()); // otra empresa
        when(ofertasClient.validarOferta(eq(ofertaId), anyString())).thenReturn(ofertaMock);

        assertThrows(BusinessException.class, () -> postulacionService.crearPostulacion(candidatoId, request));
    }
}
