import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/useAuthStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserCircle, Building2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const candidatoSchema = z.object({
  dni: z.string().min(8, 'DNI debe tener mínimo 8 caracteres'),
  nombres: z.string().min(2, 'Nombres requeridos'),
  apellidos: z.string().min(2, 'Apellidos requeridos'),
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

const empresaSchema = z.object({
  ruc: z.string().min(11, 'RUC debe tener al menos 11 caracteres'),
  razonSocial: z.string().min(2, 'Razón social requerida'),
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type CandidatoFormValues = z.infer<typeof candidatoSchema>;
type EmpresaFormValues = z.infer<typeof empresaSchema>;

export const RegisterView: React.FC = () => {
  const [role, setRole] = useState<'ESTUDIANTE' | 'EMPRESA'>('ESTUDIANTE');
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const isApplyFlow = location.state?.from === 'apply';

  const candidatoForm = useForm<CandidatoFormValues>({ resolver: zodResolver(candidatoSchema) });
  const empresaForm = useForm<EmpresaFormValues>({ resolver: zodResolver(empresaSchema) });

  const onSubmitCandidato = async (data: CandidatoFormValues) => {
    try {
      const response = await authService.registerEstudiante(data);
      localStorage.setItem('jwt_token', response.token);
      const user = await authService.getMe();
      login(response.token, user);
      toast.success('Cuenta creada exitosamente!', { icon: '🎉' });

      navigate('/auth/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al registrar candidato');
    }
  };

  const onSubmitEmpresa = async (data: EmpresaFormValues) => {
    try {
      const response = await authService.registerEmpresa(data);
      localStorage.setItem('jwt_token', response.token);
      const user = await authService.getMe();
      login(response.token, user);
      toast.success('Empresa registrada correctamente!', { icon: '🏢' });
      navigate('/auth/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al registrar empresa');
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center mb-2">
        {isApplyFlow && (
          <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 px-3 py-2 text-sm flex items-start gap-2 text-left">
            <ShieldCheck className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Para postular a esta oferta debes registrarte primero. Completa tu cuenta y continúa con la aplicación.</span>
          </div>
        )}
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Crea tu cuenta</h2>
        <p className="text-slate-500 text-sm mt-1">Selecciona tu perfil para comenzar</p>
      </div>

      {/* Role Toggle */}
      <div className="flex p-1 bg-slate-100/80 rounded-xl relative">
        <button
          onClick={() => setRole('ESTUDIANTE')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 z-10 ${
            role === 'ESTUDIANTE' ? 'bg-white text-blue-600 shadow-[0_2px_10px_rgb(0,0,0,0.06)]' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <UserCircle className="w-4 h-4" /> Profesional
        </button>
        <button
          onClick={() => setRole('EMPRESA')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 z-10 ${
            role === 'EMPRESA' ? 'bg-white text-blue-600 shadow-[0_2px_10px_rgb(0,0,0,0.06)]' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Building2 className="w-4 h-4" /> Empresa
        </button>
      </div>

      {/* Forms */}
      <div className="mt-4">
        {role === 'ESTUDIANTE' ? (
          <form onSubmit={candidatoForm.handleSubmit(onSubmitCandidato)} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Input label="DNI" placeholder="Ej: 12345678" {...candidatoForm.register('dni')} error={candidatoForm.formState.errors.dni?.message} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Nombres" placeholder="Juan" {...candidatoForm.register('nombres')} error={candidatoForm.formState.errors.nombres?.message} />
              <Input label="Apellidos" placeholder="Pérez" {...candidatoForm.register('apellidos')} error={candidatoForm.formState.errors.apellidos?.message} />
            </div>
            <Input label="Correo electrónico" type="email" placeholder="juan@email.com" {...candidatoForm.register('email')} error={candidatoForm.formState.errors.email?.message} />
            <div className="relative">
              <Input label="Contraseña" type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...candidatoForm.register('password')} error={candidatoForm.formState.errors.password?.message} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <Button type="submit" className="w-full mt-2" isLoading={candidatoForm.formState.isSubmitting}>
              Unirse como Profesional
            </Button>
          </form>
        ) : (
          <form onSubmit={empresaForm.handleSubmit(onSubmitEmpresa)} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Input label="RUC" placeholder="Ej: 20123456789" {...empresaForm.register('ruc')} error={empresaForm.formState.errors.ruc?.message} />
            <Input label="Razón Social" placeholder="Mi Empresa S.A.C" {...empresaForm.register('razonSocial')} error={empresaForm.formState.errors.razonSocial?.message} />
            <Input label="Correo Corporativo" type="email" placeholder="contacto@empresa.com" {...empresaForm.register('email')} error={empresaForm.formState.errors.email?.message} />
            <div className="relative">
              <Input label="Contraseña" type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...empresaForm.register('password')} error={empresaForm.formState.errors.password?.message} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <Button type="submit" className="w-full mt-2" isLoading={empresaForm.formState.isSubmitting}>
              Unirse como Empresa
            </Button>
          </form>
        )}
      </div>

      <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-100">
        ¿Ya tienes cuenta? <a href="/auth/login" className="text-blue-600 hover:underline font-semibold">Inicia sesión</a>
      </div>
    </div>
  );
};
