import { create } from 'zustand';
import type { PerfilResponseDTO } from '../types';
import { profileService } from '../services/profile.service';
import toast from 'react-hot-toast';

interface ProfileState {
  profile: PerfilResponseDTO | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  uploadCv: (file: File) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileService.getMiPerfil();
      set({ profile, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      set({ error: error.message || 'Error al obtener perfil', isLoading: false });
    }
  },

  uploadCv: async (file: File) => {
    set({ isLoading: true, error: null });
    try {
      await profileService.uploadCv(file);
      toast.success('CV subido exitosamente');
      // Refetch profile to update completion %
      const profile = await profileService.getMiPerfil();
      set({ profile, isLoading: false });
    } catch (error: any) {
      console.error('Error uploading CV:', error);
      toast.error('Error al subir CV');
      set({ error: error.message || 'Error al subir CV', isLoading: false });
      throw error;
    }
  }
}));
