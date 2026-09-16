import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Trash2,
  Users,
  Briefcase,
  TrendingUp,
  Building2,
  FileBarChart,
  PlusCircle,
  X,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Tipos ─────────────────────────────────────────────────────────────────────
type ReporteEstado = 'LISTO' | 'GENERANDO' | 'ERROR' | 'PROGRAMADO';
type ReporteTipo =
  | 'USUARIOS'
  | 'POSTULACIONES'
  | 'OFERTAS'
  | 'EMPRESAS'
  | 'CONVERSION'
  | 'IA_MATCH'
  | 'ENTREVISTAS'
  | 'ACTIVIDAD';

type ReporteFormato = 'PDF' | 'CSV' | 'XLSX' | 'JSON';
type ReportePeriodo = 'DIARIO' | 'SEMANAL' | 'MENSUAL' | 'TRIMESTRAL' | 'ANUAL' | 'PERSONALIZADO';

export interface AdminReporte {
  id: string;
  tipo: ReporteTipo;
  titulo: string;
  descripcion: string;
  estado: ReporteEstado;
  formato: ReporteFormato;
  periodo: ReportePeriodo;
  fechaGeneracion: string;
  fechaDesde: string;
  fechaHasta: string;
  tamaño: string;
  registros: number;
  generadoPor: string;
  programado: boolean;
  frecuencia?: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_REPORTES: AdminReporte[] = [
  {
    id: 'r-001',
    tipo: 'POSTULACIONES',
    titulo: 'Reporte Mensual de Postulaciones — Agosto 2026',
    descripcion: 'Análisis completo del flujo de postulaciones, estados, tiempos de respuesta y tasas de conversión.',
    estado: 'LISTO',
    formato: 'PDF',
    periodo: 'MENSUAL',
    fechaGeneracion: '2026-09-01T08:00:00Z',
    fechaDesde: '2026-08-01',
    fechaHasta: '2026-08-31',
    tamaño: '2.4 MB',
    registros: 3218,
    generadoPor: 'Sistema Automático',
    programado: true,
    frecuencia: 'Mensual · Primer día del mes',
  },
  {
    id: 'r-002',
    tipo: 'USUARIOS',
    titulo: 'Reporte de Crecimiento de Usuarios — Q3 2026',
    descripcion: 'Registro de nuevos usuarios, distribución por rol, universidad de origen y actividad promedio.',
    estado: 'LISTO',
    formato: 'XLSX',
    periodo: 'TRIMESTRAL',
    fechaGeneracion: '2026-09-14T09:15:00Z',
    fechaDesde: '2026-07-01',
    fechaHasta: '2026-09-30',
    tamaño: '1.8 MB',
    registros: 541,
    generadoPor: 'Admin Plataforma ELP',
    programado: false,
  },
  {
    id: 'r-003',
    tipo: 'CONVERSION',
    titulo: 'Tasa de Conversión & Embudo de Selección — Sep 2026',
    descripcion: 'Métricas del funnel de selección: postulaciones → preseleccionados → entrevistas → contrataciones.',
    estado: 'LISTO',
    formato: 'PDF',
    periodo: 'MENSUAL',
    fechaGeneracion: '2026-09-15T06:00:00Z',
    fechaDesde: '2026-09-01',
    fechaHasta: '2026-09-15',
    tamaño: '3.1 MB',
    registros: 1024,
    generadoPor: 'Sistema Automático',
    programado: true,
    frecuencia: 'Quincenal · Días 1 y 15',
  },
  {
    id: 'r-004',
    tipo: 'IA_MATCH',
    titulo: 'Análisis de Compatibilidad IA Gemini — Semanal',
    descripcion: 'Score promedio de matching, distribución por rango, ofertas con mayor compatibilidad y candidatos top.',
    estado: 'LISTO',
    formato: 'CSV',
    periodo: 'SEMANAL',
    fechaGeneracion: '2026-09-13T06:00:00Z',
    fechaDesde: '2026-09-07',
    fechaHasta: '2026-09-13',
    tamaño: '0.9 MB',
    registros: 892,
    generadoPor: 'Motor IA Gemini',
    programado: true,
    frecuencia: 'Semanal · Lunes 06:00 AM',
  },
  {
    id: 'r-005',
    tipo: 'EMPRESAS',
    titulo: 'Directorio de Empresas Aliadas y Actividad',
    descripcion: 'Empresas registradas, estado de verificación, ofertas publicadas y estadísticas de selección.',
    estado: 'LISTO',
    formato: 'XLSX',
    periodo: 'MENSUAL',
    fechaGeneracion: '2026-09-10T14:30:00Z',
    fechaDesde: '2026-09-01',
    fechaHasta: '2026-09-10',
    tamaño: '1.2 MB',
    registros: 34,
    generadoPor: 'Admin Plataforma ELP',
    programado: false,
  },
  {
    id: 'r-006',
    tipo: 'OFERTAS',
    titulo: 'Reporte de Ofertas Laborales Activas — Sep 2026',
    descripcion: 'Ofertas publicadas por empresa, modalidad, categoría y número de postulantes por oferta.',
    estado: 'GENERANDO',
    formato: 'PDF',
    periodo: 'MENSUAL',
    fechaGeneracion: '2026-09-15T19:45:00Z',
    fechaDesde: '2026-09-01',
    fechaHasta: '2026-09-15',
    tamaño: '—',
    registros: 0,
    generadoPor: 'Admin Plataforma ELP',
    programado: false,
  },
  {
    id: 'r-007',
    tipo: 'ENTREVISTAS',
    titulo: 'Seguimiento de Entrevistas — Agosto 2026',
    descripcion: 'Entrevistas programadas, realizadas, canceladas y tasa de presentación de candidatos.',
    estado: 'LISTO',
    formato: 'PDF',
    periodo: 'MENSUAL',
    fechaGeneracion: '2026-09-02T08:00:00Z',
    fechaDesde: '2026-08-01',
    fechaHasta: '2026-08-31',
    tamaño: '1.6 MB',
    registros: 143,
    generadoPor: 'Sistema Automático',
    programado: true,
    frecuencia: 'Mensual · Primer día del mes',
  },
  {
    id: 'r-008',
    tipo: 'ACTIVIDAD',
    titulo: 'Log de Actividad y Auditoría — Diario',
    descripcion: 'Registro detallado de acciones de administradores, cambios de estado y eventos críticos del sistema.',
    estado: 'ERROR',
    formato: 'JSON',
    periodo: 'DIARIO',
    fechaGeneracion: '2026-09-15T03:00:00Z',
    fechaDesde: '2026-09-14',
    fechaHasta: '2026-09-15',
    tamaño: '—',
    registros: 0,
    generadoPor: 'Sistema Automático',
    programado: true,
    frecuencia: 'Diario · 03:00 AM',
  },
  {
    id: 'r-009',
    tipo: 'USUARIOS',
    titulo: 'Reporte Anual de Plataforma 2025',
    descripcion: 'Informe ejecutivo anual con todas las métricas, hitos y logros de la plataforma durante el año 2025.',
    estado: 'LISTO',
    formato: 'PDF',
    periodo: 'ANUAL',
    fechaGeneracion: '2026-01-02T08:00:00Z',
    fechaDesde: '2025-01-01',
    fechaHasta: '2025-12-31',
    tamaño: '8.7 MB',
    registros: 12847,
    generadoPor: 'Admin Plataforma ELP',
    programado: false,
  },
];

// Plantillas de reportes disponibles
const PLANTILLAS = [
  {
    tipo: 'POSTULACIONES' as ReporteTipo,
    titulo: 'Reporte de Postulaciones',
    desc: 'Flujo completo de candidatos, estados y conversión',
    icon: <FileText className="w-5 h-5" />,
    color: 'from-indigo-500 to-violet-600',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
  },
  {
    tipo: 'USUARIOS' as ReporteTipo,
    titulo: 'Crecimiento de Usuarios',
    desc: 'Nuevos registros, roles y actividad por período',
    icon: <Users className="w-5 h-5" />,
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    tipo: 'OFERTAS' as ReporteTipo,
    titulo: 'Gestión de Ofertas',
    desc: 'Ofertas activas, por empresa y modalidad',
    icon: <Briefcase className="w-5 h-5" />,
    color: 'from-cyan-500 to-blue-600',
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
  },
  {
    tipo: 'CONVERSION' as ReporteTipo,
    titulo: 'Embudo de Conversión',
    desc: 'Tasa de éxito del proceso de selección',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
  {
    tipo: 'IA_MATCH' as ReporteTipo,
    titulo: 'Análisis de IA Matching',
    desc: 'Scores de compatibilidad y candidatos top',
    icon: <Zap className="w-5 h-5" />,
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    text: 'text-violet-600',
  },
  {
    tipo: 'EMPRESAS' as ReporteTipo,
    titulo: 'Directorio de Empresas',
    desc: 'Alianzas activas, verificaciones y métricas',
    icon: <Building2 className="w-5 h-5" />,
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ESTADO_CFG: Record<ReporteEstado, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  LISTO:       { label: 'Listo',      icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: 'text-emerald-700', bg: 'bg-emerald-100 border border-emerald-200' },
  GENERANDO:   { label: 'Generando', icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />, color: 'text-blue-700', bg: 'bg-blue-100 border border-blue-200' },
  ERROR:       { label: 'Error',      icon: <AlertCircle className="w-3.5 h-3.5" />, color: 'text-rose-700', bg: 'bg-rose-100 border border-rose-200' },
  PROGRAMADO:  { label: 'Programado', icon: <Clock className="w-3.5 h-3.5" />, color: 'text-amber-700', bg: 'bg-amber-100 border border-amber-200' },
};

const FORMATO_CFG: Record<ReporteFormato, { color: string; bg: string }> = {
  PDF:  { color: 'text-rose-700',   bg: 'bg-rose-50 border border-rose-200' },
  CSV:  { color: 'text-emerald-700', bg: 'bg-emerald-50 border border-emerald-200' },
  XLSX: { color: 'text-green-700',  bg: 'bg-green-50 border border-green-200' },
  JSON: { color: 'text-slate-700',  bg: 'bg-slate-50 border border-slate-200' },
};

const TIPO_LABEL: Record<ReporteTipo, string> = {
  USUARIOS:      'Usuarios',
  POSTULACIONES: 'Postulaciones',
  OFERTAS:       'Ofertas',
  EMPRESAS:      'Empresas',
  CONVERSION:    'Conversión',
  IA_MATCH:      'IA Match',
  ENTREVISTAS:   'Entrevistas',
  ACTIVIDAD:     'Auditoría',
};

const PERIODO_LABEL: Record<ReportePeriodo, string> = {
  DIARIO:        'Diario',
  SEMANAL:       'Semanal',
  MENSUAL:       'Mensual',
  TRIMESTRAL:    'Trimestral',
  ANUAL:         'Anual',
  PERSONALIZADO: 'Personalizado',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });

const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Ayer';
  return `Hace ${days} días`;
};

// ─── Componente Modal Nuevo Reporte ─────────────────────────────────────────
const NuevoReporteModal: React.FC<{
  onClose: () => void;
  onCreate: (r: AdminReporte) => void;
}> = ({ onClose, onCreate }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTipo, setSelectedTipo] = useState<ReporteTipo | null>(null);
  const [form, setForm] = useState({
    formato: 'PDF' as ReporteFormato,
    periodo: 'MENSUAL' as ReportePeriodo,
    desde: '2026-09-01',
    hasta: '2026-09-15',
  });

  const handleCreate = () => {
    if (!selectedTipo) return;
    const plantilla = PLANTILLAS.find(p => p.tipo === selectedTipo)!;
    const nuevo: AdminReporte = {
      id: `r-${Date.now()}`,
      tipo: selectedTipo,
      titulo: `${plantilla.titulo} — ${PERIODO_LABEL[form.periodo]}`,
      descripcion: plantilla.desc,
      estado: 'GENERANDO',
      formato: form.formato,
      periodo: form.periodo,
      fechaGeneracion: new Date().toISOString(),
      fechaDesde: form.desde,
      fechaHasta: form.hasta,
      tamaño: '—',
      registros: 0,
      generadoPor: 'Admin Plataforma ELP',
      programado: false,
    };
    onCreate(nuevo);
    toast.success('Reporte en generación. Estará listo en breve.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Generar nuevo reporte</h3>
              <p className="text-xs text-slate-500">Paso {step} de 2 — {step === 1 ? 'Selecciona el tipo' : 'Configura los parámetros'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Paso 1: tipo */}
        {step === 1 && (
          <div className="p-6">
            <p className="text-sm font-semibold text-slate-700 mb-4">Elige el tipo de reporte que deseas generar:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PLANTILLAS.map(p => (
                <button
                  key={p.tipo}
                  onClick={() => setSelectedTipo(p.tipo)}
                  className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all ${
                    selectedTipo === p.tipo
                      ? 'border-indigo-500 bg-indigo-50/60 shadow-md shadow-indigo-100'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${p.bg} ${p.text}`}>
                    {p.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{p.titulo}</p>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{p.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Paso 2: parámetros */}
        {step === 2 && (
          <div className="p-6 grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Formato de salida</label>
              <div className="grid grid-cols-2 gap-2">
                {(['PDF', 'CSV', 'XLSX', 'JSON'] as ReporteFormato[]).map(f => {
                  const cfg = FORMATO_CFG[f];
                  return (
                    <button
                      key={f}
                      onClick={() => setForm(p => ({ ...p, formato: f }))}
                      className={`px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all ${
                        form.formato === f ? `${cfg.bg} ${cfg.color} border-current` : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Período</label>
              <select
                value={form.periodo}
                onChange={e => setForm(p => ({ ...p, periodo: e.target.value as ReportePeriodo }))}
                className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              >
                {(Object.entries(PERIODO_LABEL)).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Fecha desde</label>
              <input type="date" value={form.desde} onChange={e => setForm(p => ({ ...p, desde: e.target.value }))}
                className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Fecha hasta</label>
              <input type="date" value={form.hasta} onChange={e => setForm(p => ({ ...p, hasta: e.target.value }))}
                className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
            </div>
            <div className="col-span-2 bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-xs text-indigo-700">
              <p className="font-bold mb-0.5">Resumen del reporte a generar:</p>
              <p className="text-indigo-600">
                <span className="font-semibold">{PLANTILLAS.find(p => p.tipo === selectedTipo)?.titulo}</span>
                {' · '} Formato: <span className="font-semibold">{form.formato}</span>
                {' · '} Período: <span className="font-semibold">{PERIODO_LABEL[form.periodo]}</span>
                {' · '} Del <span className="font-semibold">{form.desde}</span> al <span className="font-semibold">{form.hasta}</span>
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => step === 1 ? onClose() : setStep(1)}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            {step === 1 ? 'Cancelar' : '← Atrás'}
          </button>
          {step === 1 ? (
            <button
              onClick={() => selectedTipo && setStep(2)}
              disabled={!selectedTipo}
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuar →
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-violet-700"
            >
              <Zap className="w-4 h-4" /> Generar reporte
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Componente: Fila de Reporte ──────────────────────────────────────────────
const ReporteRow: React.FC<{
  reporte: AdminReporte;
  onDownload: (r: AdminReporte) => void;
  onDelete: (id: string) => void;
  onRetry: (id: string) => void;
  onClick: (r: AdminReporte) => void;
  isSelected: boolean;
}> = ({ reporte, onDownload, onDelete, onRetry, onClick, isSelected }) => {
  const eCfg = ESTADO_CFG[reporte.estado];
  const fCfg = FORMATO_CFG[reporte.formato];

  return (
    <tr
      onClick={() => onClick(reporte)}
      className={`hover:bg-slate-50/70 transition-colors cursor-pointer group ${isSelected ? 'bg-indigo-50/40' : ''}`}
    >
      {/* Título */}
      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${fCfg.bg} ${fCfg.color}`}>
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">{reporte.titulo}</p>
            <p className="text-xs text-slate-400 truncate max-w-[280px] mt-0.5">{reporte.descripcion}</p>
            {reporte.programado && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded mt-1">
                🔁 {reporte.frecuencia}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Tipo */}
      <td className="px-4 py-4">
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
          {TIPO_LABEL[reporte.tipo]}
        </span>
      </td>

      {/* Período */}
      <td className="px-4 py-4">
        <p className="text-xs font-semibold text-slate-700">{PERIODO_LABEL[reporte.periodo]}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          {formatDate(reporte.fechaDesde)} – {formatDate(reporte.fechaHasta)}
        </p>
      </td>

      {/* Estado */}
      <td className="px-4 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${eCfg.bg} ${eCfg.color}`}>
          {eCfg.icon} {eCfg.label}
        </span>
      </td>

      {/* Formato */}
      <td className="px-4 py-4">
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${fCfg.bg} ${fCfg.color}`}>{reporte.formato}</span>
      </td>

      {/* Tamaño / Registros */}
      <td className="px-4 py-4">
        <p className="text-xs font-semibold text-slate-700">{reporte.tamaño}</p>
        {reporte.registros > 0 && (
          <p className="text-[10px] text-slate-400">{reporte.registros.toLocaleString()} registros</p>
        )}
      </td>

      {/* Generado */}
      <td className="px-4 py-4">
        <p className="text-xs text-slate-600">{timeAgo(reporte.fechaGeneracion)}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">{reporte.generadoPor}</p>
      </td>

      {/* Acciones */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-1">
          {reporte.estado === 'LISTO' && (
            <button
              onClick={e => { e.stopPropagation(); onDownload(reporte); }}
              title="Descargar"
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          {reporte.estado === 'ERROR' && (
            <button
              onClick={e => { e.stopPropagation(); onRetry(reporte.id); }}
              title="Reintentar"
              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={e => { e.stopPropagation(); onDelete(reporte.id); }}
            title="Eliminar"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// ─── Vista Principal ───────────────────────────────────────────────────────────
export const AdminReportesView: React.FC = () => {
  const [reportes, setReportes] = useState<AdminReporte[]>(MOCK_REPORTES);
  const [search, setSearch]     = useState('');
  const [filterTipo, setFilterTipo] = useState<'TODOS' | ReporteTipo>('TODOS');
  const [filterEstado, setFilterEstado] = useState<'TODOS' | ReporteEstado>('TODOS');
  const [filterPeriodo, setFilterPeriodo] = useState<'TODOS' | ReportePeriodo>('TODOS');
  const [selected, setSelected] = useState<AdminReporte | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'TODOS' | 'PROGRAMADOS' | 'MANUALES'>('TODOS');

  // Estadísticas
  const stats = useMemo(() => ({
    total:      reportes.length,
    listos:     reportes.filter(r => r.estado === 'LISTO').length,
    generando:  reportes.filter(r => r.estado === 'GENERANDO').length,
    error:      reportes.filter(r => r.estado === 'ERROR').length,
    programados: reportes.filter(r => r.programado).length,
    totalSize:  '21.2 MB',
  }), [reportes]);

  // Filtrado
  const filtered = useMemo(() => {
    let list = reportes;
    if (activeTab === 'PROGRAMADOS') list = list.filter(r => r.programado);
    if (activeTab === 'MANUALES')    list = list.filter(r => !r.programado);
    if (filterTipo    !== 'TODOS')   list = list.filter(r => r.tipo === filterTipo);
    if (filterEstado  !== 'TODOS')   list = list.filter(r => r.estado === filterEstado);
    if (filterPeriodo !== 'TODOS')   list = list.filter(r => r.periodo === filterPeriodo);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r => r.titulo.toLowerCase().includes(q) || r.descripcion.toLowerCase().includes(q) || TIPO_LABEL[r.tipo].toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => new Date(b.fechaGeneracion).getTime() - new Date(a.fechaGeneracion).getTime());
  }, [reportes, search, filterTipo, filterEstado, filterPeriodo, activeTab]);

  const handleDownload = (r: AdminReporte) => toast.success(`Descargando "${r.titulo}" en formato ${r.formato}...`);
  const handleDelete   = (id: string) => { setReportes(p => p.filter(r => r.id !== id)); if (selected?.id === id) setSelected(null); toast.success('Reporte eliminado'); };
  const handleRetry    = (id: string) => { setReportes(p => p.map(r => r.id === id ? { ...r, estado: 'GENERANDO' } : r)); toast.success('Reintentando generación...'); };
  const handleCreate   = (r: AdminReporte) => { setReportes(p => [r, ...p]); };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen">

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25 text-white">
            <FileBarChart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Centro de Reportes</h1>
            <p className="text-sm text-slate-500">
              Genera, programa y descarga informes detallados de la plataforma.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => toast.success('Actualizando estado de reportes...')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            Actualizar
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-md shadow-orange-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <PlusCircle className="w-4 h-4" />
            Nuevo reporte
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <FileText className="w-5 h-5" />,     label: 'Total Reportes',    val: stats.total,      accent: 'bg-slate-50 text-slate-600',   border: 'hover:border-slate-300' },
          { icon: <CheckCircle2 className="w-5 h-5" />, label: 'Listos',           val: stats.listos,     accent: 'bg-emerald-50 text-emerald-600', border: 'hover:border-emerald-200' },
          { icon: <Clock className="w-5 h-5" />,        label: 'Programados',      val: stats.programados, accent: 'bg-amber-50 text-amber-600',    border: 'hover:border-amber-200' },
          { icon: <AlertCircle className="w-5 h-5" />,  label: 'Con error',        val: stats.error,      accent: 'bg-rose-50 text-rose-600',      border: 'hover:border-rose-200' },
        ].map((item, i) => (
          <div key={i} className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3 transition-all ${item.border}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.accent}`}>
              {item.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">{item.label}</p>
              <p className="text-xl font-extrabold text-slate-900">{item.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Plantillas rápidas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Plantillas de Reportes</h2>
            <p className="text-xs text-slate-500">Genera un reporte en segundos con estas plantillas predefinidas</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PLANTILLAS.map((p, i) => (
            <button
              key={i}
              onClick={() => { setShowModal(true); }}
              className={`group flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all text-center bg-white hover:bg-slate-50/80`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${p.color} text-white shadow-sm group-hover:scale-105 transition-transform`}>
                {p.icon}
              </div>
              <span className="text-xs font-bold text-slate-700 leading-tight">{p.titulo}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs + Tabla */}
      <div className="space-y-3">
        {/* Tabs */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-2 py-2">
          <div className="flex items-center gap-1">
            {([
              { key: 'TODOS', label: 'Todos los reportes', count: stats.total },
              { key: 'PROGRAMADOS', label: 'Automáticos', count: stats.programados },
              { key: 'MANUALES', label: 'Manuales', count: stats.total - stats.programados },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-orange-50 text-orange-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === tab.key ? 'bg-orange-200/60 text-orange-800' : 'bg-slate-100 text-slate-600'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por título, tipo o descripción..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all placeholder:text-slate-400"
            />
            {search && <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>}
          </div>
          <div className="flex gap-2">
            <select value={filterTipo} onChange={e => setFilterTipo(e.target.value as typeof filterTipo)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none cursor-pointer">
              <option value="TODOS">Tipo</option>
              {(Object.entries(TIPO_LABEL)).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={filterEstado} onChange={e => setFilterEstado(e.target.value as typeof filterEstado)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none cursor-pointer">
              <option value="TODOS">Estado</option>
              <option value="LISTO">Listo</option>
              <option value="GENERANDO">Generando</option>
              <option value="ERROR">Error</option>
              <option value="PROGRAMADO">Programado</option>
            </select>
            <select value={filterPeriodo} onChange={e => setFilterPeriodo(e.target.value as typeof filterPeriodo)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none cursor-pointer">
              <option value="TODOS">Período</option>
              {(Object.entries(PERIODO_LABEL)).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Reporte</th>
                  <th className="px-4 py-4">Tipo</th>
                  <th className="px-4 py-4">Período</th>
                  <th className="px-4 py-4">Estado</th>
                  <th className="px-4 py-4">Formato</th>
                  <th className="px-4 py-4">Tamaño</th>
                  <th className="px-4 py-4">Generado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="py-16 text-center">
                    <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-600">Sin reportes</p>
                    <p className="text-xs text-slate-400 mt-1">Ajusta los filtros o genera un nuevo reporte.</p>
                  </td></tr>
                ) : (
                  filtered.map(r => (
                    <ReporteRow key={r.id} reporte={r}
                      onDownload={handleDownload} onDelete={handleDelete} onRetry={handleRetry}
                      onClick={r => setSelected(s => s?.id === r.id ? null : r)}
                      isSelected={selected?.id === r.id}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer tabla */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Mostrando <span className="font-bold text-slate-700">{filtered.length}</span> de{' '}
              <span className="font-bold text-slate-700">{reportes.length}</span> reportes ·{' '}
              Almacenamiento total: <span className="font-bold text-slate-700">{stats.totalSize}</span>
            </span>
            {stats.error > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5" /> {stats.error} reporte{stats.error > 1 ? 's' : ''} con error
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Panel de Detalle Lateral */}
      {selected && (
        <div className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-slate-200 shadow-2xl z-40 flex flex-col overflow-hidden"
          style={{ top: 0 }}>
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <h3 className="text-sm font-bold text-slate-900">Detalle del Reporte</h3>
            <button onClick={() => setSelected(null)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Estado + formato */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${ESTADO_CFG[selected.estado].bg} ${ESTADO_CFG[selected.estado].color}`}>
                {ESTADO_CFG[selected.estado].icon} {ESTADO_CFG[selected.estado].label}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${FORMATO_CFG[selected.formato].bg} ${FORMATO_CFG[selected.formato].color}`}>
                {selected.formato}
              </span>
              {selected.programado && (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                  🔁 Auto
                </span>
              )}
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 leading-snug">{selected.titulo}</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{selected.descripcion}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
              {[
                { label: 'Tipo', val: TIPO_LABEL[selected.tipo] },
                { label: 'Período', val: PERIODO_LABEL[selected.periodo] },
                { label: 'Fecha desde', val: formatDate(selected.fechaDesde) },
                { label: 'Fecha hasta', val: formatDate(selected.fechaHasta) },
                { label: 'Tamaño', val: selected.tamaño },
                { label: 'Registros', val: selected.registros > 0 ? selected.registros.toLocaleString() : '—' },
                { label: 'Generado por', val: selected.generadoPor },
                { label: 'Generado', val: timeAgo(selected.fechaGeneracion) },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">{row.label}</span>
                  <span className="font-semibold text-slate-800 text-right max-w-[140px]">{row.val}</span>
                </div>
              ))}
            </div>

            {selected.programado && selected.frecuencia && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs font-bold text-amber-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Programación automática
                </p>
                <p className="text-xs text-amber-600">{selected.frecuencia}</p>
              </div>
            )}

            {selected.estado === 'ERROR' && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
                <p className="text-xs font-bold text-rose-700 mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Error en la generación
                </p>
                <p className="text-xs text-rose-600">El proceso fue interrumpido. Intenta regenerar el reporte.</p>
              </div>
            )}
          </div>

          {/* Acciones del panel */}
          <div className="p-4 border-t border-slate-100 space-y-2">
            {selected.estado === 'LISTO' && (
              <button
                onClick={() => handleDownload(selected)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 rounded-xl shadow-md transition-all"
              >
                <Download className="w-4 h-4" /> Descargar {selected.formato}
              </button>
            )}
            {selected.estado === 'ERROR' && (
              <button
                onClick={() => { handleRetry(selected.id); setSelected(null); }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-md transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Reintentar generación
              </button>
            )}
            <button
              onClick={() => handleDelete(selected.id)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Eliminar reporte
            </button>
          </div>
        </div>
      )}

      {/* Overlay del panel lateral */}
      {selected && (
        <div className="fixed inset-0 z-30 bg-slate-900/20" onClick={() => setSelected(null)} />
      )}

      {/* Modal de nuevo reporte */}
      {showModal && (
        <NuevoReporteModal onClose={() => setShowModal(false)} onCreate={handleCreate} />
      )}
    </div>
  );
};

export default AdminReportesView;
