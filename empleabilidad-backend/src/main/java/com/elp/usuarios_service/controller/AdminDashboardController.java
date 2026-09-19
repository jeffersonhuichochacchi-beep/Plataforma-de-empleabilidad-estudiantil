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
import java.util.HashMap;
import java.util.concurrent.CompletableFuture;

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
        // Los tres bloques consultan tablas independientes. Ejecutarlos en
        // paralelo evita que los ~23 COUNT se acumulen uno detrás de otro.
        CompletableFuture<Map<String, Long>> usuarios = CompletableFuture.supplyAsync(() -> {
            Map<String, Long> datos = new HashMap<>();
            datos.put("totalUsuarios", usuarioRepository.count());
            datos.put("usuariosActivos", usuarioRepository.countByActivoTrue());
            datos.put("candidatos", estudianteRepository.count());
            datos.put("empresas", empresaRepository.count());
            datos.put("profesionales", usuarioRepository.countByRol(Rol.PROFESIONAL));
            datos.put("usuariosPendientes", usuarioRepository.countByEstadoCuenta(EstadoCuenta.PENDIENTE_VERIFICACION));
            datos.put("administradores", usuarioRepository.countByRol(Rol.ADMINISTRADOR));
            return datos;
        });
        CompletableFuture<Map<String, Long>> ofertas = CompletableFuture.supplyAsync(() -> {
            Map<String, Long> datos = new HashMap<>();
            datos.put("totalOfertas", ofertaRepository.count());
            datos.put("ofertasPublicadas", ofertaRepository.countByEstado(EstadoOferta.PUBLICADA));
            datos.put("ofertasPendientes", ofertaRepository.countByEstado(EstadoOferta.PENDIENTE_APROBACION));
            datos.put("ofertasRechazadas", ofertaRepository.countByEstado(EstadoOferta.RECHAZADA));
            datos.put("ofertasBorrador", ofertaRepository.countByEstado(EstadoOferta.BORRADOR));
            datos.put("ofertasPausadas", ofertaRepository.countByEstado(EstadoOferta.PAUSADA));
            datos.put("ofertasCerradas", ofertaRepository.countByEstado(EstadoOferta.CERRADA));
            datos.put("categorias", categoriaRepository.count());
            return datos;
        });
        CompletableFuture<Map<String, Long>> postulaciones = CompletableFuture.supplyAsync(() -> {
            Map<String, Long> datos = new HashMap<>();
            datos.put("totalPostulaciones", postulacionRepository.count());
            datos.put("enviadas", postulacionRepository.countByEstado(EstadoPostulacion.ENVIADA));
            datos.put("enRevision", postulacionRepository.countByEstado(EstadoPostulacion.EN_REVISION));
            datos.put("preseleccionadas", postulacionRepository.countByEstado(EstadoPostulacion.PRESELECCIONADA));
            datos.put("entrevistas", postulacionRepository.countByEstado(EstadoPostulacion.ENTREVISTA));
            datos.put("seleccionadas", postulacionRepository.countByEstado(EstadoPostulacion.SELECCIONADA));
            datos.put("rechazadas", postulacionRepository.countByEstado(EstadoPostulacion.RECHAZADA));
            datos.put("totalEntrevistas", entrevistaRepository.count());
            return datos;
        });

        Map<String, Long> resumen = new HashMap<>();
        resumen.putAll(usuarios.join());
        resumen.putAll(ofertas.join());
        resumen.putAll(postulaciones.join());
        return resumen;
    }
}
