export type NivelExperiencia = 'PRACTICANTE' | 'JUNIOR' | 'SEMI_SENIOR' | 'SENIOR' | 'EXPERTO';
export type TipoContrato = 'TIEMPO_COMPLETO' | 'MEDIO_TIEMPO' | 'POR_PROYECTO' | 'TEMPORAL' | 'PRACTICAS' | 'FREELANCE';
export type Modalidad = 'PRESENCIAL' | 'REMOTO' | 'HIBRIDO';
export type Jornada = 'DIURNA' | 'NOCTURNA' | 'MIXTA' | 'POR_TURNOS' | 'FLEXIBLE';
export type EstadoOferta = 'BORRADOR' | 'PENDIENTE_APROBACION' | 'RECHAZADA' | 'PUBLICADA' | 'PAUSADA' | 'CERRADA' | 'VENCIDA' | 'CANCELADA';

export interface RequisitoOfertaResponse {
  id: string;
  ofertaId: string;
  requisito: string;
  nivelRequerido: string;
  esObligatorio: boolean;
}

export interface OfertaResponse {
  id: string;
  empresaId: string;
  reclutadorId: string;
  titulo: string;
  descripcion: string;
  categoriaId: string;
  areaProfesional: string;
  nivelExperiencia: NivelExperiencia;
  tipoContrato: TipoContrato;
  modalidad: Modalidad;
  jornada: Jornada;
  salarioMinimo?: number;
  salarioMaximo?: number;
  moneda?: string;
  ubicacion?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  pais?: string;
  fechaPublicacion?: string;
  fechaVencimiento?: string;
  estado: EstadoOferta;
  aceptaPostulaciones: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  fechaCierre?: string;
  numeroVistas: number;
  numeroPostulaciones: number;
  requisitos: RequisitoOfertaResponse[];
}
