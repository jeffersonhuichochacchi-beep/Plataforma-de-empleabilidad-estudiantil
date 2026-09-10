import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, ExternalLink, MapPin, MessageCircle, RefreshCw, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import { jobService } from '../services/job.service';
import type { EntrevistaResponse, PostulacionResponse } from '../types/job.types';

const typeLabel: Record<string, string> = { VIRTUAL: 'Entrevista virtual', PRESENCIAL: 'Entrevista presencial', TELEFONICA: 'Entrevista telefónica' };
const statusLabel: Record<string, string> = { PROGRAMADA: 'Programada', CONFIRMADA: 'Confirmada', REALIZADA: 'Realizada', CANCELADA: 'Cancelada', NO_ASISTIO: 'No asistió', REPROGRAMADA: 'Reprogramada' };
const dateText = (value: string) => new Date(value).toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' });

export const CandidateInterviewsView = () => {
  const [interviews, setInterviews] = useState<(EntrevistaResponse & { application?: PostulacionResponse })[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'upcoming' | 'history'>('upcoming');
  const load = async () => {
    setLoading(true);
    try {
      const apps = await jobService.getMyApplications({ size: 100 });
      const applications = apps.content || [];

      // Consultar por postulación evita que una respuesta global quede
      // desactualizada después de que la empresa reprograma una entrevista.
      const interviewPages = await Promise.all(
        applications.map(application =>
          jobService.getInterviewsByApplication(application.uuid)
            .then(result => result.content || [])
            .catch(() => [])
        )
      );

      const applicationById = new Map(applications.map(application => [application.uuid, application]));
      const loadedInterviews = interviewPages.flat().map(interview => ({
        ...interview,
        application: applicationById.get(interview.postulacionId),
      }));

      setInterviews(loadedInterviews.sort((a, b) =>
        new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
      ));
    } catch {
      toast.error('No se pudieron cargar tus entrevistas.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);
  // La fecha llega normalizada por el backend en UTC. No ocultar una
  // entrevista activa solo por una diferencia de zona horaria al actualizar;
  // únicamente los estados finales deben pasar al historial.
  const upcoming = useMemo(() => interviews.filter(i => !['REALIZADA', 'CANCELADA', 'NO_ASISTIO'].includes(i.estado)), [interviews]);
  const history = useMemo(() => interviews.filter(i => !upcoming.includes(i)), [interviews, upcoming]);
  const visible = tab === 'upcoming' ? upcoming : history;
  return <div className="mx-auto max-w-6xl space-y-6 animate-fade-in"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-1 text-sm font-semibold text-blue-600">Organiza tu agenda</p><h1 className="text-3xl font-bold tracking-tight text-slate-900">Mis entrevistas</h1><p className="mt-2 text-slate-500">Aquí aparecerán las entrevistas que las empresas programen para tus postulaciones.</p></div><button onClick={load} className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm"><RefreshCw className={`h-4 w-4 text-blue-600 ${loading ? 'animate-spin' : ''}`} />Actualizar</button></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><SummaryCard icon={<CalendarDays />} value={String(upcoming.length)} label="Próximas entrevistas" tone="blue" /><SummaryCard icon={<CheckCircle2 />} value={String(interviews.filter(i => i.estado === 'REALIZADA').length)} label="Completadas" tone="emerald" /><SummaryCard icon={<Clock3 />} value={String(interviews.length)} label="Total de entrevistas" tone="indigo" /></div><section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 px-5 pt-5 sm:px-6 sm:pt-6"><h2 className="text-lg font-bold text-slate-900">Agenda de entrevistas</h2><p className="mt-1 text-sm text-slate-500">Consulta fecha, modalidad y detalles de cada reunión.</p><div className="mt-5 flex gap-6"><TabButton active={tab === 'upcoming'} onClick={() => setTab('upcoming')}>Próximas <span className="ml-1 rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-700">{upcoming.length}</span></TabButton><TabButton active={tab === 'history'} onClick={() => setTab('history')}>Historial</TabButton></div></div>{loading ? <div className="p-12 text-center text-sm text-slate-500"><RefreshCw className="mx-auto mb-3 h-7 w-7 animate-spin text-blue-600" />Cargando entrevistas...</div> : visible.length === 0 ? <div className="p-12 text-center"><CalendarDays className="mx-auto mb-3 h-10 w-10 text-slate-300" /><p className="font-semibold text-slate-700">{tab === 'upcoming' ? 'Aún no tienes entrevistas programadas' : 'No hay entrevistas en tu historial'}</p><p className="mt-1 text-sm text-slate-500">La empresa te notificará aquí cuando programe una entrevista.</p></div> : <div className="divide-y divide-slate-100">{visible.map(i => <InterviewCard key={i.uuid} interview={i} upcoming={tab === 'upcoming'} />)}</div>}</section></div>;
};
const SummaryCard = ({ icon, value, label, tone }: { icon: React.ReactNode; value: string; label: string; tone: 'blue' | 'emerald' | 'indigo' }) => { const tones = { blue: 'bg-blue-50 text-blue-600', emerald: 'bg-emerald-50 text-emerald-600', indigo: 'bg-indigo-50 text-indigo-600' }; return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]} [&>svg]:h-5 [&>svg]:w-5`}>{icon}</div><p className="text-2xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs font-medium text-slate-500">{label}</p></div>; };
const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => <button type="button" onClick={onClick} className={`border-b-2 px-1 pb-3 text-sm font-semibold ${active ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500'}`}>{children}</button>;
const InterviewCard = ({ interview, upcoming }: { interview: EntrevistaResponse & { application?: PostulacionResponse }; upcoming: boolean }) => <article className="p-5 sm:p-6"><div className="flex gap-4"><div className="hidden w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-50 py-2 sm:flex"><span className="text-xl font-bold text-slate-800">{new Date(interview.fechaHora).getDate()}</span><span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{new Date(interview.fechaHora).toLocaleDateString('es-CO', { month: 'short' })}</span></div><div className="min-w-0 flex-1"><div className="flex flex-col justify-between gap-2 sm:flex-row"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-slate-900">{typeLabel[interview.tipo] || interview.tipo}</h3><span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">{statusLabel[interview.estado] || interview.estado}</span></div><p className="mt-1 text-sm font-medium text-blue-600">{interview.application?.ofertaTitulo || 'Proceso de selección'}</p></div><span className="flex items-center gap-1 text-xs text-slate-500"><Clock3 className="h-3.5 w-3.5" />{dateText(interview.fechaHora)} · {interview.duracion} min</span></div><div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-2"><span className="flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5 text-slate-400" />{interview.observaciones || 'Sin observaciones adicionales'}</span><span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-400" />{interview.tipo === 'VIRTUAL' ? 'Videollamada' : interview.ubicacion || interview.enlace || 'Detalles por confirmar'}</span></div>{interview.enlace && <a href={interview.enlace} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600">{upcoming ? <Video className="h-3.5 w-3.5" /> : <ExternalLink className="h-3.5 w-3.5" />}{upcoming ? 'Unirse a la reunión' : 'Abrir enlace'}</a>}</div></div></article>;
