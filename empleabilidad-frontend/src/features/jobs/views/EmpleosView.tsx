import React, { useEffect, useState } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import { jobService } from '../services/job.service';
import { JobCard } from '../components/JobCard';
import type { OfertaResponse } from '../types/job.types';
import type { PageResponse } from '@/shared/types';

import { Button } from '@/shared/components/Button';

export const EmpleosView: React.FC = () => {
  const [jobsData, setJobsData] = useState<PageResponse<OfertaResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchJobs = async (q: string = '') => {
    setIsLoading(true);
    try {
      const data = await jobService.getPublicJobs({ q, size: 12 });
      setJobsData(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs(searchTerm);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Header & Search */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Descubre tu próximo <span className="text-blue-600">gran reto</span>
          </h1>
          <p className="text-lg text-slate-500 mb-8">
            Explora ofertas de trabajo que coinciden con tu talento y aspiraciones.
          </p>
          
          <form onSubmit={handleSearch} className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex-1 relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cargo, palabra clave o empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-transparent focus:outline-none text-slate-700 placeholder:text-slate-400"
              />
            </div>
            <div className="hidden sm:block w-px h-8 bg-slate-200 mx-2"></div>
            <Button type="button" variant="ghost" className="hidden sm:flex text-slate-500 hover:text-slate-700">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button type="submit" size="lg" className="rounded-xl px-8 shadow-md shadow-blue-600/20">
              Buscar
            </Button>
          </form>
        </div>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {isLoading ? 'Buscando...' : `${jobsData?.totalElements || 0} Empleos Encontrados`}
          </h2>
          <div className="text-sm font-medium text-slate-500">
            Página {jobsData ? jobsData.number + 1 : 0} de {jobsData?.totalPages || 0}
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="relative"><Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4 relative z-10" /><div className="absolute inset-0 bg-blue-400 blur-xl opacity-30 animate-pulse"></div></div>
            <p className="text-slate-500 font-medium">Cargando oportunidades...</p>
          </div>
        ) : jobsData?.content.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No se encontraron ofertas</h3>
            <p className="text-slate-500">Intenta buscar con otros términos o ajusta los filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobsData?.content.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
