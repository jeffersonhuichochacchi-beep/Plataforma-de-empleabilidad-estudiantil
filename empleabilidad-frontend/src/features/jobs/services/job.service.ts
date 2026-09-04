import { ofertasApi, postulacionesApi } from '@/core/api';
import type { PageResponse } from '@/shared/types';
import type { OfertaResponse } from '../types/job.types';

export const jobService = {
  async getPublicJobs(params?: Record<string, any>): Promise<PageResponse<OfertaResponse>> {
    // Only fetch PUBLICADA jobs for the public board
    const { data } = await ofertasApi.get<PageResponse<OfertaResponse>>('/ofertas', {
      params: { soloActivas: true, estado: 'PUBLICADA', ...params },
    });
    return data;
  },

  // Admin: obtiene TODAS las ofertas (sin filtro de estado forzado)
  async getAllJobsAdmin(params?: Record<string, any>): Promise<PageResponse<OfertaResponse>> {
    const { data } = await ofertasApi.get<PageResponse<OfertaResponse>>('/ofertas', {
      params: { ...params },
    });
    return data;
  },

  async getJobById(id: string): Promise<OfertaResponse> {
    const { data } = await ofertasApi.get<OfertaResponse>(`/ofertas/${id}`);
    return data;
  },

  async getCompanyJobs(empresaId: string, params?: Record<string, any>): Promise<PageResponse<OfertaResponse>> {
    const { data } = await ofertasApi.get<PageResponse<OfertaResponse>>('/ofertas', {
      params: { empresaId, ...params },
    });
    return data;
  },

  async createJob(empresaId: string, payload: Record<string, any>): Promise<OfertaResponse> {
    const { data } = await ofertasApi.post<OfertaResponse>(`/ofertas?empresaId=${empresaId}`, payload);
    return data;
  },

  // Empresa: envía la oferta a revisión del admin (antes era "publicar")
  async submitForReview(id: string): Promise<OfertaResponse> {
    const { data } = await ofertasApi.patch<OfertaResponse>(`/ofertas/${id}/enviar-revision`);
    return data;
  },

  // Alias retrocompatible
  async publishJob(id: string): Promise<OfertaResponse> {
    return this.submitForReview(id);
  },

  // Admin: aprueba la oferta → pasa a PUBLICADA
  async approveJob(id: string): Promise<OfertaResponse> {
    const { data } = await ofertasApi.patch<OfertaResponse>(`/ofertas/${id}/aprobar`);
    return data;
  },

  // Empresa: actualiza una oferta existente
  async updateJob(id: string, payload: Record<string, any>): Promise<OfertaResponse> {
    const { data } = await ofertasApi.put<OfertaResponse>(`/ofertas/${id}`, payload);
    return data;
  },

  // Empresa/Admin: cierra definitivamente la oferta
  async closeJob(id: string): Promise<OfertaResponse> {
    const { data } = await ofertasApi.patch<OfertaResponse>(`/ofertas/${id}/cerrar`);
    return data;
  },

  // Empresa/Admin: cancela la oferta
  async cancelJob(id: string): Promise<OfertaResponse> {
    const { data } = await ofertasApi.patch<OfertaResponse>(`/ofertas/${id}/cancelar`);
    return data;
  },

  // Admin: rechaza la oferta → pasa a RECHAZADA
  async rejectJob(id: string, motivo?: string): Promise<OfertaResponse> {
    const { data } = await ofertasApi.patch<OfertaResponse>(`/ofertas/${id}/rechazar`, null, {
      params: motivo ? { motivo } : {},
    });
    return data;
  },

  async applyToJob(ofertaId: string, empresaId: string, payload: { cartaPresentacion?: string; cvUrl?: string } = {}) {
    const { data } = await postulacionesApi.post('/postulaciones', {
      ofertaId,
      empresaId,
      cartaPresentacion: payload.cartaPresentacion || '',
      cvUrl: payload.cvUrl || '',
    });
    return data;
  }
};
