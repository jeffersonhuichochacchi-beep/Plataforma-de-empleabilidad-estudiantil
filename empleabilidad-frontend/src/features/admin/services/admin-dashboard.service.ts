import { api } from '@/core/api';

export interface UsuariosResumen { totalUsuarios: number; usuariosActivos: number; candidatos: number; empresas: number; profesionales: number; usuariosPendientes: number; administradores: number; }
export interface OfertasResumen { totalOfertas: number; ofertasPublicadas: number; ofertasPendientes: number; ofertasRechazadas: number; ofertasBorrador: number; ofertasPausadas: number; ofertasCerradas: number; categorias: number; }
export interface PostulacionesResumen { totalPostulaciones: number; enviadas: number; enRevision: number; preseleccionadas: number; entrevistas: number; seleccionadas: number; rechazadas: number; totalEntrevistas: number; }

export const adminDashboardService = {
  getResumen: async () => {
    // El backend consolidado entrega los tres bloques en una sola respuesta.
    // Antes se llamaba tres veces al mismo endpoint, lo que hacía más lenta la
    // carga y multiplicaba innecesariamente las consultas a la base de datos.
    const { data } = await api.get<UsuariosResumen & OfertasResumen & PostulacionesResumen>('/admin/dashboard/resumen');
    return {
      usuarios: data ?? { totalUsuarios: 0, usuariosActivos: 0, candidatos: 0, empresas: 0, profesionales: 0, usuariosPendientes: 0, administradores: 0 },
      ofertas: data ?? { totalOfertas: 0, ofertasPublicadas: 0, ofertasPendientes: 0, ofertasRechazadas: 0, ofertasBorrador: 0, ofertasPausadas: 0, ofertasCerradas: 0, categorias: 0 },
      postulaciones: data ?? { totalPostulaciones: 0, enviadas: 0, enRevision: 0, preseleccionadas: 0, entrevistas: 0, seleccionadas: 0, rechazadas: 0, totalEntrevistas: 0 },
    };
  },
};
