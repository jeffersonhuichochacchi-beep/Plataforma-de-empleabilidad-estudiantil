import React, { useEffect, useState } from 'react';
import { Plus, Briefcase, MapPin, Users, Edit, Trash2, Eye } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { jobService } from '../services/job.service';
import type { OfertaResponse } from '../types/job.types';
import type { PageResponse } from '@/shared/types';
import { Button } from '@/shared/components/Button';
import { CreateJobModal } from '../components/CreateJobModal';
import toast from 'react-hot-toast';

export const CompanyOfertasView: React.FC = () => {
  const { user } = useAuthStore();
  const [jobsData, setJobsData] = useState<PageResponse<OfertaResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMyJobs = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      // By default, backend sorts by latest or we can pass sort params
      const data = await jobService.getCompanyJobs(user.id, { size: 20 });
      setJobsData(data);
    } catch (error) {
      console.error('Error fetching company jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, [user?.id]);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Panel de Ofertas</h1>
          <p className="text-slate-500 text-sm mt-1">Gestiona tus vacantes y revisa las postulaciones.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-md shadow-blue-600/20">
          <Plus className="h-4 w-4" />
          Nueva Oferta
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
        </div>
      ) : jobsData?.content.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center">
          <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Aún no tienes ofertas publicadas</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">Crea tu primera oferta de trabajo para empezar a recibir postulantes de la red de EmpleaPro.</p>
          <Button onClick={() => setIsModalOpen(true)}>Crear mi primera oferta</Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="px-6 py-4">Cargo / Posición</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Modalidad</th>
                  <th className="px-6 py-4">Postulantes</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobsData?.content.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{job.titulo}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <MapPin className="h-3 w-3" />
                        {job.ubicacion || job.pais}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        job.estado === 'PUBLICADA'             ? 'bg-emerald-100 text-emerald-800' :
                        job.estado === 'PENDIENTE_APROBACION'  ? 'bg-amber-100 text-amber-800'   :
                        job.estado === 'RECHAZADA'             ? 'bg-red-100 text-red-800'        :
                        job.estado === 'CERRADA'               ? 'bg-slate-100 text-slate-600'    :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {job.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{job.modalidad.replace('_', ' ')}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-900">
                        <Users className="h-4 w-4 text-slate-400" />
                        {job.numeroPostulaciones}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {(job.estado === 'BORRADOR' || job.estado === 'RECHAZADA') && (
                        <button 
                          onClick={async () => {
                            try {
                              await jobService.submitForReview(job.id);
                              toast.success('Oferta enviada a revisión. El administrador la revisará pronto.');
                              fetchMyJobs();
                            } catch (e: any) {
                              toast.error('Error al enviar la oferta a revisión');
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-amber-600 transition-colors font-medium text-xs border rounded bg-amber-50 border-amber-200" title="Enviar a revisión">
                          {job.estado === 'RECHAZADA' ? 'Reenviar' : 'Enviar a revisión'}
                        </button>
                      )}
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Ver detalle">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors" title="Editar">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Cerrar oferta">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal para crear oferta */}
      {isModalOpen && (
        <CreateJobModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchMyJobs();
          }} 
        />
      )}
    </div>
  );
};
