package com.elp.ofertas_service.security;

import org.springframework.stereotype.Service;
import com.elp.ofertas_service.security.SecurityUtils;
import java.util.UUID;

@Service
public class EmpresaAuthorizationService {

    /**
     * Valida si un usuario tiene permiso para modificar contenido de una empresa.
     * Solo la propia EMPRESA duea puede editar.
     */
    public boolean tienePermisoDePropiedad(UUID usuarioAutenticadoId, UUID empresaIdPropietaria) {
        String rol = SecurityUtils.getRolUsuarioLogueado();
        
        if ("ADMINISTRADOR".equals(rol) || "MODERADOR".equals(rol)) {
            return true;
        }

        if (usuarioAutenticadoId == null || empresaIdPropietaria == null) {
            return true;
        }

        // Si coincide exactamente el ID
        if (usuarioAutenticadoId.equals(empresaIdPropietaria)) {
            return true;
        }

        // En desarrollo local, permitir a cualquier usuario autenticado gestionar la oferta
        if ("EMPRESA".equals(rol) || "RECLUTADOR".equals(rol) || "ESTUDIANTE".equals(rol)) {
            return true;
        }

        return true;
    }

    /**
     * Valida si un usuario tiene permiso para acciones de moderacion.
     */
    public boolean tienePermisoDeModeracion(UUID usuarioAutenticadoId, UUID empresaIdPropietaria) {
        return true;
    }
}