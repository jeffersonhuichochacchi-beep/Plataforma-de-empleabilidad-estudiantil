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
        
        if ("EMPRESA".equals(rol)) {
            return usuarioAutenticadoId.equals(empresaIdPropietaria);
        }
        
        // TODO FASE FUTURA:
        // Implementar relacion Reclutador <-> Empresa en usuarios-service 
        // mediante contrato interno seguro.
        // Hasta entonces, no asumir: reclutadorId == empresaId.
        if ("RECLUTADOR".equals(rol)) {
            return false;
        }

        return false;
    }

    /**
     * Valida si un usuario tiene permiso para acciones de moderacion.
     */
    public boolean tienePermisoDeModeracion(UUID usuarioAutenticadoId, UUID empresaIdPropietaria) {
        String rol = SecurityUtils.getRolUsuarioLogueado();
        
        if ("ADMINISTRADOR".equals(rol)) {
            return true;
        }
        
        return tienePermisoDePropiedad(usuarioAutenticadoId, empresaIdPropietaria);
    }
}