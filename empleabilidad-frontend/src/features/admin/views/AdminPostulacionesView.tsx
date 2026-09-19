import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Mail,
  GraduationCap,
  Building2,
  Download,
  TrendingUp,
  AlertCircle,
  Star,
  MapPin,
  X,
  Check,
  Ban,
  MessageSquare,
  BarChart2,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminPostulacionesService } from '../services/admin-postulaciones.service';

// ─── Tipos ───────────────────────────────────────────────────────────────────
export type EstadoPostulacion =
  | 'PENDIENTE'
  | 'EN_REVISION'
  | 'PRESELECCIONADO'
  | 'ENTREVISTA_PROGRAMADA'
  | 'OFERTA_ENVIADA'
  | 'ACEPTADO'
  | 'RECHAZADO'
  | 'RETIRADO';

export interface AdminPostulacion {
  id: string;
  candidatoNombre: string;
  candidatoEmail: string;
  candidatoCarrera: string;
  candidatoUniversidad: string;
  candidatoCiclo: string;
  candidatoAvatar?: string;
  ofertaTitulo: string;
  ofertaEmpresa: string;
  ofertaModalidad: 'REMOTO' | 'PRESENCIAL' | 'HIBRIDO';
  ofertaUbicacion: string;
  estado: EstadoPostulacion;
  fechaPostulacion: string;
  fechaActualizacion: string;
  matchScore: number;
  notaInterna?: string;
  cvAdjunto: boolean;
  entrevistaFecha?: string;
}

// ─── Datos Mock ───────────────────────────────────────────────────────────────
const MOCK_POSTULACIONES: AdminPostulacion[] = [
  {
    id: 'p-001',
    candidatoNombre: 'Jefferson Huicho Chacchi',
    candidatoEmail: 'jeffersonhuichochacchi@gmail.com',
    candidatoCarrera: 'Ingeniería de Sistemas e Informática',
    candidatoUniversidad: 'UNMSM',
    candidatoCiclo: 'X Ciclo',
    ofertaTitulo: 'Desarrollador Full Stack - React & Spring Boot',
    ofertaEmpresa: 'TechNova Solutions S.A.C.',
    ofertaModalidad: 'HIBRIDO',
    ofertaUbicacion: 'Lima, Perú',
    estado: 'ENTREVISTA_PROGRAMADA',
    fechaPostulacion: '2026-09-10T09:15:00Z',
    fechaActualizacion: '2026-09-12T14:30:00Z',
    matchScore: 94,
    notaInterna: 'Candidato muy destacado, excelente perfil técnico.',
    cvAdjunto: true,
    entrevistaFecha: '2026-09-18T10:00:00Z',
  },
  {
    id: 'p-002',
    candidatoNombre: 'Leonardo Crispaitán Pérez',
    candidatoEmail: 'leocrispaitan@gmail.com',
    candidatoCarrera: 'Ingeniería de Software',
    candidatoUniversidad: 'UPC',
    candidatoCiclo: 'VIII Ciclo',
    ofertaTitulo: 'Backend Developer Junior - Java',
    ofertaEmpresa: 'Banco Financiero Central S.A.',
    ofertaModalidad: 'PRESENCIAL',
    ofertaUbicacion: 'San Isidro, Lima',
    estado: 'PRESELECCIONADO',
    fechaPostulacion: '2026-09-08T11:20:00Z',
    fechaActualizacion: '2026-09-11T09:00:00Z',
    matchScore: 87,
    cvAdjunto: true,
  },
  {
    id: 'p-003',
    candidatoNombre: 'Indira Morales Solís',
    candidatoEmail: 'indira@gmail.com',
    candidatoCarrera: 'Diseño UX/UI & Multimedia',
    candidatoUniversidad: 'PUCP',
    candidatoCiclo: 'VII Ciclo',
    ofertaTitulo: 'Diseñadora UX/UI - Producto Digital',
    ofertaEmpresa: 'TechNova Solutions S.A.C.',
    ofertaModalidad: 'REMOTO',
    ofertaUbicacion: 'Remoto - Perú',
    estado: 'EN_REVISION',
    fechaPostulacion: '2026-09-13T08:00:00Z',
    fechaActualizacion: '2026-09-13T08:00:00Z',
    matchScore: 91,
    cvAdjunto: true,
  },
  {
    id: 'p-004',
    candidatoNombre: 'Jeffer Alexander Ramos',
    candidatoEmail: 'jeffer@gmail.com',
    candidatoCarrera: 'Ciencia de Datos e IA',
    candidatoUniversidad: 'UNI',
    candidatoCiclo: 'VI Ciclo',
    ofertaTitulo: 'Data Analyst Trainee',
    ofertaEmpresa: 'Banco Financiero Central S.A.',
    ofertaModalidad: 'HIBRIDO',
    ofertaUbicacion: 'Miraflores, Lima',
    estado: 'PENDIENTE',
    fechaPostulacion: '2026-09-14T15:45:00Z',
    fechaActualizacion: '2026-09-14T15:45:00Z',
    matchScore: 72,
    cvAdjunto: false,
  },
  {
    id: 'p-005',
    candidatoNombre: 'María Fernanda Torres',
    candidatoEmail: 'mfernanda@gmail.com',
    candidatoCarrera: 'Ingeniería de Sistemas',
    candidatoUniversidad: 'USIL',
    candidatoCiclo: 'IX Ciclo',
    ofertaTitulo: 'Desarrollador Full Stack - React & Spring Boot',
    ofertaEmpresa: 'TechNova Solutions S.A.C.',
    ofertaModalidad: 'HIBRIDO',
    ofertaUbicacion: 'Lima, Perú',
    estado: 'RECHAZADO',
    fechaPostulacion: '2026-09-05T10:00:00Z',
    fechaActualizacion: '2026-09-09T16:20:00Z',
    matchScore: 58,
    notaInterna: 'Perfil no alineado al nivel técnico requerido.',
    cvAdjunto: true,
  },
  {
    id: 'p-006',
    candidatoNombre: 'Carlos Alberto Valdivia',
    candidatoEmail: 'carlos.valdivia@correo.com',
    candidatoCarrera: 'Ingeniería Industrial',
    candidatoUniversidad: 'UNMSM',
    candidatoCiclo: 'IX Ciclo',
    ofertaTitulo: 'Analista de Operaciones & Procesos',
    ofertaEmpresa: 'Talent Acquisition Group',
    ofertaModalidad: 'PRESENCIAL',
    ofertaUbicacion: 'Surco, Lima',
    estado: 'ACEPTADO',
    fechaPostulacion: '2026-08-28T09:00:00Z',
    fechaActualizacion: '2026-09-07T11:00:00Z',
    matchScore: 89,
    notaInterna: 'Proceso completado. Candidato aceptó la oferta.',
    cvAdjunto: true,
    entrevistaFecha: '2026-09-03T09:00:00Z',
  },
  {
    id: 'p-007',
    candidatoNombre: 'Alejandra Quispe Mamani',
    candidatoEmail: 'alejandra.quispe@unsa.pe',
    candidatoCarrera: 'Ingeniería de Telecomunicaciones',
    candidatoUniversidad: 'UNSA',
    candidatoCiclo: 'VII Ciclo',
    ofertaTitulo: 'Ingeniero de Redes & Infraestructura',
    ofertaEmpresa: 'TechNova Solutions S.A.C.',
    ofertaModalidad: 'PRESENCIAL',
    ofertaUbicacion: 'Arequipa, Perú',
    estado: 'OFERTA_ENVIADA',
    fechaPostulacion: '2026-09-01T14:00:00Z',
    fechaActualizacion: '2026-09-14T10:00:00Z',
    matchScore: 85,
    cvAdjunto: true,
    entrevistaFecha: '2026-09-10T15:00:00Z',
  },
  {
    id: 'p-008',
    candidatoNombre: 'Bruno Sebastián Huanca',
    candidatoEmail: 'bhuanca@gmail.com',
    candidatoCarrera: 'Ingeniería de Software',
    candidatoUniversidad: 'UNSA',
    candidatoCiclo: 'VIII Ciclo',
    ofertaTitulo: 'Backend Developer Junior - Java',
    ofertaEmpresa: 'Banco Financiero Central S.A.',
    ofertaModalidad: 'PRESENCIAL',
    ofertaUbicacion: 'San Isidro, Lima',
    estado: 'RETIRADO',
    fechaPostulacion: '2026-09-06T11:00:00Z',
    fechaActualizacion: '2026-09-08T09:15:00Z',
    matchScore: 78,
    cvAdjunto: true,
  },
  {
    id: 'p-009',
    candidatoNombre: 'Pamela Lucía Condori',
    candidatoEmail: 'pamela.condori@utp.edu.pe',
    candidatoCarrera: 'Ingeniería de Sistemas',
    candidatoUniversidad: 'UTP',
    candidatoCiclo: 'X Ciclo',
    ofertaTitulo: 'Analista QA & Testing',
    ofertaEmpresa: 'TechNova Solutions S.A.C.',
    ofertaModalidad: 'REMOTO',
    ofertaUbicacion: 'Remoto - Perú',
    estado: 'EN_REVISION',
    fechaPostulacion: '2026-09-12T16:00:00Z',
    fechaActualizacion: '2026-09-13T08:30:00Z',
    matchScore: 83,
    cvAdjunto: true,
  },
  {
    id: 'p-010',
    candidatoNombre: 'Rodrigo Espinoza Delgado',
    candidatoEmail: 'rodriespinoza@correo.com',
    candidatoCarrera: 'Ciencias de la Computación',
    candidatoUniversidad: 'PUCP',
    candidatoCiclo: 'IX Ciclo',
    ofertaTitulo: 'Desarrollador Full Stack - React & Spring Boot',
    ofertaEmpresa: 'TechNova Solutions S.A.C.',
    ofertaModalidad: 'HIBRIDO',
    ofertaUbicacion: 'Lima, Perú',
    estado: 'PRESELECCIONADO',
    fechaPostulacion: '2026-09-09T09:30:00Z',
    fechaActualizacion: '2026-09-11T15:00:00Z',
    matchScore: 92,
    cvAdjunto: true,
    notaInterna: 'Perfil senior. Evaluación técnica pendiente.',
  },
];
void MOCK_POSTULACIONES;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ESTADO_CONFIG: Record<EstadoPostulacion, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  PENDIENTE:              { label: 'Pendiente',           color: 'text-slate-600',    bg: 'bg-slate-100',    icon: <Clock className="w-3 h-3" /> },
  EN_REVISION:            { label: 'En Revisión',         color: 'text-amber-700',    bg: 'bg-amber-100',    icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  PRESELECCIONADO:        { label: 'Preseleccionado',     color: 'text-blue-700',     bg: 'bg-blue-100',     icon: <Star className="w-3 h-3" /> },
  ENTREVISTA_PROGRAMADA:  { label: 'Entrevista',          color: 'text-violet-700',   bg: 'bg-violet-100',   icon: <Calendar className="w-3 h-3" /> },
  OFERTA_ENVIADA:         { label: 'Oferta Enviada',      color: 'text-indigo-700',   bg: 'bg-indigo-100',   icon: <MessageSquare className="w-3 h-3" /> },
  ACEPTADO:               { label: 'Aceptado',            color: 'text-emerald-700',  bg: 'bg-emerald-100',  icon: <CheckCircle2 className="w-3 h-3" /> },
  RECHAZADO:              { label: 'Rechazado',           color: 'text-rose-700',     bg: 'bg-rose-100',     icon: <XCircle className="w-3 h-3" /> },
  RETIRADO:               { label: 'Retirado',            color: 'text-orange-700',   bg: 'bg-orange-100',   icon: <Ban className="w-3 h-3" /> },
};

const MODALIDAD_CONFIG: Record<string, { label: string; color: string }> = {
  REMOTO:     { label: 'Remoto',     color: 'text-blue-600 bg-blue-50 border-blue-200' },
  HIBRIDO:    { label: 'Híbrido',    color: 'text-violet-600 bg-violet-50 border-violet-200' },
  PRESENCIAL: { label: 'Presencial', color: 'text-slate-600 bg-slate-50 border-slate-200' },
};

const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getMatchColor = (score: number) => {
  if (score >= 90) return { bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' };
  if (score >= 75) return { bar: 'bg-blue-500',    text: 'text-blue-700',    bg: 'bg-blue-50' };
  if (score >= 60) return { bar: 'bg-amber-500',   text: 'text-amber-700',   bg: 'bg-amber-50' };
  return                  { bar: 'bg-rose-500',    text: 'text-rose-700',    bg: 'bg-rose-50' };
};

// ─── Componente EstadoBadge ────────────────────────────────────────────────────
const EstadoBadge: React.FC<{ estado: EstadoPostulacion }> = ({ estado }) => {
  const cfg = ESTADO_CONFIG[estado];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
};

// ─── Modal de Detalle ─────────────────────────────────────────────────────────
const PostulacionDetailModal: React.FC<{
  postulacion: AdminPostulacion;
  onClose: () => void;
  onUpdateEstado: (id: string, estado: EstadoPostulacion) => void;
}> = ({ postulacion, onClose, onUpdateEstado }) => {
  const matchColors = getMatchColor(postulacion.matchScore);
  const modalidadCfg = MODALIDAD_CONFIG[postulacion.ofertaModalidad];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {getInitials(postulacion.candidatoNombre)}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{postulacion.candidatoNombre}</h2>
              <p className="text-xs text-slate-500">{postulacion.candidatoEmail}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Match Score */}
          <div className={`rounded-xl p-4 ${matchColors.bg} flex items-center justify-between`}>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">AI Match Score</p>
              <div className="flex items-center gap-2">
                <span className={`text-3xl font-extrabold ${matchColors.text}`}>{postulacion.matchScore}%</span>
                <span className={`text-sm font-medium ${matchColors.text}`}>de compatibilidad</span>
              </div>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke={postulacion.matchScore >= 90 ? '#10b981' : postulacion.matchScore >= 75 ? '#3b82f6' : postulacion.matchScore >= 60 ? '#f59e0b' : '#f43f5e'}
                  strokeWidth="3"
                  strokeDasharray={`${postulacion.matchScore} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${matchColors.text}`}>
                {postulacion.matchScore}%
              </span>
            </div>
          </div>

          {/* Candidato Info */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Datos del Candidato</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Carrera</p>
                  <p className="font-semibold text-slate-800">{postulacion.candidatoCarrera}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Universidad</p>
                  <p className="font-semibold text-slate-800">{postulacion.candidatoUniversidad}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Correo</p>
                  <p className="font-semibold text-slate-800 break-all">{postulacion.candidatoEmail}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Star className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Ciclo</p>
                  <p className="font-semibold text-slate-800">{postulacion.candidatoCiclo}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${postulacion.cvAdjunto ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {postulacion.cvAdjunto ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                {postulacion.cvAdjunto ? 'CV Adjunto disponible' : 'Sin CV adjunto'}
              </span>
            </div>
          </div>

          {/* Oferta Info */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Oferta Aplicada</h3>
            <div className="space-y-2 text-sm">
              <p className="font-bold text-slate-900 text-base">{postulacion.ofertaTitulo}</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-slate-500 text-xs">
                  <Building2 className="w-3.5 h-3.5" /> {postulacion.ofertaEmpresa}
                </span>
                <span className="flex items-center gap-1 text-slate-500 text-xs">
                  <MapPin className="w-3.5 h-3.5" /> {postulacion.ofertaUbicacion}
                </span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${modalidadCfg.color}`}>
                  {modalidadCfg.label}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Línea de Tiempo</h3>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Postulación:</span>
              <span className="font-semibold text-slate-800">{formatDate(postulacion.fechaPostulacion)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Última actualización:</span>
              <span className="font-semibold text-slate-800">{formatDate(postulacion.fechaActualizacion)}</span>
            </div>
            {postulacion.entrevistaFecha && (
              <div className="flex items-center gap-2 text-xs text-violet-700">
                <Calendar className="w-3.5 h-3.5 text-violet-500" />
                <span>Entrevista programada:</span>
                <span className="font-semibold">{formatDate(postulacion.entrevistaFecha)}</span>
              </div>
            )}
          </div>

          {/* Nota Interna */}
          {postulacion.notaInterna && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Nota Interna del Reclutador
              </h3>
              <p className="text-sm text-amber-800 leading-relaxed">{postulacion.notaInterna}</p>
            </div>
          )}

          {/* Estado Actual + Cambio */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Estado Actual</h3>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <EstadoBadge estado={postulacion.estado} />
            </div>
            <div className="flex flex-wrap gap-2">
              {(['EN_REVISION', 'PRESELECCIONADO', 'ENTREVISTA_PROGRAMADA', 'ACEPTADO', 'RECHAZADO'] as EstadoPostulacion[]).map(e => (
                <button
                  key={e}
                  onClick={() => { onUpdateEstado(postulacion.id, e); onClose(); }}
                  disabled={postulacion.estado === e}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                    postulacion.estado === e
                      ? 'bg-slate-100 text-slate-400 border-slate-200'
                      : `${ESTADO_CONFIG[e].bg} ${ESTADO_CONFIG[e].color} border-current hover:opacity-80`
                  }`}
                >
                  {ESTADO_CONFIG[e].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Vista Principal ───────────────────────────────────────────────────────────
export const AdminPostulacionesView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [postulaciones, setPostulaciones] = useState<AdminPostulacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState<'TODOS' | EstadoPostulacion>('TODOS');
  const [selectedModalidad, setSelectedModalidad] = useState<'TODOS' | 'REMOTO' | 'HIBRIDO' | 'PRESENCIAL'>('TODOS');
  const [sortBy, setSortBy] = useState<'recientes' | 'match' | 'nombre'>('recientes');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [detailItem, setDetailItem] = useState<AdminPostulacion | null>(null);

  // Tab activo según ruta
  const activeTab = useMemo(() => {
    const path = location.pathname;
    if (path.includes('/estados')) return 'ESTADOS';
    if (path.includes('/entrevistas')) return 'ENTREVISTAS';
    return 'LISTADO';
  }, [location.pathname]);

  const handleTabChange = (tab: 'LISTADO' | 'ESTADOS' | 'ENTREVISTAS') => {
    switch (tab) {
      case 'ESTADOS':     navigate('/admin/postulaciones/estados'); break;
      case 'ENTREVISTAS': navigate('/admin/postulaciones/entrevistas'); break;
      default:            navigate('/admin/postulaciones/listado'); break;
    }
  };

  // Estadísticas
  const stats = useMemo(() => ({
    total:            postulaciones.length,
    pendientes:       postulaciones.filter(p => p.estado === 'PENDIENTE').length,
    enRevision:       postulaciones.filter(p => p.estado === 'EN_REVISION').length,
    // Una entrevista puede permanecer registrada aunque la postulación cambie
    // después a ACEPTADO u otro estado. La fecha es la fuente real del dato.
    entrevistas:      postulaciones.filter(p => Boolean(p.entrevistaFecha)).length,
    aceptados:        postulaciones.filter(p => p.estado === 'ACEPTADO').length,
    rechazados:       postulaciones.filter(p => p.estado === 'RECHAZADO').length,
    preseleccionados: postulaciones.filter(p => p.estado === 'PRESELECCIONADO').length,
    ofertasEnviadas:  postulaciones.filter(p => p.estado === 'OFERTA_ENVIADA').length,
    avgMatch:         postulaciones.length ? Math.round(postulaciones.reduce((acc, p) => acc + p.matchScore, 0) / postulaciones.length) : 0,
  }), [postulaciones]);

  // Filtrado
  const filtered = useMemo(() => {
    return postulaciones
      .filter(p => {
        if (activeTab === 'ENTREVISTAS') return Boolean(p.entrevistaFecha);
        if (selectedEstado !== 'TODOS' && p.estado !== selectedEstado) return false;
        if (selectedModalidad !== 'TODOS' && p.ofertaModalidad !== selectedModalidad) return false;
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          return (
            p.candidatoNombre.toLowerCase().includes(q) ||
            p.candidatoEmail.toLowerCase().includes(q) ||
            p.ofertaTitulo.toLowerCase().includes(q) ||
            p.ofertaEmpresa.toLowerCase().includes(q) ||
            p.candidatoCarrera.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'match') return b.matchScore - a.matchScore;
        if (sortBy === 'nombre') return a.candidatoNombre.localeCompare(b.candidatoNombre);
        return new Date(b.fechaPostulacion).getTime() - new Date(a.fechaPostulacion).getTime();
      });
  }, [postulaciones, activeTab, selectedEstado, selectedModalidad, searchTerm, sortBy]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedEstado, selectedModalidad, activeTab]);

  useEffect(() => {
    let mounted = true;
    const load = async (showSpinner = true) => {
      if (showSpinner) setLoading(true);
      try {
        const response = await adminPostulacionesService.listar();
        if (mounted) setPostulaciones(response.content);
      } catch {
        if (mounted && showSpinner) toast.error('No se pudieron cargar las postulaciones');
      } finally {
        if (mounted && showSpinner) setLoading(false);
      }
    };
    void load();
    // Actualiza la bandeja sin recargar la página cuando llega una postulación nueva.
    const interval = window.setInterval(() => void load(false), 15000);
    return () => { mounted = false; window.clearInterval(interval); };
  }, []);

  const handleUpdateEstado = async (id: string, estado: EstadoPostulacion) => {
    const apiEstado: Record<EstadoPostulacion, string> = { PENDIENTE: 'ENVIADA', EN_REVISION: 'EN_REVISION', PRESELECCIONADO: 'PRESELECCIONADA', ENTREVISTA_PROGRAMADA: 'ENTREVISTA', OFERTA_ENVIADA: 'EVALUACION', ACEPTADO: 'SELECCIONADA', RECHAZADO: 'RECHAZADA', RETIRADO: 'RETIRADA' };
    try { await adminPostulacionesService.cambiarEstado(id, apiEstado[estado]); } catch { toast.error('No se pudo actualizar el estado'); return; }
    setPostulaciones(prev => prev.map(p => p.id === id ? { ...p, estado, fechaActualizacion: new Date().toISOString() } : p));
    toast.success(`Estado actualizado a "${ESTADO_CONFIG[estado].label}"`);
  };

  // ─── RENDER: Vista ESTADOS ─────────────────────────────────────────────────
  const renderEstadosView = () => {
    const estadoKeys: EstadoPostulacion[] = ['PENDIENTE', 'EN_REVISION', 'PRESELECCIONADO', 'ENTREVISTA_PROGRAMADA', 'OFERTA_ENVIADA', 'ACEPTADO', 'RECHAZADO', 'RETIRADO'];
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {estadoKeys.map(estado => {
            const count = postulaciones.filter(p => p.estado === estado).length;
            const cfg = ESTADO_CONFIG[estado];
            const pct = Math.round((count / postulaciones.length) * 100) || 0;
            return (
              <div key={estado} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                    {cfg.icon} {cfg.label}
                  </span>
                  <span className="text-2xl font-extrabold text-slate-900">{count}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${cfg.bg.replace('-100', '-400')}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1.5">{pct}% del total</p>
              </div>
            );
          })}
        </div>

        {/* Funnel Visual */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-indigo-500" />
            Embudo de Selección
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Total Postulaciones',         val: stats.total,                             color: 'bg-slate-500' },
              { label: 'Pendientes + En Revisión',    val: stats.pendientes + stats.enRevision,     color: 'bg-amber-500' },
              { label: 'Preseleccionados',            val: stats.preseleccionados,                  color: 'bg-blue-500' },
              { label: 'Con Entrevista',              val: stats.entrevistas,                       color: 'bg-violet-500' },
              { label: 'Ofertas Enviadas',            val: stats.ofertasEnviadas,                   color: 'bg-indigo-500' },
              { label: 'Aceptados',                   val: stats.aceptados,                         color: 'bg-emerald-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-48 shrink-0">{item.label}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-3">
                  <div
                    className={`${item.color} h-3 rounded-full transition-all duration-700`}
                    style={{ width: `${stats.total ? (item.val / stats.total) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-800 w-8 text-right">{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ─── RENDER: Vista ENTREVISTAS ─────────────────────────────────────────────
  const renderEntrevistasView = () => {
    const entrevistas = postulaciones.filter(p => p.entrevistaFecha);
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Entrevistas Programadas</h3>
              <p className="text-xs text-slate-500">{entrevistas.length} entrevistas activas en el pipeline</p>
            </div>
            <span className="px-3 py-1 bg-violet-50 text-violet-700 text-xs font-bold rounded-lg border border-violet-200">
              {entrevistas.length} Programadas
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {entrevistas.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No hay entrevistas programadas</p>
              </div>
            ) : (
              entrevistas.map(p => {
                const matchColors = getMatchColor(p.matchScore);
                return (
                  <div key={p.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
                        {getInitials(p.candidatoNombre)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-sm group-hover:text-violet-700 transition-colors">{p.candidatoNombre}</p>
                        <p className="text-xs text-slate-500 truncate">{p.ofertaTitulo}</p>
                        <p className="text-xs text-slate-400">{p.ofertaEmpresa}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-xs font-semibold text-violet-700">{p.entrevistaFecha ? formatDate(p.entrevistaFecha) : '—'}</p>
                        <p className="text-[11px] text-slate-400">Entrevista</p>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${matchColors.bg} ${matchColors.text}`}>
                        <Star className="w-3 h-3" /> {p.matchScore}%
                      </div>
                      <EstadoBadge estado={p.estado} />
                      <button
                        onClick={() => setDetailItem(p)}
                        className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  // ─── RENDER PRINCIPAL ──────────────────────────────────────────────────────
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen">

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 text-white">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Gestión de Postulantes
            </h1>
            <p className="text-sm text-slate-500">
              Supervisa y gestiona todas las postulaciones de la plataforma en tiempo real.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => toast.success('Exportando reporte CSV de postulaciones...')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Exportar
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Postulaciones</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs font-medium">
            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-bold">+24%</span>
            <span className="text-slate-500">vs. mes anterior</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pendientes de Revisión</p>
              <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{stats.pendientes + stats.enRevision}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            <span className="bg-amber-100/70 text-amber-800 px-1.5 py-0.5 rounded font-semibold">Prioridad</span>{' '}
            Requieren acción inmediata
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-violet-300 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Con Entrevista</p>
              <h3 className="text-2xl font-extrabold text-violet-700 mt-1">{stats.entrevistas}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
            <span className="font-semibold text-violet-700">{stats.ofertasEnviadas}</span>&nbsp;ofertas enviadas
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Match Promedio</p>
              <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">{stats.avgMatch}%</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-emerald-700">{stats.aceptados}</span> candidatos aceptados
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 bg-white px-2 rounded-2xl shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto py-2">
          {([
            { key: 'LISTADO',     label: 'Todas las Postulaciones', icon: <FileText className="w-4 h-4" />, count: stats.total },
            { key: 'ESTADOS',     label: 'Análisis por Estado',     icon: <BarChart2 className="w-4 h-4" />, count: null },
            { key: 'ENTREVISTAS', label: 'Entrevistas',             icon: <Calendar className="w-4 h-4" />, count: stats.entrevistas },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key as 'LISTADO' | 'ESTADOS' | 'ENTREVISTAS')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === tab.key ? 'bg-indigo-200/60 text-indigo-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido por Tab */}
      {activeTab === 'ESTADOS'     && renderEstadosView()}
      {activeTab === 'ENTREVISTAS' && renderEntrevistasView()}

      {activeTab === 'LISTADO' && (
        <div className="space-y-4">
          {/* Barra de Filtros */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar candidato, oferta, empresa..."
                className="w-full pl-9 pr-9 py-2.5 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="flex items-center gap-1 bg-slate-50/80 px-2.5 py-1.5 rounded-xl border border-slate-200">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedEstado}
                  onChange={e => setSelectedEstado(e.target.value as 'TODOS' | EstadoPostulacion)}
                  className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="TODOS">Todos los estados</option>
                  {(Object.keys(ESTADO_CONFIG) as EstadoPostulacion[]).map(e => (
                    <option key={e} value={e}>{ESTADO_CONFIG[e].label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 bg-slate-50/80 px-2.5 py-1.5 rounded-xl border border-slate-200">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedModalidad}
                  onChange={e => setSelectedModalidad(e.target.value as typeof selectedModalidad)}
                  className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="TODOS">Todas las modalidades</option>
                  <option value="REMOTO">Remoto</option>
                  <option value="HIBRIDO">Híbrido</option>
                  <option value="PRESENCIAL">Presencial</option>
                </select>
              </div>

              <div className="flex items-center gap-1 bg-slate-50/80 px-2.5 py-1.5 rounded-xl border border-slate-200">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="recientes">Más recientes</option>
                  <option value="match">Mayor match IA</option>
                  <option value="nombre">Nombre (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Candidato</th>
                    <th className="px-4 py-4">Oferta Aplicada</th>
                    <th className="px-4 py-4">Modalidad</th>
                    <th className="px-4 py-4">Match IA</th>
                    <th className="px-4 py-4">Estado</th>
                    <th className="px-4 py-4">Fecha</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={7} className="py-12 text-center text-sm text-slate-500"><Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-indigo-500" />Cargando postulaciones reales...</td></tr>
                  ) : paginated.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <div className="max-w-xs mx-auto">
                          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-slate-700">Sin resultados</p>
                          <p className="text-xs text-slate-400 mt-1">Prueba con otros filtros de búsqueda.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginated.map(p => {
                      const matchColors = getMatchColor(p.matchScore);
                      const modalidadCfg = MODALIDAD_CONFIG[p.ofertaModalidad];
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition-colors group">
                          {/* Candidato */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                                {getInitials(p.candidatoNombre)}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{p.candidatoNombre}</p>
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                  <GraduationCap className="w-3 h-3" />
                                  {p.candidatoCarrera} · {p.candidatoUniversidad}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Oferta */}
                          <td className="px-4 py-4">
                            <p className="font-semibold text-slate-800 text-xs leading-tight max-w-[200px]">{p.ofertaTitulo}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3" /> {p.ofertaEmpresa}
                            </p>
                          </td>

                          {/* Modalidad */}
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${modalidadCfg.color}`}>
                              <MapPin className="w-3 h-3" />
                              {modalidadCfg.label}
                            </span>
                          </td>

                          {/* Match */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-100 rounded-full h-1.5">
                                <div
                                  className={`${matchColors.bar} h-1.5 rounded-full`}
                                  style={{ width: `${p.matchScore}%` }}
                                />
                              </div>
                              <span className={`text-xs font-bold ${matchColors.text}`}>{p.matchScore}%</span>
                            </div>
                          </td>

                          {/* Estado */}
                          <td className="px-4 py-4">
                            <EstadoBadge estado={p.estado} />
                          </td>

                          {/* Fecha */}
                          <td className="px-4 py-4">
                            <p className="text-xs text-slate-600 font-medium">{formatDate(p.fechaPostulacion)}</p>
                            {p.entrevistaFecha && (
                              <p className="text-[11px] text-violet-600 flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3" /> {formatDate(p.entrevistaFecha)}
                              </p>
                            )}
                          </td>

                          {/* Acciones */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setDetailItem(p)}
                                title="Ver detalle"
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUpdateEstado(p.id, 'ACEPTADO')}
                                title="Marcar Aceptado"
                                disabled={p.estado === 'ACEPTADO'}
                                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUpdateEstado(p.id, 'RECHAZADO')}
                                title="Marcar Rechazado"
                                disabled={p.estado === 'RECHAZADO'}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Mostrando <span className="font-bold text-slate-700">{paginated.length}</span> de{' '}
                <span className="font-bold text-slate-700">{filtered.length}</span> postulaciones
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                        currentPage === page
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalle */}
      {detailItem && (
        <PostulacionDetailModal
          postulacion={detailItem}
          onClose={() => setDetailItem(null)}
          onUpdateEstado={handleUpdateEstado}
        />
      )}
    </div>
  );
};

export default AdminPostulacionesView;
