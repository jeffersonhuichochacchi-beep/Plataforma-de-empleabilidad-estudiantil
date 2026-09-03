import React, { useEffect, useState } from 'react';
import { Search, MapPin, Briefcase, Calendar, DollarSign, Building2, Clock } from 'lucide-react';
import { jobService } from '../services/job.service';
import type { OfertaResponse } from '../types/job.types';
import type { PageResponse } from '@/shared/types';
import { Button } from '@/shared/components/Button';
import { useNavigate } from 'react-router-dom';

export const CandidateSearchView: React.FC = () => {
  const navigate = useNavigate();
  const [jobsData, setJobsData] = useState<PageResponse<OfertaResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPublicJobs = async () => {
    setIsLoading(true);
    try {
      // Solo obtener ofertas publicadas (estado PUBLICADA)
      const data = await jobService.getPublicJobs({ 
        size: 20, 
        sort: 'fechaPublicacion,desc',
        q: searchTerm || undefined 
      });
      setJobsData(data);
    } catch (error) {
      console.error('Error fetching public jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicJobs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPublicJobs();
  };

  const formatSalary = (min?: number, max?: number, moneda?: string) => {
    if (!min && !max) return 'Salario no especificado';
    const currency = moneda === 'PEN' ? 'S/' : '$';
    if (min && max) return `${currency}${min} - ${currency}${max}`;
    if (min) return `Desde ${currency}${min}`;
    if (max) return `Hasta ${currency}${max}`;
    return 'Salario no especificado';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const translateEnum = (value: string) => {
    const translations: Record<string, string> = {
      'TIEMPO_COMPLETO': 'Tiempo Completo',
      'MEDIO_TIEMPO': 'Medio Tiempo',
      'FREELANCE': 'Freelance',
      'TEMPORAL': 'Temporal',
      'POR_PROYECTO': 'Por Proyecto',
      'PRACTICAS': 'Prácticas',
      'PRESENCIAL': 'Presencial',
      'REMOTO': 'Remoto',
      'HIBRIDO': 'Híbrido',
      'JUNIOR': 'Junior',
      'SEMI_SENIOR': 'Semi Senior',
      'SENIOR': 'Senior',
      'EXPERTO': 'Experto',
      'SIN_EXPERIENCIA': 'Sin Experiencia',
      'PRACTICANTE': 'Practicante'
    };
    return translations[value] || value;
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header con buscador */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-2">Buscar Ofertas Laborales</h1>
        <p className="text-blue-100 mb-6">Encuentra tu próxima oportunidad profesional</p>
        
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título, área profesional o ubicación..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border-0 bg-white shadow-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <Button type="submit" className="px-8 shadow-lg bg-white text-blue-600 hover:bg-blue-50">
            Buscar
          </Button>
        </form>
      </div>

      {/* Contador de resultados */}
      {jobsData && (
        <div className="mb-6">
          <p className="text-slate-600 font-medium">
            {jobsData.totalElements === 0 ? (
              'No se encontraron ofertas'
            ) : (
              <>
                Mostrando <span className="text-blue-600 font-bold">{jobsData.content.length}</span> de{' '}
                <span className="text-blue-600 font-bold">{jobsData.totalElements}</span> ofertas publicadas
              </>
            )}
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
        </div>
      ) : jobsData?.content.length === 0 ? (
        /* Estado vacío */
        <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center">
          <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No hay ofertas disponibles</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            {searchTerm 
              ? 'No se encontraron ofertas que coincidan con tu búsqueda. Intenta con otros términos.'
              : 'Aún no hay ofertas laborales publicadas. Vuelve pronto para ver nuevas oportunidades.'}
          </p>
        </div>
      ) : (
        /* Grid de ofertas */
        <div className="grid grid-cols-1 gap-6">
          {jobsData?.content.map((job) => (
            <div 
              key={job.id} 
              className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer"
              onClick={() => navigate(`/empleos/${job.id}`)}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                      {job.titulo}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        <span>Empresa ID: {job.empresaId.substring(0, 8)}...</span>
                      </div>
                      {job.ubicacion && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span>{job.ubicacion}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span>Publicado {formatDate(job.fechaPublicacion)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <p className="text-slate-600 mb-4 line-clamp-2">
                  {job.descripcion}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                    <Briefcase className="h-3.5 w-3.5" />
                    {translateEnum(job.tipoContrato)}
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
                    {translateEnum(job.modalidad)}
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                    {translateEnum(job.nivelExperiencia)}
                  </span>
                  {job.areaProfesional && (
                    <span className="inline-flex items-center px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium">
                      {job.areaProfesional}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm">{formatSalary(job.salarioMinimo, job.salarioMaximo, job.moneda)}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    {job.fechaVencimiento && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>Vence: {new Date(job.fechaVencimiento).toLocaleDateString('es-PE')}</span>
                      </div>
                    )}
                    <Button 
                      size="sm" 
                      className="group-hover:bg-blue-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/empleos/${job.id}`);
                      }}
                    >
                      Ver detalles
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginación (placeholder para futura implementación) */}
      {jobsData && jobsData.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="bg-white rounded-xl border border-slate-200 px-6 py-3 shadow-sm">
            <p className="text-sm text-slate-600">
              Página {jobsData.number + 1} de {jobsData.totalPages}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
