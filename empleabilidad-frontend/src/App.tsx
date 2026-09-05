import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthLayout } from './features/auth/layouts/AuthLayout';
import { LoginView } from './features/auth/views/LoginView';
import { RegisterView } from './features/auth/views/RegisterView';
import { ProtectedRoute } from './core/ProtectedRoute';

// Layouts
import { PublicLayout } from './app/layouts/PublicLayout';
import { SharedLayout } from './app/layouts/SharedLayout';
import { CandidateLayout } from './app/layouts/CandidateLayout';
import { CompanyLayout } from './app/layouts/CompanyLayout';
import { AdminLayout } from './app/layouts/AdminLayout';

import { EmpleosView } from './features/jobs/views/EmpleosView';
import { JobDetailView } from './features/jobs/views/JobDetailView';
import { CompanyOfertasView } from './features/jobs/views/CompanyOfertasView';
import { CompanyCandidatosView } from './features/jobs/views/CompanyCandidatosView';
import { CompanyEvaluacionesView } from './features/jobs/views/CompanyEvaluacionesView';
import { CandidateSearchView } from './features/jobs/views/CandidateSearchView';
import { ProfileOnboardingView } from './features/profile/views/ProfileOnboardingView';
import { AdminDashboardView } from './features/admin/views/AdminDashboardView';
import { AdminOfertasView } from './features/admin/views/AdminOfertasView';

// --- VISTAS PUBLICAS (VISITANTE) ---
const Inicio = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden bg-slate-50">
    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 blur-[120px] rounded-full pointer-events-none"></div>
    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-400/20 blur-[120px] rounded-full pointer-events-none"></div>

    <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-8 shadow-sm animate-fade-in">
        <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
        Nueva plataforma 2026
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8 animate-slide-up">
        El trabajo de tus sueños <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
          está a un clic de distancia.
        </span>
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mb-12 leading-relaxed animate-slide-up" style={{animationDelay: '100ms'}}>
        Únete a la red de profesionales más exclusiva y conecta con las empresas que están transformando la industria en toda la región.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up" style={{animationDelay: '200ms'}}>
        <a href="/auth/register" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 text-lg flex items-center justify-center gap-2">
          Comenzar ahora
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </a>
        <a href="/empleos" className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all text-lg">
          Explorar empleos
        </a>
      </div>
      
      {/* Admin Panel Link - Dev Only */}
      <div className="mt-16 pt-8 border-t border-slate-200 w-full max-w-md">
        <p className="text-sm text-slate-500 mb-3">Panel de Administración</p>
        <a 
          href="/admin/dashboard" 
          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-600/30"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="14" y="3" width="7" height="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="14" y="14" width="7" height="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="3" y="14" width="7" height="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Acceder al Panel Admin
        </a>
      </div>
    </div>
  </div>
);
const EmpresasPublicas = () => <div className="p-8"><h1 className="text-3xl font-bold text-slate-800">Explorar Empresas</h1><p className="text-slate-500 mt-2">Descubre tu próximo gran lugar de trabajo.</p></div>;

// --- VISTAS PROTEGIDAS (CANDIDATO) ---
const CandidatoPostulaciones = () => <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"><h1 className="text-2xl font-bold text-slate-800">Mis Postulaciones</h1><p className="text-slate-500 mt-2">Haz seguimiento al estado de tus procesos.</p></div>;
const CandidatoEntrevistas = () => <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"><h1 className="text-2xl font-bold text-slate-800">Mis Entrevistas</h1><p className="text-slate-500 mt-2">Organiza y prepárate para tus próximas citas.</p></div>;


function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
            fontSize: '14px'
          }
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* --- RAMA PÚBLICA (Solo home y empresas) --- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/empresas" element={<EmpresasPublicas />} />
          </Route>

          {/* --- RAMA COMPARTIDA (Empleos - detecta si hay sesión) --- */}
          <Route element={<SharedLayout />}>
            <Route path="/empleos" element={<EmpleosView />} />
            <Route path="/empleos/:id" element={<JobDetailView />} />
          </Route>

          {/* --- RAMA LOGIN --- */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginView />} />
            <Route path="register" element={<RegisterView />} />
          </Route>

          {/* --- ADMIN (PÚBLICO POR AHORA) --- */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardView />} />
            <Route path="usuarios" element={<AdminDashboardView />} />
            <Route path="usuarios/listado" element={<AdminDashboardView />} />
            <Route path="usuarios/candidatos" element={<AdminDashboardView />} />
            <Route path="usuarios/empresas" element={<AdminDashboardView />} />
            <Route path="usuarios/roles" element={<AdminDashboardView />} />
            <Route path="ofertas" element={<AdminOfertasView />} />
            <Route path="ofertas/listado" element={<AdminOfertasView />} />
            <Route path="ofertas/categorias" element={<AdminOfertasView />} />
            <Route path="postulaciones" element={<AdminDashboardView />} />
            <Route path="postulaciones/listado" element={<AdminDashboardView />} />
            <Route path="postulaciones/estados" element={<AdminDashboardView />} />
            <Route path="postulaciones/entrevistas" element={<AdminDashboardView />} />
            <Route path="estadisticas" element={<AdminDashboardView />} />
            <Route path="notificaciones" element={<AdminDashboardView />} />
            <Route path="reportes" element={<AdminDashboardView />} />
            <Route path="configuracion" element={<AdminDashboardView />} />
          </Route>

          {/* --- RAMAS PROTEGIDAS --- */}
          <Route element={<ProtectedRoute />}>

            {/* CANDIDATO */}
            <Route path="/candidato" element={<CandidateLayout />}>
              <Route index element={<Navigate to="buscar" replace />} />
              <Route path="buscar" element={<CandidateSearchView />} />
              <Route path="perfil" element={<ProfileOnboardingView />} />
              <Route path="postulaciones" element={<CandidatoPostulaciones />} />
              <Route path="entrevistas" element={<CandidatoEntrevistas />} />
            </Route>

            {/* EMPRESA */}
            <Route path="/empresa" element={<CompanyLayout />}>
              <Route index element={<Navigate to="ofertas" replace />} />
              <Route path="ofertas" element={<CompanyOfertasView />} />
              <Route path="candidatos" element={<CompanyCandidatosView />} />
              <Route path="evaluaciones" element={<CompanyEvaluacionesView />} />
              <Route path="perfil" element={<ProfileOnboardingView />} />
            </Route>

          </Route>

          {/* Fallback general */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;


