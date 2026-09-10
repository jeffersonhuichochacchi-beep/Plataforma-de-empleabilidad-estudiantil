export interface PerfilResponseDTO {
  id: string;
  email: string;
  rol: 'ESTUDIANTE' | 'PROFESIONAL' | 'EMPRESA' | 'RECLUTADOR' | 'MODERADOR' | 'ADMINISTRADOR';
  nombreParaMostrar: string;
  porcentajeCompletitud: number;
  estadoPerfil: 'INCOMPLETO' | 'COMPLETO';
  motivosPendientes: string[];
  puedeAccionar: boolean;
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  fotoPerfil?: string;
  biografia?: string;
  tituloProfesional?: string;
  ubicacion?: string;
  enlacePortafolio?: string;
  cvNombre?: string;
  experiencias: ExperienciaPerfil[];
  educacion: EducacionPerfil[];
  habilidades: HabilidadPerfil[];
}

export interface ExperienciaPerfil { id: string; empresa: string; cargo: string; descripcion?: string; fechaInicio?: string; fechaFin?: string; actual?: boolean; ubicacion?: string; modalidad?: string; }
export interface EducacionPerfil { id: string; institucion: string; carrera: string; grado?: string; fechaInicio?: string; fechaFin?: string; actual?: boolean; descripcion?: string; }
export interface HabilidadPerfil { id: string; nombre: string; nivel?: string; anosExperiencia?: number; }
