import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { authService } from '../services/auth.service';
import { consultasService } from '../services/consultas.service';
import type { DniResponse, RucResponse } from '../services/consultas.service';
import { useAuthStore } from '../store/useAuthStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserCircle, Building2, ShieldCheck, Eye, EyeOff, Search, Loader2, CheckCircle2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const candidatoSchema = z.object({
  dni: z.string().min(8, 'El DNI debe tener 8 dígitos').max(8, 'El DNI debe tener 8 dígitos'),
  nombres: z.string().min(2, 'Nombres requeridos'),
  apellidos: z.string().min(2, 'Apellidos requeridos'),
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

const empresaSchema = z.object({
  ruc: z.string().min(11, 'El RUC debe tener 11 dígitos').max(11, 'El RUC debe tener 11 dígitos'),
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

  // Estados de consulta y validación RENIEC / SUNAT
  const [isValidatingDni, setIsValidatingDni] = useState(false);
  const [dniVerifiedData, setDniVerifiedData] = useState<DniResponse | null>(null);

  const [isValidatingRuc, setIsValidatingRuc] = useState(false);
  const [rucVerifiedData, setRucVerifiedData] = useState<RucResponse | null>(null);

  const candidatoForm = useForm<CandidatoFormValues>({
    resolver: zodResolver(candidatoSchema),
    defaultValues: {
      dni: '',
      nombres: '',
      apellidos: '',
      email: '',
      password: '',
    },
  });

  const empresaForm = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaSchema),
    defaultValues: {
      ruc: '',
      razonSocial: '',
      email: '',
      password: '',
    },
  });

  // Validar DNI con API RENIEC (APIsPERU)
  const handleValidarDni = async (dniValue?: string) => {
    const dni = (dniValue || candidatoForm.getValues('dni') || '').trim();
    if (!dni || dni.length !== 8) {
      toast.error('Ingrese un número de DNI válido de 8 dígitos');
      return;
    }

    setIsValidatingDni(true);
    try {
      const data = await consultasService.consultarDni(dni);
      if (data && data.nombres) {
        const apellidos = `${data.apellidoPaterno || ''} ${data.apellidoMaterno || ''}`.trim();
        candidatoForm.setValue('nombres', data.nombres, { shouldValidate: true });
        candidatoForm.setValue('apellidos', apellidos, { shouldValidate: true });
        setDniVerifiedData(data);
        toast.success(`Identidad verificada: ${data.nombreCompleto || data.nombres}`, {
          icon: '✅',
          duration: 3500,
        });
      } else {
        setDniVerifiedData(null);
        toast.error(data?.message || 'No se encontraron datos para el DNI');
      }
    } catch (error: any) {
      setDniVerifiedData(null);
      const status = error.response?.status;
      const serverMsg = error.response?.data?.message;
      let msg = serverMsg || 'Error al consultar DNI. Ingréselo manualmente.';
      if (status === 404) {
        msg = 'No se encontró el DNI en el servicio de consultas. Verifica el número o completa los datos manualmente.';
      } else if (status === 502) {
        msg = serverMsg || 'El servicio de consultas rechazó la petición. Puedes ingresar los datos manualmente.';
      }
      toast.error(msg);
    } finally {
      setIsValidatingDni(false);
    }
  };

  // Validar RUC con API SUNAT (APIsPERU)
  const handleValidarRuc = async (rucValue?: string) => {
    const ruc = (rucValue || empresaForm.getValues('ruc') || '').trim();
    if (!ruc || ruc.length !== 11) {
      toast.error('Ingrese un número de RUC válido de 11 dígitos');
      return;
    }

    setIsValidatingRuc(true);
    try {
      const data = await consultasService.consultarRuc(ruc);
      if (data && data.razonSocial) {
        empresaForm.setValue('razonSocial', data.razonSocial, { shouldValidate: true });
        setRucVerifiedData(data);
        toast.success(`RUC Verificado: ${data.razonSocial}`, {
          icon: '🏢',
          duration: 4000,
        });
      } else {
        setRucVerifiedData(null);
        toast.error(data?.message || 'No se encontraron datos para el RUC');
      }
    } catch (error: any) {
      setRucVerifiedData(null);
      const status = error.response?.status;
      const serverMsg = error.response?.data?.message;
      let msg = serverMsg || 'Error al consultar RUC. Ingrese los datos manualmente.';
      if (status === 404) {
        msg = 'No se encontró el RUC en el servicio de consultas. Verifica el número o completa los datos manualmente.';
      } else if (status === 502) {
        msg = serverMsg || 'El servicio de consultas rechazó la petición. Puedes ingresar los datos manualmente.';
      }
      toast.error(msg);
    } finally {
      setIsValidatingRuc(false);
    }
  };

  const onSubmitCandidato = async (data: CandidatoFormValues) => {
    try {
      const response = await authService.registerEstudiante(data);
      localStorage.setItem('jwt_token', response.token);
      const user = await authService.getMe();
      login(response.token, user);
      toast.success('¡Cuenta creada exitosamente!', { icon: '🎉' });
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
      toast.success('¡Empresa registrada correctamente!', { icon: '🏢' });
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
          type="button"
          onClick={() => {
            setRole('ESTUDIANTE');
            setDniVerifiedData(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 z-10 ${
            role === 'ESTUDIANTE' ? 'bg-white text-blue-600 shadow-[0_2px_10px_rgb(0,0,0,0.06)]' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <UserCircle className="w-4 h-4" /> Profesional
        </button>
        <button
          type="button"
          onClick={() => {
            setRole('EMPRESA');
            setRucVerifiedData(null);
          }}
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
            {/* Campo DNI con botón de autocompletar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700">DNI (RENIEC)</label>
                <span className="text-xs text-blue-600 font-medium">Validación automática</span>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Ej: 72458931"
                  maxLength={8}
                  {...candidatoForm.register('dni', {
                    onChange: (e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      candidatoForm.setValue('dni', val);
                      if (val.length === 8) {
                        handleValidarDni(val);
                      } else {
                        setDniVerifiedData(null);
                      }
                    },
                  })}
                  error={candidatoForm.formState.errors.dni?.message}
                />
                <button
                  type="button"
                  onClick={() => handleValidarDni()}
                  disabled={isValidatingDni}
                  className="px-3.5 h-10 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-md font-medium text-sm flex items-center gap-1.5 transition-colors disabled:opacity-50 flex-shrink-0"
                  title="Consultar DNI en RENIEC"
                >
                  {isValidatingDni ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>Validar</span>
                </button>
              </div>

              {/* Tarjeta de Identidad Verificada RENIEC */}
              {dniVerifiedData && (
                <div className="mt-2.5 p-2.5 rounded-lg bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{dniVerifiedData.nombreCompleto || dniVerifiedData.nombres}</p>
                      <p className="text-[11px] text-emerald-600 font-medium">Verificado con RENIEC Oficial</p>
                    </div>
                  </div>
                  {dniVerifiedData.codVerifica && (
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-mono">
                      Dígito: {dniVerifiedData.codVerifica}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombres"
                placeholder="Juan"
                {...candidatoForm.register('nombres')}
                error={candidatoForm.formState.errors.nombres?.message}
              />
              <Input
                label="Apellidos"
                placeholder="Pérez García"
                {...candidatoForm.register('apellidos')}
                error={candidatoForm.formState.errors.apellidos?.message}
              />
            </div>

            <Input
              label="Correo electrónico"
              type="email"
              placeholder="juan@email.com"
              {...candidatoForm.register('email')}
              error={candidatoForm.formState.errors.email?.message}
            />

            <div className="relative">
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...candidatoForm.register('password')}
                error={candidatoForm.formState.errors.password?.message}
              />
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
            {/* Campo RUC con botón de autocompletar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700">RUC (SUNAT)</label>
                <span className="text-xs text-blue-600 font-medium">Validación automática</span>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Ej: 20131312955"
                  maxLength={11}
                  {...empresaForm.register('ruc', {
                    onChange: (e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      empresaForm.setValue('ruc', val);
                      if (val.length === 11) {
                        handleValidarRuc(val);
                      } else {
                        setRucVerifiedData(null);
                      }
                    },
                  })}
                  error={empresaForm.formState.errors.ruc?.message}
                />
                <button
                  type="button"
                  onClick={() => handleValidarRuc()}
                  disabled={isValidatingRuc}
                  className="px-3.5 h-10 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-md font-medium text-sm flex items-center gap-1.5 transition-colors disabled:opacity-50 flex-shrink-0"
                  title="Consultar RUC en SUNAT"
                >
                  {isValidatingRuc ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>Validar</span>
                </button>
              </div>

              {/* Tarjeta de RUC Verificado SUNAT */}
              {rucVerifiedData && (
                <div className="mt-2.5 p-3 rounded-lg bg-blue-50/90 border border-blue-200 text-blue-900 text-xs space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-900">{rucVerifiedData.razonSocial}</span>
                    </div>
                    {rucVerifiedData.estado && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rucVerifiedData.estado === 'ACTIVO' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rucVerifiedData.estado} {rucVerifiedData.condicion ? `• ${rucVerifiedData.condicion}` : ''}
                      </span>
                    )}
                  </div>
                  {rucVerifiedData.direccion && (
                    <div className="flex items-start gap-1 text-[11px] text-slate-600">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-400" />
                      <span>{rucVerifiedData.direccion}</span>
                    </div>
                  )}
                  {rucVerifiedData.distrito && (
                    <p className="text-[10px] text-slate-500 pl-4 font-medium">
                      {rucVerifiedData.distrito}, {rucVerifiedData.provincia}, {rucVerifiedData.departamento}
                    </p>
                  )}
                </div>
              )}
            </div>

            <Input
              label="Razón Social"
              placeholder="Mi Empresa S.A.C"
              {...empresaForm.register('razonSocial')}
              error={empresaForm.formState.errors.razonSocial?.message}
            />

            <Input
              label="Correo Corporativo"
              type="email"
              placeholder="contacto@empresa.com"
              {...empresaForm.register('email')}
              error={empresaForm.formState.errors.email?.message}
            />

            <div className="relative">
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...empresaForm.register('password')}
                error={empresaForm.formState.errors.password?.message}
              />
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
