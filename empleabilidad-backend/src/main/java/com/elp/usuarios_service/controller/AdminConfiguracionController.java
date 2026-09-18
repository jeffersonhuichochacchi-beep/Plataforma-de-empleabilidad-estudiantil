package com.elp.usuarios_service.controller;

import com.elp.usuarios_service.model.ConfiguracionAdmin;
import com.elp.usuarios_service.repository.ConfiguracionAdminRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/configuracion")
public class AdminConfiguracionController {
    private static final String ID = "principal";
    private final ConfiguracionAdminRepository repository;
    private final ObjectMapper mapper;

    public AdminConfiguracionController(ConfiguracionAdminRepository repository) {
        this.repository = repository;
        this.mapper = new ObjectMapper();
    }

    @GetMapping
    public Map<String, Object> obtener() {
        return repository.findById(ID).map(config -> {
            try { return mapper.readValue(config.getValor(), new TypeReference<Map<String, Object>>() {}); }
            catch (Exception e) { throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Configuración inválida"); }
        }).orElseGet(Map::of);
    }

    @PutMapping
    public Map<String, Object> guardar(@RequestBody Map<String, Object> configuracion) {
        try {
            String json = mapper.writeValueAsString(configuracion);
            repository.findById(ID).ifPresentOrElse(existing -> { existing.setValor(json); repository.save(existing); }, () -> repository.save(new ConfiguracionAdmin(ID, json)));
            return configuracion;
        } catch (Exception e) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se pudo guardar la configuración"); }
    }
}
