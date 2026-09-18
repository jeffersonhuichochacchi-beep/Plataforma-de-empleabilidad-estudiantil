import { api } from '@/core/api';
import type { PageResponse } from '@/shared/types';
import type { AdminUserItem, UserRole, UserStatus } from '../views/AdminUsuariosView';

interface UsuarioApiResponse {
  id: string;
  uuid: string;
  email: string;
  rol: UserRole;
  estadoCuenta: string;
  activo: boolean;
  bloqueado: boolean;
  nombreCompleto: string;
  fotoPerfil?: string;
  telefono?: string;
  fechaRegistro?: string;
  ultimoAcceso?: string;
  ruc?: string;
  razonSocial?: string;
  sector?: string;
  verificada?: boolean;
}

const toStatus = (value: string | undefined, bloqueado: boolean | undefined): UserStatus => {
  if (bloqueado || value === 'BLOQUEADA') return 'BLOQUEADA';
  if (value === 'PENDIENTE_VERIFICACION') return 'PENDIENTE';
  if (value === 'ACTIVA') return 'ACTIVA';
  return 'INACTIVA';
};

const toUser = (user: UsuarioApiResponse): AdminUserItem => {
  const email = String(user.email ?? '');
  const nombreCompleto = String(user.nombreCompleto || email || 'Usuario');
  const roles: UserRole[] = ['ESTUDIANTE', 'PROFESIONAL', 'EMPRESA', 'RECLUTADOR', 'ADMINISTRADOR'];
  const rol = roles.includes(user.rol) ? user.rol : 'ESTUDIANTE';
  return {
    ...user,
    email,
    rol,
    estadoCuenta: toStatus(user.estadoCuenta, user.bloqueado),
    nombreCompleto,
    fechaRegistro: user.fechaRegistro || new Date(0).toISOString(),
    ultimoAcceso: user.ultimoAcceso || 'Nunca',
  };
};

export const adminUsuariosService = {
  resumenRoles: async () => {
    const { data } = await api.get<Record<string, number>>('/admin/usuarios/roles/resumen');
    return data;
  },
  crear: async (payload: { nombreCompleto: string; email: string; rol: UserRole; telefono?: string; ruc?: string; sector?: string }) => {
    const { data } = await api.post<UsuarioApiResponse>('/admin/usuarios', payload);
    return toUser(data);
  },
  listar: async (params: { page?: number; size?: number; q?: string; rol?: UserRole; estado?: string } = {}) => {
    const { data } = await api.get<PageResponse<UsuarioApiResponse> | UsuarioApiResponse[]>('/admin/usuarios', { params });
    // Spring devuelve Page, pero aceptamos también un arreglo para evitar que
    // una variación del gateway provoque un crash al ejecutar .map.
    const content = Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : [];
    return { ...(Array.isArray(data) ? {} : data), content: content.filter(Boolean).map(toUser) };
  },
  cambiarBloqueo: async (id: string, bloqueado: boolean) => api.patch(`/admin/usuarios/${id}/bloqueo`, { bloqueado }),
  verificarEmpresa: async (id: string) => api.patch(`/admin/usuarios/${id}/verificar`),
  eliminar: async (id: string) => api.delete(`/admin/usuarios/${id}`),
};
