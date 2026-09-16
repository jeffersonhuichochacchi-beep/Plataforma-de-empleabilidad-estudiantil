import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Loader2,
  MapPin,
  Search,
  XCircle,
  AlertCircle,
  ChevronLeft,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { jobService } from '../services/job.service';
import type { EstadoPostulacion, PostulacionResponse } from '../types/job.types';

// ── Mapeo de estados del backend al UI ────────────────────────────────────────
const ESTADO_LABEL: Record<EstadoPostulacion, string> = {
  ENVIADA:            'Enviada',
  RECIBIDA:           'Recibida',
  EN_REVISION:        'En revisión',
  PRESELECCIONADA:    'Preseleccionada',
  ENTREVISTA:         'Entrevista',
  EVALUACION:         'Evaluación',
  SELECCIONADA:       'Seleccionada',
  RECHAZADA:          'No seleccionado',
  RETIRADA:           'Retirada',
  CANCELADA:          'Cancelada',
  CERRADA:            'Cerrada',
};

const ESTADO_STYLE: Record<EstadoPostulacion, string> = {
  ENVIADA:         'bg-blue-50 text-blue-700 border-blue-200',
  RECIBIDA:        'bg-sky-50 text-sky-700 border-sky-200',
  EN_REVISION:     'bg-amber-50 text-amber-700 border-amber-200',
  PRESELECCIONADA: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  ENTREVISTA:      'bg-violet-50 text-violet-700 border-violet-200',
  EVALUACION:      'bg-purple-50 text-purple-700 border-purple-200',
  SELECCIONADA:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  RECHAZADA:       'bg-slate-100 text-slate-600 border-slate-200',
  RETIRADA:        'bg-slate-100 text-slate-500 border-slate-200',
  CANCELADA:       'bg-red-50 text-red-600 border-red-200',
  CERRADA:         'bg-slate-100 text-slate-500 border-slate-200',
};

const ESTADO_ICON: Record<EstadoPostulacion, typeof Clock3> = {
  ENVIADA:         FileText,
  RECIBIDA:        CheckCircle2,
  EN_REVISION:     Clock3,
  PRESELECCIONADA: CheckCircle2,
  ENTREVISTA:      CalendarDays,
  EVALUACION:      CalendarDays,
  SELECCIONADA:    CheckCircle2,
  RECHAZADA:       XCircle,
  RETIRADA:        XCircle,
  CANCELADA:       XCircle,
  CERRADA:         XCircle,
};

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
  'bg-fuchsia-100 text-fuchsia-700',
];

const getAvatarColor = (str: string) =>
  AVATAR_COLORS[Math.abs(str.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % AVATAR_COLORS.length];

const getInitials = (title: string) =>
  title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'NA';

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// ── Filtros visibles en la barra ──────────────────────────────────────────────
const FILTER_OPTIONS: Array<{ label: string; value: EstadoPostulacion | 'TODAS' }> = [
  { label: 'Todas', value: 'TODAS' },
  { label: 'En revisión', value: 'EN_REVISION' },
  { label: 'Entrevista', value: 'ENTREVISTA' },
  { label: 'Seleccionada', value: 'SELECCIONADA' },
  { label: 'No seleccionado', value: 'RECHAZADA' },
  { label: 'Retirada', value: 'RETIRADA' },
];

const PAGE_SIZE = 10;

// ── Componente principal ──────────────────────────────────────────────────────
export const CandidateApplicationsView = () => {
  const [applications, setApplications] = useState<PostulacionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<EstadoPostulacion | 'TODAS'>('TODAS');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [withdrawing, setWithdrawing] = useState<string | null>(null);
  const [detailApp, setDetailApp] = useState<PostulacionResponse | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = { page, size: PAGE_SIZE };
      if (activeFilter !== 'TODAS') params.estado = activeFilter;
      const res = await jobService.getMyApplications(params);
      setApplications(res.content ?? []);
      setTotalPages(res.totalPages ?? 0);
      setTotalElements(res.totalElements ?? 0);
    } catch {
      setError('No se pudieron cargar tus postulaciones. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [page, activeFilter]);

  useEffect(() => { void load(); }, [load]);

  // Búsqueda local (sobre los resultados ya cargados)
  const filtered = useMemo(() =>
    applications.filter((a) =>
      `${a.ofertaTitulo ?? ''} ${a.candidatoNombre ?? ''}`.toLowerCase().includes(search.toLowerCase())
    ),
    [applications, search]
  );

  // Contadores locales (calculados desde la página actual)
  const counts = useMemo(() => ({
    total: totalElements,
    revision: applications.filter((a) => a.estado === 'EN_REVISION').length,
    entrevista: applications.filter((a) => a.estado === 'ENTREVISTA').length,
    seleccionada: applications.filter((a) => a.estado === 'SELECCIONADA').length,
  }), [applications, totalElements]);

  const handleWithdraw = async (uuid: string) => {
    if (!window.confirm('¿Seguro que deseas retirar esta postulación?')) return;
    setWithdrawing(uuid);
    try {
      await jobService.withdrawApplication(uuid);
      toast.success('Postulación retirada correctamente.');
      void load();
    } catch {
      toast.error('No se pudo retirar la postulación.');
    } finally {
      setWithdrawing(null);
    }
  };

  const handleFilterChange = (f: EstadoPostulacion | 'TODAS') => {
    setActiveFilter(f);
    setPage(0);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-sm font-semibold text-blue-600">Mi actividad</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mis postulaciones</h1>
          <p className="mt-2 text-slate-500">Haz seguimiento a las oportunidades que te interesan.</p>
        </div>
        <a
          href="/candidato/buscar"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Search className="h-4 w-4" /> Buscar empleos
        </a>
      </div>

      {/* Contadores */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total enviadas',  value: counts.total,       icon: FileText,    tone: 'text-blue-600 bg-blue-50' },
          { label: 'En revisión',     value: counts.revision,    icon: Clock3,      tone: 'text-amber-600 bg-amber-50' },
          { label: 'Entrevistas',     value: counts.entrevista,  icon: CalendarDays, tone: 'text-indigo-600 bg-indigo-50' },
          { label: 'Seleccionadas',   value: counts.seleccionada, icon: CheckCircle2, tone: 'text-emerald-600 bg-emerald-50' },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{loading ? '—' : value}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Seguimiento de procesos</h2>
              <p className="mt-1 text-sm text-slate-500">Revisa el estado de cada oportunidad laboral.</p>
            </div>
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar postulación..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {FILTER_OPTIONS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleFilterChange(value)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                  activeFilter === value ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-20 text-slate-500">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Cargando postulaciones...</span>
            </div>
          ) : error ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <AlertCircle className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="font-bold text-slate-800">Ocurrió un error</h3>
              <p className="mt-1 text-sm text-slate-500">{error}</p>
              <button
                onClick={() => void load()}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Reintentar
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <FileText className="h-7 w-7 text-slate-400" />
              </div>
              <h3 className="font-bold text-slate-800">No encontramos postulaciones</h3>
              <p className="mt-1 text-sm text-slate-500">
                {activeFilter !== 'TODAS'
                  ? 'Prueba con otro filtro o término de búsqueda.'
                  : 'Aún no has postulado a ninguna oferta. ¡Empieza a buscar!'}
              </p>
              {activeFilter !== 'TODAS' && (
                <button
                  onClick={() => handleFilterChange('TODAS')}
                  className="mt-4 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Ver todas
                </button>
              )}
            </div>
          ) : (
            filtered.map((app) => (
              <ApplicationCard
                key={app.uuid}
                app={app}
                withdrawing={withdrawing === app.uuid}
                onWithdraw={handleWithdraw}
                onDetail={() => setDetailApp(app)}
              />
            ))
          )}
        </div>

        {/* Paginación */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
            <p className="text-xs text-slate-500">
              Página {page + 1} de {totalPages} · {totalElements} postulaciones
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Anterior
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                Siguiente <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Consejo */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
        <div className="rounded-xl bg-white p-2 text-blue-600 shadow-sm">
          <BriefcaseBusiness className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-blue-950">Consejo para destacar</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Mantén actualizado tu perfil y agrega un currículum para aumentar tus posibilidades de ser contactado.
          </p>
        </div>
      </div>

      {/* Modal detalle */}
      {detailApp && (
        <DetailModal app={detailApp} onClose={() => setDetailApp(null)} />
      )}
    </div>
  );
};

// ── Tarjeta de postulación ────────────────────────────────────────────────────
const ApplicationCard = ({
  app,
  withdrawing,
  onWithdraw,
  onDetail,
}: {
  app: PostulacionResponse;
  withdrawing: boolean;
  onWithdraw: (uuid: string) => void;
  onDetail: () => void;
}) => {
  const StatusIcon = ESTADO_ICON[app.estado] ?? Clock3;
  const title = app.ofertaTitulo ?? 'Oferta sin título';
  const canWithdraw = !['SELECCIONADA', 'RECHAZADA', 'RETIRADA', 'CANCELADA', 'CERRADA'].includes(app.estado);

  return (
    <article className="p-5 transition-colors hover:bg-slate-50/70 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* Avatar */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${getAvatarColor(title)}`}
        >
          {getInitials(title)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col justify-between gap-2 sm:flex-row">
            <div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                {app.candidatoNombre && (
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" />
                    {app.candidatoNombre}
                  </span>
                )}
                {app.candidatoEmail && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {app.candidatoEmail}
                  </span>
                )}
              </div>
            </div>
            {/* Badge estado */}
            <span
              className={`inline-flex h-fit items-center gap-1.5 self-start rounded-full border px-2.5 py-1 text-xs font-semibold ${ESTADO_STYLE[app.estado]}`}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              {ESTADO_LABEL[app.estado]}
            </span>
          </div>

          {app.cartaPresentacion && (
            <p className="mt-3 line-clamp-2 text-sm text-slate-600">{app.cartaPresentacion}</p>
          )}

          {/* IA info */}
          {app.porcentajeCoincidencia != null && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                🤖 {app.porcentajeCoincidencia}% coincidencia IA
              </span>
              {app.cumpleRequerimientos != null && (
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${
                    app.cumpleRequerimientos
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {app.cumpleRequerimientos ? '✓ Cumple requisitos' : '✗ No cumple requisitos'}
                </span>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-col justify-between gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                Postulada el {formatDate(app.fechaPostulacion)}
              </span>
              {app.fechaActualizacion && (
                <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-600">
                  Actualizado: {formatDate(app.fechaActualizacion)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {canWithdraw && (
                <button
                  type="button"
                  disabled={withdrawing}
                  onClick={() => onWithdraw(app.uuid)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 disabled:opacity-50"
                >
                  {withdrawing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                  Retirar
                </button>
              )}
              <button
                type="button"
                onClick={onDetail}
                className="inline-flex items-center gap-1 text-left text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Ver detalles <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

// ── Modal detalle ─────────────────────────────────────────────────────────────
const DetailModal = ({
  app,
  onClose,
}: {
  app: PostulacionResponse;
  onClose: () => void;
}) => {
  const StatusIcon = ESTADO_ICON[app.estado] ?? Clock3;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-slate-900">Detalle de postulación</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Oferta</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{app.ofertaTitulo ?? '—'}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${ESTADO_STYLE[app.estado]}`}>
              <StatusIcon className="h-4 w-4" />
              {ESTADO_LABEL[app.estado]}
            </span>
          </div>
          {app.cartaPresentacion && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Carta de presentación</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">{app.cartaPresentacion}</p>
            </div>
          )}
          {app.resumenIa && (
            <div className="rounded-xl bg-blue-50 p-4">
              <p className="mb-2 text-xs font-bold text-blue-800">🤖 Análisis IA</p>
              <p className="text-sm text-blue-900">{app.resumenIa}</p>
              {app.habilidadesEncontradas && (
                <p className="mt-2 text-xs text-blue-700"><strong>Habilidades:</strong> {app.habilidadesEncontradas}</p>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-xs">
            <div>
              <p className="font-semibold text-slate-400">Fecha postulación</p>
              <p className="mt-0.5 text-slate-700">{formatDate(app.fechaPostulacion)}</p>
            </div>
            {app.fechaActualizacion && (
              <div>
                <p className="font-semibold text-slate-400">Última actualización</p>
                <p className="mt-0.5 text-slate-700">{formatDate(app.fechaActualizacion)}</p>
              </div>
            )}
            {app.cvUrl && (
              <div className="col-span-2">
                <p className="font-semibold text-slate-400">CV</p>
                <a
                  href={app.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 inline-flex items-center gap-1 text-blue-600 underline"
                >
                  <FileText className="h-3.5 w-3.5" /> Ver CV adjunto
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
