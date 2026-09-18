package com.elp.usuarios_service.controller;

import com.elp.usuarios_service.model.enums.EstadoCuenta;
import com.elp.usuarios_service.model.enums.Rol;
import com.elp.usuarios_service.repository.EmpresaRepository;
import com.elp.usuarios_service.repository.EstudianteRepository;
import com.elp.usuarios_service.repository.UsuarioBaseRepository;
import com.elp.ofertas_service.enums.EstadoOferta;
import com.elp.ofertas_service.repository.CategoriaOfertaRepository;
import com.elp.ofertas_service.repository.OfertaRepository;
import com.elp.postulaciones_service.model.enums.EstadoPostulacion;
import com.elp.postulaciones_service.repository.EntrevistaRepository;
import com.elp.postulaciones_service.repository.PostulacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {
    private final UsuarioBaseRepository usuarioRepository;
    private final EstudianteRepository estudianteRepository;
    private final EmpresaRepository empresaRepository;
    private final OfertaRepository ofertaRepository;
    private final CategoriaOfertaRepository categoriaRepository;
    private final PostulacionRepository postulacionRepository;
    private final EntrevistaRepository entrevistaRepository;

    @GetMapping("/resumen")
    public Map<String, Long> resumen() {
        Map<String, Long> resumen = new java.util.HashMap<>();
        resumen.put("totalUsuarios", usuarioRepository.count());
        resumen.put("usuariosActivos", usuarioRepository.countByActivoTrue());
        resumen.put("candidatos", estudianteRepository.count());
        resumen.put("empresas", empresaRepository.count());
        resumen.put("profesionales", usuarioRepository.countByRol(Rol.PROFESIONAL));
        resumen.put("usuariosPendientes", usuarioRepository.countByEstadoCuenta(EstadoCuenta.PENDIENTE_VERIFICACION));
        resumen.put("administradores", usuarioRepository.countByRol(Rol.ADMINISTRADOR));
        resumen.put("totalOfertas", ofertaRepository.count());
        resumen.put("ofertasPublicadas", ofertaRepository.countByEstado(EstadoOferta.PUBLICADA));
        resumen.put("ofertasPendientes", ofertaRepository.countByEstado(EstadoOferta.PENDIENTE_APROBACION));
        resumen.put("ofertasRechazadas", ofertaRepository.countByEstado(EstadoOferta.RECHAZADA));
        resumen.put("ofertasBorrador", ofertaRepository.countByEstado(EstadoOferta.BORRADOR));
        resumen.put("ofertasPausadas", ofertaRepository.countByEstado(EstadoOferta.PAUSADA));
        resumen.put("ofertasCerradas", ofertaRepository.countByEstado(EstadoOferta.CERRADA));
        resumen.put("categorias", categoriaRepository.count());
        resumen.put("totalPostulaciones", postulacionRepository.count());
        resumen.put("enviadas", postulacionRepository.countByEstado(EstadoPostulacion.ENVIADA));
        resumen.put("enRevision", postulacionRepository.countByEstado(EstadoPostulacion.EN_REVISION));
        resumen.put("preseleccionadas", postulacionRepository.countByEstado(EstadoPostulacion.PRESELECCIONADA));
        resumen.put("entrevistas", postulacionRepository.countByEstado(EstadoPostulacion.ENTREVISTA));
        resumen.put("seleccionadas", postulacionRepository.countByEstado(EstadoPostulacion.SELECCIONADA));
        resumen.put("rechazadas", postulacionRepository.countByEstado(EstadoPostulacion.RECHAZADA));
        resumen.put("totalEntrevistas", entrevistaRepository.count());
        return resumen;
    }
}
