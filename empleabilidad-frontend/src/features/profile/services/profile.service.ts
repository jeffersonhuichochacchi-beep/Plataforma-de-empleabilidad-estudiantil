import { api } from '@/core/api';
import type { PerfilResponseDTO, ExperienciaPerfil, EducacionPerfil, HabilidadPerfil } from '../types';

export const profileService = {
  async getMiPerfil(): Promise<PerfilResponseDTO> {
    const { data } = await api.get<PerfilResponseDTO>('/perfil/me');
    return data;
  },

  async uploadCv(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    
    await api.post('/perfil/cv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  async uploadProfileCv(file: File): Promise<PerfilResponseDTO> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<PerfilResponseDTO>('/perfil/cv-portafolio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  async updateProfile(payload: Record<string, unknown>): Promise<PerfilResponseDTO> {
    const { data } = await api.put<PerfilResponseDTO>('/perfil/me', payload); return data;
  },
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/perfil/password', { currentPassword, newPassword });
  },
  async addExperience(payload: Record<string, unknown>): Promise<ExperienciaPerfil> {
    const { data } = await api.post<ExperienciaPerfil>('/perfil/experiencias', payload); return data;
  },
  async deleteExperience(id: string): Promise<void> { await api.delete(`/perfil/experiencias/${id}`); },
  async addEducation(payload: Record<string, unknown>): Promise<EducacionPerfil> {
    const { data } = await api.post<EducacionPerfil>('/perfil/educacion', payload); return data;
  },
  async deleteEducation(id: string): Promise<void> { await api.delete(`/perfil/educacion/${id}`); },
  async addSkill(payload: Record<string, unknown>): Promise<HabilidadPerfil> {
    const { data } = await api.post<HabilidadPerfil>('/perfil/habilidades', payload); return data;
  },
  async deleteSkill(id: string): Promise<void> { await api.delete(`/perfil/habilidades/${id}`); },
};
