import { api, ofertasApi, postulacionesApi } from '@/core/api';

export interface UsuariosResumen { totalUsuarios: number; usuariosActivos: number; candidatos: number; empresas: number; profesionales: number; usuariosPendientes: number; administradores: number; }
export interface OfertasResumen { totalOfertas: number; ofertasPublicadas: number; ofertasPendientes: number; ofertasRechazadas: number; ofertasBorrador: number; ofertasPausadas: number; ofertasCerradas: number; categorias: number; }
export interface PostulacionesResumen { totalPostulaciones: number; enviadas: number; enRevision: number; preseleccionadas: number; entrevistas: number; seleccionadas: number; rechazadas: number; totalEntrevistas: number; }

export const adminDashboardService = {
  getResumen: async () => Promise.all([
    api.get<UsuariosResumen>('/admin/dashboard/resumen'),
    ofertasApi.get<OfertasResumen>('/admin/dashboard/resumen'),
    postulacionesApi.get<PostulacionesResumen>('/admin/dashboard/resumen'),
  ]).then(([usuarios, ofertas, postulaciones]) => ({ usuarios: usuarios.data, ofertas: ofertas.data, postulaciones: postulaciones.data })),
};
