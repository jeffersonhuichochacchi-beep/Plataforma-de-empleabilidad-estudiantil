package com.elp.usuarios_service.controller;

import com.elp.usuarios_service.dto.DniConsultaResponseDTO;
import com.elp.usuarios_service.dto.RucConsultaResponseDTO;
import com.elp.usuarios_service.exception.ConsultaProveedorException;
import com.elp.usuarios_service.exception.DocumentoNoEncontradoException;
import com.elp.usuarios_service.service.ConsultaDocumentoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/consultas")
@RequiredArgsConstructor
@Slf4j
public class ConsultaDocumentoController {

    private final ConsultaDocumentoService consultaDocumentoService;

    @GetMapping("/dni/{dni}")
    public ResponseEntity<?> consultarDni(@PathVariable String dni) {
        try {
            DniConsultaResponseDTO resultado = consultaDocumentoService.consultarDni(dni);
            return ResponseEntity.ok(resultado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (DocumentoNoEncontradoException e) {
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        } catch (ConsultaProveedorException e) {
            return ResponseEntity.status(502).body(Map.of("message", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(503).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/ruc/{ruc}")
    public ResponseEntity<?> consultarRuc(@PathVariable String ruc) {
        try {
            RucConsultaResponseDTO resultado = consultaDocumentoService.consultarRuc(ruc);
            return ResponseEntity.ok(resultado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (DocumentoNoEncontradoException e) {
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        } catch (ConsultaProveedorException e) {
            return ResponseEntity.status(502).body(Map.of("message", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(503).body(Map.of("message", e.getMessage()));
        }
    }
}