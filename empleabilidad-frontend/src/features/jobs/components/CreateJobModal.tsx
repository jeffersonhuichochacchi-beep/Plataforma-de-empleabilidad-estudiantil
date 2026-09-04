import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { jobService } from '../services/job.service';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

interface CreateJobModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuthStore();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    if (!user?.id) return;
    setError('');

    if (!data.fechaVencimiento) {
      setError('Debe indicar una fecha de vencimiento válida');
      return;
    }

    const payload = {
      oferta: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        categoriaId: '6982324e-9a26-4c22-9634-fd18b5d3f0c1', // Hardcoded seeded category for now
        areaProfesional: data.areaProfesional,
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
        aceptaPostulaciones: true
      },
      requisitos: []
    };

    try {
      console.log('Enviando payload:', payload);
      console.log('ID de usuario (empresaId):', user.id);
      const createdJob = await jobService.createJob(user.id, payload);
      console.log('Oferta creada:', createdJob);
      // Backend automatically sets state to BORRADOR. We submit it for admin review!
      await jobService.submitForReview(createdJob.id);
      toast.success('Oferta enviada a revisión para aprobación del administrador!');
      onSuccess();
    } catch (err: any) {
      console.error('Error completo:', err);
      console.error('Response data:', err.response?.data);
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
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{error}</div>}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input label="Título del Puesto" placeholder="Ej: Desarrollador Frontend Senior" {...register('titulo', { required: true })} />
            
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Descripción</label>
              <textarea 
                rows={4} 
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Describe las responsabilidades y beneficios..."
                {...register('descripcion', { required: true })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Área Profesional" placeholder="Ej: Tecnología" {...register('areaProfesional', { required: true })} />
              <Input label="Ubicación" placeholder="Ej: Lima, Perú" {...register('ubicacion')} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Fecha de vencimiento"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                {...register('fechaVencimiento', { required: true })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Nivel</label>
                <select className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" {...register('nivelExperiencia')} defaultValue="EXPERTO">
                  <option value="SIN_EXPERIENCIA">Sin Experiencia</option>
                  <option value="PRACTICANTE">Practicante</option>
                  <option value="JUNIOR">Junior</option>
                  <option value="SEMI_SENIOR">Semi Senior</option>
                  <option value="SENIOR">Senior</option>
                  <option value="EXPERTO">Experto</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Modalidad</label>
                <select className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" {...register('modalidad')} defaultValue="REMOTO">
                  <option value="PRESENCIAL">Presencial</option>
                  <option value="REMOTO">Remoto</option>
                  <option value="HIBRIDO">Híbrido</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Contrato</label>
                <select className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" {...register('tipoContrato')} defaultValue="MEDIO_TIEMPO">
                  <option value="TIEMPO_COMPLETO">Tiempo Completo</option>
                  <option value="MEDIO_TIEMPO">Medio Tiempo</option>
                  <option value="FREELANCE">Freelance</option>
                  <option value="TEMPORAL">Temporal</option>
                  <option value="POR_PROYECTO">Por Proyecto</option>
                  <option value="PRACTICAS">Prácticas</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Salario Mínimo (Opcional)" type="number" placeholder="2000" {...register('salarioMinimo')} />
              <Input label="Salario Máximo (Opcional)" type="number" placeholder="4000" {...register('salarioMaximo')} />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button type="submit" isLoading={isSubmitting}>Publicar Oferta</Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
