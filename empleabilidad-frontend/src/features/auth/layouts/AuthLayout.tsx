import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left panel - Premium Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-slate-900 text-white p-12 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,_#1e3a8a_0%,_transparent_60%)] opacity-40 mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_#3b82f6_0%,_transparent_50%)] opacity-20 mix-blend-screen pointer-events-none"></div>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 pointer-events-none"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <span className="text-2xl font-black tracking-tight text-white">Emplea<span className="text-blue-400">Pro</span></span>
        </div>

        <div className="relative z-10 max-w-lg mt-20 mb-auto">
          <h1 className="text-5xl font-extrabold mb-6 leading-[1.1] tracking-tight">
            Descubre tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">verdadero potencial.</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed mb-8">
            Únete a la plataforma donde las mejores empresas y los talentos más destacados se encuentran. Construye tu futuro hoy.
          </p>
          
          {/* Trust badges */}
          <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
            <div className="flex -space-x-3">
               <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700"></div>
               <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-600"></div>
               <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-500"></div>
            </div>
            <span>+10,000 profesionales ya se unieron</span>
          </div>
        </div>
        
        <div className="relative z-10 text-sm text-slate-500 font-medium">
          © 2026 EmpleaPro Inc.
        </div>
      </div>

      {/* Right panel - Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 xl:p-24 relative">
        <div className="absolute inset-0 bg-slate-50 pointer-events-none"></div>
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 relative z-10 animate-fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
