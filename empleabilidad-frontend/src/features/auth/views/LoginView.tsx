import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Debe tener al menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginView: React.FC = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await authService.login(data);
      // Tras el login, obtenemos el perfil real
      localStorage.setItem('jwt_token', response.token);
      const user = await authService.getMe();
      login(response.token, user);
      
      // Navigate based on role
      if (user.rol === 'EMPRESA' || user.rol === 'RECLUTADOR') {
        navigate('/empresa/ofertas');
      } else {
        navigate('/candidato/buscar');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Credenciales inválidas');
      localStorage.removeItem('jwt_token');
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col items-center mb-4">
        <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
          <Briefcase className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Bienvenido de nuevo</h2>
        <p className="text-slate-500 text-sm mt-1">Ingresa a tu cuenta para continuar</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          {...register('email')}
          error={errors.email?.message}
        />
        
        <div className="relative">
          <Input
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Iniciar sesión
        </Button>
      </form>

      <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-100 mt-6">
        ¿No tienes cuenta? <a href="/auth/register" className="text-blue-600 hover:underline font-medium">Regístrate aquí</a>
      </div>
    </div>
  );
};
