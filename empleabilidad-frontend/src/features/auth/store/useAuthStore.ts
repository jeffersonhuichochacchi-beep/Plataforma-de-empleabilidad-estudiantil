import { create } from 'zustand';
import type { UsuarioResponseDTO } from '../types';
import { authService } from '../services/auth.service';

interface AuthState {
  user: UsuarioResponseDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: UsuarioResponseDTO) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // starts loading to check token
  
  login: (token, user) => {
    localStorage.setItem('jwt_token', token);
    set({ user, isAuthenticated: true, isLoading: false });
  },
  
  logout: () => {
    localStorage.removeItem('jwt_token');
    set({ user: null, isAuthenticated: false, isLoading: false });
    window.location.href = '/auth/login';
  },
  
  checkAuth: async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await authService.getMe();
      // Una comprobación iniciada con un token anterior no puede sobrescribir
      // la sesión que acaba de iniciar el usuario.
      if (localStorage.getItem('jwt_token') !== token) return;
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      if (localStorage.getItem('jwt_token') !== token) return;
      localStorage.removeItem('jwt_token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
