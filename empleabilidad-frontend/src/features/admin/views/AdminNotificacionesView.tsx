import React, { useState, useMemo, useEffect } from 'react';
import {
  Bell,
  BellOff,
  BellRing,
  Check,
  CheckCheck,
  Trash2,
  Search,
  X,
  Settings,
  Users,
  Briefcase,
  FileText,
  Building2,
  Calendar,
  AlertTriangle,
  Star,
  Zap,
  MessageSquare,
  Shield,
  TrendingUp,
  Clock,
  Mail,
  Send,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminDashboardService } from '../services/admin-dashboard.service';

// ─── Tipos ─────────────────────────────────────────────────────────────────────
type NotifTipo =
  | 'NUEVA_POSTULACION'
  | 'NUEVA_EMPRESA'
  | 'NUEVO_USUARIO'
  | 'OFERTA_PENDIENTE'
  | 'ENTREVISTA_HOY'
  | 'SISTEMA'
  | 'ALERTA'
  | 'MATCH_IA'
  | 'REPORTE'
  | 'MENSAJE';

type NotifPrioridad = 'ALTA' | 'MEDIA' | 'BAJA';

export interface AdminNotificacion {
  id: string;
  tipo: NotifTipo;
  prioridad: NotifPrioridad;
  titulo: string;
  descripcion: string;
  detalle?: string;
  leida: boolean;
  fijada: boolean;
  fecha: string;
  avatar?: string;
  accionLabel?: string;
  accionPath?: string;
}

type LiveSummary = Awaited<ReturnType<typeof adminDashboardService.getResumen>>;
const buildLiveNotifications = (data: LiveSummary): AdminNotificacion[] => {
  const now = new Date().toISOString();
  const result: AdminNotificacion[] = [];
  if (data.usuarios.usuariosPendientes > 0) result.push({ id: 'live-users-pending', tipo: 'NUEVO_USUARIO', prioridad: 'ALTA', titulo: 'Usuarios pendientes de verificación', descripcion: `Hay ${data.usuarios.usuariosPendientes} cuenta(s) pendientes de revisión.`, leida: false, fijada: false, fecha: now, accionLabel: 'Revisar usuarios', accionPath: '/admin/usuarios' });
  if (data.ofertas.ofertasPendientes > 0) result.push({ id: 'live-jobs-pending', tipo: 'OFERTA_PENDIENTE', prioridad: 'MEDIA', titulo: 'Ofertas pendientes de aprobación', descripcion: `Hay ${data.ofertas.ofertasPendientes} oferta(s) esperando revisión administrativa.`, leida: false, fijada: false, fecha: now, accionLabel: 'Revisar ofertas', accionPath: '/admin/ofertas/listado' });
  result.push({ id: 'live-postulations', tipo: 'NUEVA_POSTULACION', prioridad: 'MEDIA', titulo: 'Resumen de postulaciones actualizado', descripcion: `La plataforma registra ${data.postulaciones.totalPostulaciones} postulación(es) y ${data.postulaciones.totalEntrevistas} entrevista(s).`, leida: true, fijada: false, fecha: now, accionLabel: 'Gestionar postulaciones', accionPath: '/admin/postulaciones' });
  return result;
};

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_NOTIFICACIONES: AdminNotificacion[] = [
  {
    id: 'n-001',
    tipo: 'NUEVA_EMPRESA',
    prioridad: 'ALTA',
    titulo: 'Empresa pendiente de verificación',
    descripcion: 'Banco Financiero Central S.A. solicitó acceso a la plataforma y requiere verificación manual de documentos.',
    detalle: 'RUC: 20109988776 · Sector: Banca y Finanzas',
    leida: false,
    fijada: true,
    fecha: '2026-09-15T18:42:00Z',
    accionLabel: 'Revisar empresa',
    accionPath: '/admin/usuarios/empresas',
  },
  {
    id: 'n-002',
    tipo: 'ALERTA',
    prioridad: 'ALTA',
    titulo: 'Pico inusual de postulaciones detectado',
    descripcion: 'Se registraron 89 postulaciones en la última hora para la oferta "Desarrollador Full Stack" de TechNova, superando el umbral normal (>50).',
    detalle: 'Oferta ID: OFR-2041 · Empresa: TechNova Solutions',
    leida: false,
    fijada: false,
    fecha: '2026-09-15T17:15:00Z',
    accionLabel: 'Ver postulaciones',
    accionPath: '/admin/postulaciones',
  },
  {
    id: 'n-003',
    tipo: 'ENTREVISTA_HOY',
    prioridad: 'ALTA',
    titulo: '3 entrevistas programadas para hoy',
    descripcion: 'Jefferson Huicho (10:00), Alejandra Quispe (15:00) y Leonardo Crispaitán (17:30) tienen entrevistas confirmadas para el día de hoy.',
    leida: false,
    fijada: false,
    fecha: '2026-09-15T08:00:00Z',
    accionLabel: 'Ver entrevistas',
    accionPath: '/admin/postulaciones/entrevistas',
  },
  {
    id: 'n-004',
    tipo: 'MATCH_IA',
    prioridad: 'MEDIA',
    titulo: 'AI Match de alta compatibilidad detectado',
    descripcion: 'El sistema identificó a Rodrigo Espinoza con un 94% de compatibilidad para la oferta de Data Scientist en DataCorp Perú.',
    detalle: 'Score: 94% · Candidato: Rodrigo Espinoza Delgado',
    leida: false,
    fijada: false,
    fecha: '2026-09-15T14:30:00Z',
    accionLabel: 'Ver perfil',
    accionPath: '/admin/postulaciones',
  },
  {
    id: 'n-005',
    tipo: 'NUEVA_POSTULACION',
    prioridad: 'MEDIA',
    titulo: '12 nuevas postulaciones recibidas',
    descripcion: 'Se han recibido 12 postulaciones nuevas en los últimas 2 horas para diversas ofertas activas de la plataforma.',
    leida: false,
    fijada: false,
    fecha: '2026-09-15T13:00:00Z',
    accionLabel: 'Gestionar postulaciones',
    accionPath: '/admin/postulaciones/listado',
  },
  {
    id: 'n-006',
    tipo: 'OFERTA_PENDIENTE',
    prioridad: 'MEDIA',
    titulo: 'Oferta laboral requiere aprobación',
    descripcion: 'La empresa InnovatePe publicó la oferta "Senior DevOps Engineer" que está pendiente de revisión y aprobación por parte del equipo admin.',
    detalle: 'Oferta ID: OFR-2048 · Empresa: InnovatePe',
    leida: true,
    fijada: false,
    fecha: '2026-09-15T11:20:00Z',
    accionLabel: 'Revisar oferta',
    accionPath: '/admin/ofertas',
  },
  {
    id: 'n-007',
    tipo: 'NUEVO_USUARIO',
    prioridad: 'BAJA',
    titulo: '8 nuevos registros de estudiantes',
    descripcion: 'Se registraron 8 nuevos estudiantes provenientes de la UNMSM y UPC en las últimas 24 horas.',
    leida: true,
    fijada: false,
    fecha: '2026-09-15T09:00:00Z',
    accionLabel: 'Ver usuarios',
    accionPath: '/admin/usuarios/candidatos',
  },
  {
    id: 'n-008',
    tipo: 'SISTEMA',
    prioridad: 'BAJA',
    titulo: 'Mantenimiento programado completado',
    descripcion: 'El mantenimiento preventivo de las 03:00 AM se completó exitosamente. Todos los microservicios operan con normalidad.',
    leida: true,
    fijada: false,
    fecha: '2026-09-15T03:45:00Z',
  },
  {
    id: 'n-009',
    tipo: 'REPORTE',
    prioridad: 'BAJA',
    titulo: 'Reporte mensual de agosto disponible',
    descripcion: 'El informe consolidado de agosto ya está disponible: 541 usuarios nuevos, 3.218 postulaciones y tasa de conversión del 29.8%.',
    leida: true,
    fijada: false,
    fecha: '2026-09-14T08:00:00Z',
    accionLabel: 'Descargar reporte',
    accionPath: '/admin/reportes',
  },
  {
    id: 'n-010',
    tipo: 'MENSAJE',
    prioridad: 'MEDIA',
    titulo: 'Consulta de reclutador: Juan Mendoza',
    descripcion: 'El reclutador Juan Carlos Mendoza solicita soporte para publicar una oferta de trabajo urgente fuera del horario habitual.',
    leida: true,
    fijada: false,
    fecha: '2026-09-14T16:30:00Z',
    accionLabel: 'Responder',
    accionPath: '/admin/notificaciones',
  },
  {
    id: 'n-011',
    tipo: 'ALERTA',
    prioridad: 'ALTA',
    titulo: 'Cuenta bloqueada por intentos fallidos',
    descripcion: 'El usuario carlos.bloqueado@correo.com fue bloqueado automáticamente tras 5 intentos de inicio de sesión fallidos consecutivos.',
    detalle: 'IP: 190.42.18.77 · Hora: 22:14',
    leida: true,
    fijada: false,
    fecha: '2026-09-13T22:14:00Z',
    accionLabel: 'Ver usuario',
    accionPath: '/admin/usuarios',
  },
  {
    id: 'n-012',
    tipo: 'MATCH_IA',
    prioridad: 'BAJA',
    titulo: 'Análisis semanal de IA completado',
    descripcion: 'El motor de matching de Gemini procesó 1.024 postulaciones con un score promedio de 81%. Se detectaron 34 matches de alta prioridad.',
    leida: true,
    fijada: false,
    fecha: '2026-09-13T06:00:00Z',
    accionLabel: 'Ver estadísticas',
    accionPath: '/admin/estadisticas',
  },
];

// Configuración de preferencias de notificación
void MOCK_NOTIFICACIONES;

const PREFS_INICIAL = {
  NUEVA_POSTULACION: true,
  NUEVA_EMPRESA: true,
  NUEVO_USUARIO: true,
  OFERTA_PENDIENTE: true,
  ENTREVISTA_HOY: true,
  SISTEMA: false,
  ALERTA: true,
  MATCH_IA: true,
  REPORTE: false,
  MENSAJE: true,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TIPO_CONFIG: Record<NotifTipo, {
  label: string; icon: React.ReactNode;
  bg: string; color: string; border: string; dot: string;
}> = {
  NUEVA_POSTULACION: { label: 'Postulación',   icon: <FileText className="w-4 h-4" />,    bg: 'bg-indigo-50',  color: 'text-indigo-600', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  NUEVA_EMPRESA:     { label: 'Empresa',        icon: <Building2 className="w-4 h-4" />,   bg: 'bg-violet-50',  color: 'text-violet-600', border: 'border-violet-200', dot: 'bg-violet-500' },
  NUEVO_USUARIO:     { label: 'Usuario',         icon: <Users className="w-4 h-4" />,       bg: 'bg-blue-50',    color: 'text-blue-600',   border: 'border-blue-200',   dot: 'bg-blue-500' },
  OFERTA_PENDIENTE:  { label: 'Oferta',          icon: <Briefcase className="w-4 h-4" />,   bg: 'bg-amber-50',   color: 'text-amber-600',  border: 'border-amber-200',  dot: 'bg-amber-500' },
  ENTREVISTA_HOY:    { label: 'Entrevista',      icon: <Calendar className="w-4 h-4" />,    bg: 'bg-cyan-50',    color: 'text-cyan-600',   border: 'border-cyan-200',   dot: 'bg-cyan-500' },
  SISTEMA:           { label: 'Sistema',         icon: <Settings className="w-4 h-4" />,    bg: 'bg-slate-50',   color: 'text-slate-500',  border: 'border-slate-200',  dot: 'bg-slate-400' },
  ALERTA:            { label: 'Alerta',          icon: <AlertTriangle className="w-4 h-4" />, bg: 'bg-rose-50', color: 'text-rose-600',   border: 'border-rose-200',   dot: 'bg-rose-500' },
  MATCH_IA:          { label: 'AI Match',        icon: <Zap className="w-4 h-4" />,         bg: 'bg-emerald-50', color: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  REPORTE:           { label: 'Reporte',         icon: <TrendingUp className="w-4 h-4" />,  bg: 'bg-orange-50',  color: 'text-orange-600', border: 'border-orange-200', dot: 'bg-orange-500' },
  MENSAJE:           { label: 'Mensaje',         icon: <MessageSquare className="w-4 h-4" />, bg: 'bg-pink-50', color: 'text-pink-600',   border: 'border-pink-200',   dot: 'bg-pink-500' },
};

const PRIORIDAD_CONFIG: Record<NotifPrioridad, { label: string; color: string; bg: string }> = {
  ALTA:  { label: 'Alta',  color: 'text-rose-700',   bg: 'bg-rose-50 border border-rose-200' },
  MEDIA: { label: 'Media', color: 'text-amber-700',  bg: 'bg-amber-50 border border-amber-200' },
  BAJA:  { label: 'Baja',  color: 'text-slate-500',  bg: 'bg-slate-50 border border-slate-200' },
};

const PREFS_LABELS: Record<NotifTipo, string> = {
  NUEVA_POSTULACION: 'Nuevas postulaciones recibidas',
  NUEVA_EMPRESA:     'Registro de empresas (verificación)',
  NUEVO_USUARIO:     'Nuevos registros de usuarios',
  OFERTA_PENDIENTE:  'Ofertas pendientes de aprobación',
  ENTREVISTA_HOY:    'Recordatorio de entrevistas del día',
  SISTEMA:           'Alertas del sistema y mantenimiento',
  ALERTA:            'Alertas de seguridad críticas',
  MATCH_IA:          'Matches de alta compatibilidad (IA)',
  REPORTE:           'Reportes automáticos disponibles',
  MENSAJE:           'Mensajes de usuarios y reclutadores',
};

const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'Ahora mismo';
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `Hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Ayer';
  return `Hace ${days} días`;
};

// ─── Sub-componente: Tarjeta de Notificación ──────────────────────────────────
const NotifCard: React.FC<{
  notif: AdminNotificacion;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
  onSelect: (notif: AdminNotificacion) => void;
  isSelected: boolean;
}> = ({ notif, onRead, onDelete, onPin, onSelect, isSelected }) => {
  const cfg  = TIPO_CONFIG[notif.tipo];
  const pcfg = PRIORIDAD_CONFIG[notif.prioridad];

  return (
    <div
      className={`relative group flex gap-4 px-5 py-4 border-b border-slate-100 last:border-0 transition-all cursor-pointer
        ${!notif.leida ? 'bg-indigo-50/40' : 'bg-white hover:bg-slate-50/60'}
        ${isSelected ? 'ring-2 ring-inset ring-indigo-400' : ''}
      `}
      onClick={() => onSelect(notif)}
    >
      {/* Indicador no leída */}
      {!notif.leida && (
        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full ${cfg.dot}`} />
      )}

      {/* Ícono tipo */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
        {cfg.icon}
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-slate-900 leading-snug">{notif.titulo}</span>
            {notif.fijada && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                📌 Fijada
              </span>
            )}
            {!notif.leida && (
              <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pcfg.bg} ${pcfg.color}`}>
              {pcfg.label}
            </span>
            <span className="text-xs text-slate-400 whitespace-nowrap">{timeAgo(notif.fecha)}</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{notif.descripcion}</p>

        {notif.detalle && (
          <p className="text-[11px] text-slate-400 mt-1 font-medium">{notif.detalle}</p>
        )}

        <div className="flex items-center gap-3 mt-2">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
            {cfg.icon}
            <span className="ml-0.5">{cfg.label}</span>
          </span>
          {notif.accionLabel && (
            <button
              onClick={e => { e.stopPropagation(); toast.success(`Navegando: ${notif.accionLabel}`); }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              {notif.accionLabel} →
            </button>
          )}
        </div>
      </div>

      {/* Acciones hover */}
      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {!notif.leida && (
          <button
            onClick={e => { e.stopPropagation(); onRead(notif.id); }}
            title="Marcar como leída"
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={e => { e.stopPropagation(); onPin(notif.id); }}
          title={notif.fijada ? 'Desfijar' : 'Fijar'}
          className={`p-1.5 rounded-lg transition-colors ${notif.fijada ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'}`}
        >
          <Star className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={e => { e.stopPropagation(); onDelete(notif.id); }}
          title="Eliminar"
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ─── Vista Principal ───────────────────────────────────────────────────────────
export const AdminNotificacionesView: React.FC = () => {
  const [notifs, setNotifs]           = useState<AdminNotificacion[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [filterTipo, setFilterTipo]   = useState<'TODOS' | NotifTipo>('TODOS');
  const [filterLeida, setFilterLeida] = useState<'TODOS' | 'LEIDAS' | 'NO_LEIDAS'>('TODOS');
  const [filterPrio, setFilterPrio]   = useState<'TODOS' | NotifPrioridad>('TODOS');
  const [selected, setSelected]       = useState<AdminNotificacion | null>(null);
  const [activeTab, setActiveTab]     = useState<'INBOX' | 'FIJADAS' | 'CONFIGURACION'>('INBOX');
  const [prefs, setPrefs]             = useState(PREFS_INICIAL);
  const [showCompose, setShowCompose] = useState(false);
  const [composeMsg, setComposeMsg]   = useState({ titulo: '', mensaje: '', tipo: 'SISTEMA' as NotifTipo });

  useEffect(() => {
    let mounted = true;
    const load = async () => { try { const data = await adminDashboardService.getResumen(); if (mounted) setNotifs(buildLiveNotifications(data)); } catch { if (mounted) toast.error('No se pudieron cargar las notificaciones'); } finally { if (mounted) setLoading(false); } };
    void load(); const timer = window.setInterval(load, 30000); return () => { mounted = false; window.clearInterval(timer); };
  }, []);

  // Estadísticas
  const stats = useMemo(() => ({
    total:    notifs.length,
    noLeidas: notifs.filter(n => !n.leida).length,
    fijadas:  notifs.filter(n => n.fijada).length,
    alta:     notifs.filter(n => n.prioridad === 'ALTA' && !n.leida).length,
  }), [notifs]);

  // Filtrado
  const filtered = useMemo(() => {
    let list = activeTab === 'FIJADAS' ? notifs.filter(n => n.fijada) : notifs;
    if (filterTipo   !== 'TODOS')    list = list.filter(n => n.tipo === filterTipo);
    if (filterLeida  === 'LEIDAS')   list = list.filter(n => n.leida);
    if (filterLeida  === 'NO_LEIDAS') list = list.filter(n => !n.leida);
    if (filterPrio   !== 'TODOS')    list = list.filter(n => n.prioridad === filterPrio);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(n =>
        n.titulo.toLowerCase().includes(q) ||
        n.descripcion.toLowerCase().includes(q) ||
        (n.detalle ?? '').toLowerCase().includes(q)
      );
    }
    // Fijadas primero, luego por fecha
    return [...list].sort((a, b) => {
      if (a.fijada !== b.fijada) return a.fijada ? -1 : 1;
      if (!a.leida !== !b.leida) return !a.leida ? -1 : 1;
      return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
    });
  }, [notifs, search, filterTipo, filterLeida, filterPrio, activeTab]);

  const markRead    = (id: string) => {
    setNotifs(p => p.map(n => n.id === id ? { ...n, leida: true } : n));
    if (selected?.id === id) setSelected(p => p ? { ...p, leida: true } : null);
    toast.success('Notificación marcada como leída');
  };
  const markAllRead = () => {
    setNotifs(p => p.map(n => ({ ...n, leida: true })));
    toast.success('Todas las notificaciones marcadas como leídas');
  };
  const deleteNotif = (id: string) => {
    setNotifs(p => p.filter(n => n.id !== id));
    if (selected?.id === id) setSelected(null);
    toast.success('Notificación eliminada');
  };
  const pinNotif = (id: string) => {
    setNotifs(p => p.map(n => n.id === id ? { ...n, fijada: !n.fijada } : n));
    if (selected?.id === id) setSelected(p => p ? { ...p, fijada: !p.fijada } : null);
  };
  const togglePref = (key: NotifTipo) => {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
    toast.success(`Preferencia actualizada`);
  };

  const sendBroadcast = () => {
    if (!composeMsg.titulo.trim() || !composeMsg.mensaje.trim()) {
      toast.error('Completa el título y mensaje');
      return;
    }
    const nueva: AdminNotificacion = {
      id: `n-${Date.now()}`,
      tipo: composeMsg.tipo,
      prioridad: 'MEDIA',
      titulo: composeMsg.titulo,
      descripcion: composeMsg.mensaje,
      leida: false,
      fijada: false,
      fecha: new Date().toISOString(),
    };
    setNotifs(p => [nueva, ...p]);
    setShowCompose(false);
    setComposeMsg({ titulo: '', mensaje: '', tipo: 'SISTEMA' });
    toast.success('Notificación enviada al sistema');
  };

  // ── Render: Panel de Detalle ──────────────────────────────────────────────
  const renderDetalle = () => {
    if (!selected) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
            <BellRing className="w-8 h-8 text-indigo-400" />
          </div>
          <p className="text-sm font-semibold text-slate-600">Selecciona una notificación</p>
          <p className="text-xs text-slate-400 mt-1">Haz clic en cualquier notificación para ver su detalle aquí.</p>
        </div>
      );
    }
    const cfg  = TIPO_CONFIG[selected.tipo];
    const pcfg = PRIORIDAD_CONFIG[selected.prioridad];
    return (
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`px-6 py-5 border-b border-slate-100 ${cfg.bg}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${cfg.bg} ${cfg.color} ${cfg.border} shadow-sm`}>
                {cfg.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                    {cfg.label}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pcfg.bg} ${pcfg.color}`}>
                    Prioridad {pcfg.label}
                  </span>
                  {!selected.leida && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      No leída
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">{selected.titulo}</h3>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white/80 rounded-lg transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cuerpo */}
        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(selected.fecha).toLocaleString('es-PE', { dateStyle: 'full', timeStyle: 'short' })}</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-sm text-slate-700 leading-relaxed">{selected.descripcion}</p>
            {selected.detalle && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-xs text-slate-500 font-medium">{selected.detalle}</p>
              </div>
            )}
          </div>

          {selected.accionLabel && (
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
              <p className="text-xs text-indigo-700 font-semibold mb-2">Acción recomendada</p>
              <button
                onClick={() => toast.success(`Navegando a: ${selected.accionLabel}`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
              >
                {selected.accionLabel} →
              </button>
            </div>
          )}
        </div>

        {/* Footer acciones */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center gap-2 flex-wrap">
          {!selected.leida && (
            <button
              onClick={() => markRead(selected.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Marcar leída
            </button>
          )}
          <button
            onClick={() => pinNotif(selected.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${selected.fijada ? 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100' : 'text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
          >
            <Star className="w-3.5 h-3.5" /> {selected.fijada ? 'Desfijar' : 'Fijar'}
          </button>
          <button
            onClick={() => deleteNotif(selected.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Eliminar
          </button>
        </div>
      </div>
    );
  };

  // ── Render: Configuración ─────────────────────────────────────────────────
  const renderConfig = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-600" /> Preferencias de Notificación
        </h3>
        <p className="text-xs text-slate-500 mb-5">Activa o desactiva los tipos de notificaciones que deseas recibir.</p>
        <div className="space-y-3">
          {(Object.entries(PREFS_LABELS) as [NotifTipo, string][]).map(([key, label]) => {
            const cfg = TIPO_CONFIG[key];
            const active = prefs[key];
            return (
              <div key={key} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${active ? 'bg-indigo-50/60 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                    {cfg.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{cfg.label}</p>
                    <p className="text-[10px] text-slate-500">{label}</p>
                  </div>
                </div>
                <button
                  onClick={() => togglePref(key)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${active ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-5">
        {/* Canal de entrega */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Mail className="w-4 h-4 text-violet-600" /> Canal de Entrega
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Notificaciones en el panel', sub: 'En tiempo real dentro del dashboard admin', active: true },
              { label: 'Correo electrónico (resumen)', sub: 'Envío diario a las 08:00 AM', active: true },
              { label: 'Notificaciones push (browser)', sub: 'Alertas inmediatas de alta prioridad', active: false },
              { label: 'Webhook externo', sub: 'POST a endpoint configurado', active: false },
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${item.active ? 'bg-violet-50/60 border-violet-200' : 'bg-slate-50 border-slate-200'}`}>
                <div>
                  <p className="text-xs font-semibold text-slate-800">{item.label}</p>
                  <p className="text-[10px] text-slate-500">{item.sub}</p>
                </div>
                <button className={`relative w-10 h-5 rounded-full transition-colors ${item.active ? 'bg-violet-600' : 'bg-slate-300'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${item.active ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen de actividad */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-5 text-white">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" /> Estado del Sistema de Alertas
          </h3>
          <div className="space-y-2">
            {[
              { label: 'Tiempo activo del servicio', val: '99.8%' },
              { label: 'Notificaciones enviadas hoy', val: '47' },
              { label: 'Latencia promedio', val: '120ms' },
              { label: 'Alertas críticas pendientes', val: stats.alta.toString() },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-white/70">{row.label}</span>
                <span className="font-bold text-white">{row.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen">

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 text-white">
              <Bell className="w-6 h-6" />
            </div>
            {stats.noLeidas > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-md">
                {stats.noLeidas > 9 ? '9+' : stats.noLeidas}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notificaciones</h1>
            <p className="text-sm text-slate-500">
              {stats.noLeidas > 0
                ? `Tienes ${stats.noLeidas} notificaciones sin leer · ${stats.alta} de alta prioridad`
                : 'Todo al día — Sin notificaciones pendientes'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {stats.noLeidas > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
            >
              <CheckCheck className="w-4 h-4 text-slate-500" />
              Marcar todas
            </button>
          )}
          <button
            onClick={() => setShowCompose(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Send className="w-4 h-4" />
            Nueva alerta
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: <Bell className="w-5 h-5" />, label: 'Total', val: stats.total, accent: 'bg-indigo-50 text-indigo-600', border: 'hover:border-indigo-200' },
          { icon: <BellRing className="w-5 h-5" />, label: 'Sin leer', val: stats.noLeidas, accent: 'bg-rose-50 text-rose-600', border: 'hover:border-rose-200' },
          { icon: <Star className="w-5 h-5" />, label: 'Fijadas', val: stats.fijadas, accent: 'bg-amber-50 text-amber-600', border: 'hover:border-amber-200' },
          { icon: <AlertTriangle className="w-5 h-5" />, label: 'Alta prioridad', val: stats.alta, accent: 'bg-orange-50 text-orange-600', border: 'hover:border-orange-200' },
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

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-2 py-2">
        <div className="flex items-center gap-1">
          {([
            { key: 'INBOX', label: 'Bandeja de entrada', icon: <Bell className="w-4 h-4" />, count: stats.total },
            { key: 'FIJADAS', label: 'Fijadas', icon: <Star className="w-4 h-4" />, count: stats.fijadas },
            { key: 'CONFIGURACION', label: 'Configuración', icon: <Settings className="w-4 h-4" />, count: null },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSelected(null); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === tab.key ? 'bg-indigo-200/60 text-indigo-800' : 'bg-slate-100 text-slate-600'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido según tab */}
      {activeTab === 'CONFIGURACION' ? renderConfig() : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Lista de notificaciones (col 3) */}
          <div className="lg:col-span-3 space-y-3">

            {/* Barra de filtros */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar notificaciones..."
                  className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all placeholder:text-slate-400"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <select
                  value={filterLeida}
                  onChange={e => setFilterLeida(e.target.value as typeof filterLeida)}
                  className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                >
                  <option value="TODOS">Todas</option>
                  <option value="NO_LEIDAS">Sin leer</option>
                  <option value="LEIDAS">Leídas</option>
                </select>
                <select
                  value={filterPrio}
                  onChange={e => setFilterPrio(e.target.value as typeof filterPrio)}
                  className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                >
                  <option value="TODOS">Prioridad</option>
                  <option value="ALTA">Alta</option>
                  <option value="MEDIA">Media</option>
                  <option value="BAJA">Baja</option>
                </select>
                <select
                  value={filterTipo}
                  onChange={e => setFilterTipo(e.target.value as typeof filterTipo)}
                  className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                >
                  <option value="TODOS">Tipo</option>
                  {(Object.keys(TIPO_CONFIG) as NotifTipo[]).map(t => (
                    <option key={t} value={t}>{TIPO_CONFIG[t].label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lista */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {loading ? (
                <div className="py-16 text-center text-sm text-slate-500">Cargando notificaciones reales...</div>
              ) : filtered.length === 0 ? (
                <div className="py-16 text-center">
                  <BellOff className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-600">Sin resultados</p>
                  <p className="text-xs text-slate-400 mt-1">Ajusta los filtros o prueba otra búsqueda.</p>
                </div>
              ) : (
                filtered.map(n => (
                  <NotifCard
                    key={n.id}
                    notif={n}
                    onRead={markRead}
                    onDelete={deleteNotif}
                    onPin={pinNotif}
                    onSelect={n => { setSelected(n); if (!n.leida) markRead(n.id); }}
                    isSelected={selected?.id === n.id}
                  />
                ))
              )}
            </div>

            <p className="text-xs text-slate-400 text-center">
              Mostrando <span className="font-bold text-slate-600">{filtered.length}</span> de{' '}
              <span className="font-bold text-slate-600">{notifs.length}</span> notificaciones
            </p>
          </div>

          {/* Panel de Detalle (col 2) */}
          <div className="lg:col-span-2 flex flex-col">
            {renderDetalle()}
          </div>
        </div>
      )}

      {/* Modal Compose */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(6px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Nueva alerta del sistema</h3>
              </div>
              <button onClick={() => setShowCompose(false)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Tipo de notificación</label>
                <select
                  value={composeMsg.tipo}
                  onChange={e => setComposeMsg(p => ({ ...p, tipo: e.target.value as NotifTipo }))}
                  className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                >
                  {(Object.keys(TIPO_CONFIG) as NotifTipo[]).map(t => (
                    <option key={t} value={t}>{TIPO_CONFIG[t].label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Título</label>
                <input
                  type="text"
                  value={composeMsg.titulo}
                  onChange={e => setComposeMsg(p => ({ ...p, titulo: e.target.value }))}
                  placeholder="Ej. Mantenimiento programado a las 03:00 AM"
                  className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Mensaje</label>
                <textarea
                  value={composeMsg.mensaje}
                  onChange={e => setComposeMsg(p => ({ ...p, mensaje: e.target.value }))}
                  placeholder="Describe el detalle de la notificación..."
                  rows={4}
                  className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 placeholder:text-slate-400 resize-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCompose(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={sendBroadcast}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all"
              >
                <Send className="w-4 h-4" /> Enviar alerta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotificacionesView;
