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

  async publishJob(id: string): Promise<OfertaResponse> {
    const { data } = await ofertasApi.patch<OfertaResponse>(`/ofertas/${id}/publicar`);
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
