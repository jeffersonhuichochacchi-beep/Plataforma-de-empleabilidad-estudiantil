package com.elp.ofertas_service.config;

import com.elp.ofertas_service.entity.CategoriaOferta;
import com.elp.ofertas_service.repository.CategoriaOfertaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Registra categorías base de empleabilidad sin duplicar las que ya existan.
 * Se ejecuta al iniciar el backend y puede desactivarse por configuración.
 */
@Component
@RequiredArgsConstructor
public class CategoriasIniciales implements CommandLineRunner {

    private final CategoriaOfertaRepository categoriaRepository;

    @Value("${app.categories.seed.enabled:true}")
    private boolean enabled;

    @Override
    public void run(String... args) {
        if (!enabled) return;

        List<CategoriaOferta> categorias = List.of(
                categoria("Tecnologia y Desarrollo de Software", "Programacion, desarrollo web, aplicaciones y soporte tecnologico."),
                categoria("Administracion y Finanzas", "Contabilidad, finanzas, banca, auditoria y gestion administrativa."),
                categoria("Marketing y Comunicaciones", "Marketing digital, publicidad, contenidos, comunicacion y relaciones publicas."),
                categoria("Ingenieria", "Ingenieria industrial, civil, mecanica, electrica y especialidades tecnicas."),
                categoria("Diseno y Creatividad", "Diseno grafico, UX/UI, multimedia, audiovisual y direccion de arte."),
                categoria("Ventas y Comercial", "Ventas, desarrollo de negocios, comercio, atencion al cliente y cuentas clave."),
                categoria("Recursos Humanos", "Seleccion, desarrollo organizacional, bienestar y gestion del talento."),
                categoria("Logistica y Operaciones", "Compras, almacen, cadena de suministro, operaciones y distribucion."),
                categoria("Salud", "Enfermeria, medicina, salud ocupacional, farmacia y servicios asistenciales."),
                categoria("Educacion e Investigacion", "Docencia, capacitacion, investigacion y gestion academica.")
        );

        categorias.stream()
                .filter(categoria -> !categoriaRepository.existsByNombreIgnoreCase(categoria.getNombre()))
                .forEach(categoriaRepository::save);
    }

    private CategoriaOferta categoria(String nombre, String descripcion) {
        return CategoriaOferta.builder()
                .nombre(nombre)
                .descripcion(descripcion)
                .activo(true)
                .build();
    }
}
