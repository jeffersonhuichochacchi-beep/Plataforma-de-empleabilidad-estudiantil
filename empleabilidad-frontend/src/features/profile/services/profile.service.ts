import { api } from '@/core/api';
import type { PerfilResponseDTO } from '../types';

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
  }
};
