import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { ofertasPublicApi } from '@/core/api';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { jobService } from '../services/job.service';

interface CategoriaOferta { id: string; nombre: string; activo?: boolean; }

interface CreateJobModalProps { onClose: () => void; onSuccess: () => void; }

export const CreateJobModal: React.FC<CreateJobModalProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuthStore();
  const [error, setError] = useState('');
  const [categorias, setCategorias] = useState<CategoriaOferta[]>([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    let mounted = true;
    const cargarCategorias = async () => {
      try {
        const { data } = await ofertasPublicApi.get<{ content: CategoriaOferta[] }>('/categorias', {
          params: { size: 100, sort: 'nombre,asc', _t: Date.now() },
        });
        if (mounted) setCategorias((data.content || []).filter((categoria) => categoria.activo !== false));
      } catch {
        if (mounted) setError('No se pudieron cargar las categorias de ofertas');
      } finally {
        if (mounted) setCargandoCategorias(false);
      }
    };
    void cargarCategorias();
    const interval = window.setInterval(() => void cargarCategorias(), 10000);
    return () => { mounted = false; window.clearInterval(interval); };
  }, []);

  const onSubmit = async (data: any) => {
    if (!user?.id) return;
    setError('');
    if (!data.fechaVencimiento) { setError('Debe indicar una fecha de vencimiento valida'); return; }
    if (!data.areaProfesional) { setError('Seleccione un area profesional'); return; }
    const categoria = categorias.find((item) => item.nombre === data.areaProfesional);
    if (!categoria) { setError('La categoria seleccionada ya no esta disponible. Actualice la lista e intente nuevamente.'); return; }

    const payload = {
      oferta: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        categoriaId: categoria.id,
        areaProfesional: categoria.nombre,
        nivelExperiencia: data.nivelExperiencia,
        tipoContrato: data.tipoContrato,
        modalidad: data.modalidad,
        jornada: 'DIURNA',
        salarioMinimo: data.salarioMinimo ? Number(data.salarioMinimo) : null,
        salarioMaximo: data.salarioMaximo ? Number(data.salarioMaximo) : null,
        moneda: 'PEN',
        ubicacion: data.ubicacion,
        fechaVencimiento: new Date(`${data.fechaVencimiento}T23:59:59`).toISOString(),
        estado: 'PUBLICADA',
        aceptaPostulaciones: true,
      },
      requisitos: [],
    };

    try {
      const createdJob = await jobService.createJob(user.id, payload);
      await jobService.submitForReview(createdJob.id);
      toast.success('Oferta enviada a revision para aprobacion del administrador');
      onSuccess();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Error al crear la oferta';
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-slide-up">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-slate-900">Crear Nueva Oferta</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input label="Titulo del Puesto" placeholder="Ej: Desarrollador Frontend Senior" {...register('titulo', { required: true })} />
            <div><label className="text-sm font-medium text-slate-700 block mb-1.5">Descripcion</label><textarea rows={4} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Describe las responsabilidades y beneficios..." {...register('descripcion', { required: true })} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium text-slate-700 block mb-1.5">Area Profesional</label><select className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-100" disabled={cargandoCategorias || categorias.length === 0} defaultValue="" {...register('areaProfesional', { required: true })}><option value="">{cargandoCategorias ? 'Cargando categorias...' : 'Seleccione un area profesional'}</option>{categorias.map((categoria) => <option key={categoria.id} value={categoria.nombre}>{categoria.nombre}</option>)}</select>{!cargandoCategorias && categorias.length === 0 && <p className="mt-1 text-xs text-red-600">No hay categorias activas disponibles.</p>}</div>
              <Input label="Ubicacion" placeholder="Ej: Lima, Peru" {...register('ubicacion')} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Input label="Fecha de vencimiento" type="date" min={new Date().toISOString().split('T')[0]} {...register('fechaVencimiento', { required: true })} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><label className="text-sm font-medium text-slate-700 block mb-1.5">Nivel</label><select className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm" {...register('nivelExperiencia')} defaultValue="EXPERTO"><option value="SIN_EXPERIENCIA">Sin Experiencia</option><option value="PRACTICANTE">Practicante</option><option value="JUNIOR">Junior</option><option value="SEMI_SENIOR">Semi Senior</option><option value="SENIOR">Senior</option><option value="EXPERTO">Experto</option></select></div>
              <div><label className="text-sm font-medium text-slate-700 block mb-1.5">Modalidad</label><select className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm" {...register('modalidad')} defaultValue="REMOTO"><option value="PRESENCIAL">Presencial</option><option value="REMOTO">Remoto</option><option value="HIBRIDO">Hibrido</option></select></div>
              <div><label className="text-sm font-medium text-slate-700 block mb-1.5">Contrato</label><select className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm" {...register('tipoContrato')} defaultValue="MEDIO_TIEMPO"><option value="TIEMPO_COMPLETO">Tiempo Completo</option><option value="MEDIO_TIEMPO">Medio Tiempo</option><option value="FREELANCE">Freelance</option><option value="TEMPORAL">Temporal</option><option value="POR_PROYECTO">Por Proyecto</option><option value="PRACTICAS">Practicas</option></select></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Input label="Salario Minimo (Opcional)" type="number" placeholder="2000" {...register('salarioMinimo')} /><Input label="Salario Maximo (Opcional)" type="number" placeholder="4000" {...register('salarioMaximo')} /></div>
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button><Button type="submit" isLoading={isSubmitting}>Publicar Oferta</Button></div>
          </form>
        </div>
      </div>
    </div>
  );
};
