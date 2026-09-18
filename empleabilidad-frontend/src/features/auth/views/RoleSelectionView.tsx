import React from 'react';
import { ArrowRight, Building2, ShieldCheck, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type LoginRole = 'ESTUDIANTE' | 'EMPRESA' | 'ADMINISTRADOR';

const roles: Array<{
  role: LoginRole;
  title: string;
  description: string;
  icon: React.ElementType;
  tone: string;
  register?: boolean;
}> = [
  {
    role: 'ESTUDIANTE',
    title: 'Soy Profesional',
    description: 'Postula a empleos, gestiona tu CV y sigue tus procesos.',
    icon: UserCircle,
    tone: 'bg-blue-50 text-blue-600',
    register: true,
  },
  {
    role: 'EMPRESA',
    title: 'Soy Empresa',
    description: 'Publica ofertas, evalúa candidatos y encuentra talento.',
    icon: Building2,
    tone: 'bg-emerald-50 text-emerald-600',
    register: true,
  },
  {
    role: 'ADMINISTRADOR',
    title: 'Administrador',
    description: 'Acceso exclusivo al panel de supervisión y gestión.',
    icon: ShieldCheck,
    tone: 'bg-slate-100 text-slate-700',
  },
];

export const RoleSelectionView: React.FC = () => {
  const navigate = useNavigate();

  const goToLogin = (role: LoginRole) => {
    navigate(`/auth/login?role=${role}`);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col items-center text-center mb-1">
        <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
          <UserCircle className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Portal de Acceso</h2>
        <p className="text-slate-500 text-sm mt-1">Selecciona tu tipo de perfil para ingresar a la plataforma</p>
      </div>

      <div className="space-y-3">
        {roles.map(({ role, title, description, icon: Icon, tone, register }) => (
          <div key={role} className="group rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
            <button type="button" onClick={() => goToLogin(role)} className="flex w-full items-center gap-3 text-left">
              <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-slate-800">{title}</span>
                <span className="mt-0.5 block truncate text-xs text-slate-500">{description}</span>
              </span>
              <ArrowRight className="h-5 w-5 flex-shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
            </button>
            {register && (
              <button type="button" onClick={() => navigate(`/auth/register?role=${role}`)} className="ml-14 mt-1 text-xs font-semibold text-blue-600 hover:underline">
                Crear cuenta nueva
              </button>
            )}
          </div>
        ))}
      </div>

      <a href="/" className="border-t border-slate-100 pt-4 text-center text-sm text-slate-500 hover:text-blue-600">
        ← Volver a la página principal
      </a>
    </div>
  );
};
