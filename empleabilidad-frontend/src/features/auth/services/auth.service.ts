import { api } from '@/core/api';
import type { AuthResponse, UsuarioResponseDTO } from '../types';

export const authService = {
  async login(credentials: Record<string, any>): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  async registerEstudiante(payload: Record<string, any>): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/registro/estudiante', payload);
    return data;
  },

  async registerEmpresa(payload: Record<string, any>): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/registro/empresa', payload);
    return data;
  },

  async getMe(): Promise<UsuarioResponseDTO> {
    const { data } = await api.get<UsuarioResponseDTO>('/auth/me');
    return data;
  }
};
