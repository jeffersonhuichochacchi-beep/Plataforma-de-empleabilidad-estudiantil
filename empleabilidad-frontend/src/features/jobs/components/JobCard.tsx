import React from 'react';
import type { OfertaResponse } from '../types/job.types';
import { MapPin, Banknote, Clock, Briefcase, Building2 } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { Link } from 'react-router-dom';

interface JobCardProps {
  job: OfertaResponse;
}

const formatSalary = (min?: number, max?: number, currency: string = 'USD') => {
  if (!min && !max) return 'Salario no especificado';
  const format = (val: number) => new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(val);
  if (min && !max) return `Desde ${format(min)}`;
  if (!min && max) return `Hasta ${format(max)}`;
  if (min === max && min) return format(min);
  return `${format(min!)} - ${format(max!)}`;
};

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-100 flex flex-col h-full animate-fade-in group hover:-translate-y-1 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -z-10 group-hover:bg-blue-100 transition-colors"></div>
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-4">
          <div className="h-14 w-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm">
            <Building2 className="h-7 w-7 text-slate-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {job.titulo}
            </h3>
            <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
              Empresa Confidencial {/* We'd need to fetch or include Empresa name */}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
          <Briefcase className="w-3.5 h-3.5" />
          {job.modalidad.replace('_', ' ')}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold">
          <Clock className="w-3.5 h-3.5" />
          {job.tipoContrato.replace('_', ' ')}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
          {job.nivelExperiencia.replace('_', ' ')}
        </span>
      </div>

      <p className="text-slate-600 text-sm line-clamp-2 mb-6 flex-1">
        {job.descripcion}
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto pt-4 border-t border-slate-100">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
            <MapPin className="w-4 h-4 text-slate-400" />
            {job.ubicacion || `${job.distrito || ''}, ${job.pais || 'Remoto'}`.replace(/^, /, '')}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
            <Banknote className="w-4 h-4 text-slate-400" />
            {formatSalary(job.salarioMinimo, job.salarioMaximo, job.moneda)}
          </div>
        </div>
        
        <Link to={`/empleos/${job.id}`}>
          <Button variant="secondary" size="sm" className="w-full sm:w-auto shadow-none group-hover:bg-blue-600 group-hover:text-white transition-all">
            Ver detalles
          </Button>
        </Link>
      </div>
    </div>
  );
};
