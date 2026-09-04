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
        
        if ("ADMINISTRADOR".equals(rol)) {
            return true;
        }

        if ("EMPRESA".equals(rol)) {
            return usuarioAutenticadoId.equals(empresaIdPropietaria);
        }
        
        if ("RECLUTADOR".equals(rol)) {
            return true;
        }

        // Permite en entorno de desarrollo o si el usuario es el propietario
        return usuarioAutenticadoId.equals(empresaIdPropietaria);
    }

    /**
     * Valida si un usuario tiene permiso para acciones de moderacion.
     */
    public boolean tienePermisoDeModeracion(UUID usuarioAutenticadoId, UUID empresaIdPropietaria) {
        String rol = SecurityUtils.getRolUsuarioLogueado();
        
        if ("ADMINISTRADOR".equals(rol) || "MODERADOR".equals(rol)) {
            return true;
        }
        
        return tienePermisoDePropiedad(usuarioAutenticadoId, empresaIdPropietaria);
    }
}