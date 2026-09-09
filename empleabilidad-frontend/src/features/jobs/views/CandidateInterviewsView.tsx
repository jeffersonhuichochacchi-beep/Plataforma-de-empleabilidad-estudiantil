import { useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Video,
} from 'lucide-react';

type InterviewTab = 'próximas' | 'historial';

interface Interview {
  id: number;
  day: string;
  month: string;
  time: string;
  type: string;
  role: string;
  company: string;
  interviewer: string;
  location: string;
  status: 'Confirmada' | 'Pendiente' | 'Completada';
  color: string;
  initials: string;
}

const upcomingInterviews: Interview[] = [
  {
    id: 1,
    day: '18',
    month: 'JUN',
    time: '10:00 a. m. — 10:45 a. m.',
    type: 'Entrevista técnica',
    role: 'Frontend Developer',
    company: 'Digital Labs',
    interviewer: 'Laura Gómez · Tech Lead',
    location: 'Videollamada · Google Meet',
    status: 'Confirmada',
    color: 'bg-blue-100 text-blue-700',
    initials: 'DL',
  },
  {
    id: 2,
    day: '23',
    month: 'JUN',
    time: '3:30 p. m. — 4:00 p. m.',
    type: 'Entrevista inicial',
    role: 'Desarrollador React Junior',
    company: 'Nexa Solutions',
    interviewer: 'Andrés Rojas · Talent Partner',
    location: 'Videollamada · Microsoft Teams',
    status: 'Pendiente',
    color: 'bg-indigo-100 text-indigo-700',
    initials: 'NS',
  },
];

const pastInterviews: Interview[] = [
  {
    id: 3,
    day: '29',
    month: 'ABR',
    time: '11:00 a. m.',
    type: 'Entrevista de selección',
    role: 'Ingeniero de Frontend',
    company: 'Innova Tech',
    interviewer: 'Equipo de Producto',
    location: 'Videollamada',
    status: 'Completada',
    color: 'bg-emerald-100 text-emerald-700',
    initials: 'IT',
  },
  {
    id: 4,
    day: '12',
    month: 'ABR',
    time: '9:30 a. m.',
    type: 'Llamada de screening',
    role: 'Web Developer',
    company: 'Studio Creativo',
    interviewer: 'Mariana Ruiz · Recruiter',
    location: 'Llamada telefónica',
    status: 'Completada',
    color: 'bg-orange-100 text-orange-700',
    initials: 'SC',
  },
];

export const CandidateInterviewsView = () => {
  const [activeTab, setActiveTab] = useState<InterviewTab>('próximas');
  const visibleInterviews = activeTab === 'próximas' ? upcomingInterviews : pastInterviews;

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-sm font-semibold text-blue-600">Organiza tu agenda</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mis entrevistas</h1>
          <p className="mt-2 text-slate-500">Prepárate y da el siguiente paso en tu proceso laboral.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm"><CalendarDays className="h-4 w-4 text-blue-600" /> Junio 2026</div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard icon={<CalendarDays />} value="2" label="Próximas entrevistas" tone="blue" />
        <SummaryCard icon={<CheckCircle2 />} value="1" label="Proceso avanzado" tone="emerald" />
        <SummaryCard icon={<Clock3 />} value="100%" label="Asistencia este mes" tone="indigo" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 pt-5 sm:px-6 sm:pt-6">
            <div className="flex items-center justify-between gap-4"><div><h2 className="text-lg font-bold text-slate-900">Agenda de entrevistas</h2><p className="mt-1 text-sm text-slate-500">Consulta tus reuniones y detalles del proceso.</p></div><button type="button" className="hidden rounded-lg p-2 text-slate-400 hover:bg-slate-100 sm:block"><MoreHorizontal className="h-5 w-5" /></button></div>
            <div className="mt-5 flex gap-6"><TabButton active={activeTab === 'próximas'} onClick={() => setActiveTab('próximas')}>Próximas <span className="ml-1 rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-700">2</span></TabButton><TabButton active={activeTab === 'historial'} onClick={() => setActiveTab('historial')}>Historial</TabButton></div>
          </div>
          <div className="divide-y divide-slate-100">
            {visibleInterviews.map((interview) => <InterviewCard key={interview.id} interview={interview} upcoming={activeTab === 'próximas'} />)}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg shadow-blue-600/15"><div className="mb-5 flex items-center justify-between"><div className="rounded-xl bg-white/15 p-2.5"><MessageCircle className="h-5 w-5" /></div><span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium">Próxima</span></div><p className="text-sm text-blue-100">Miércoles, 18 de junio</p><h2 className="mt-1 text-xl font-bold">Entrevista técnica</h2><p className="mt-2 text-sm text-blue-100">Frontend Developer · Digital Labs</p><div className="mt-5 flex items-center gap-2 border-t border-white/20 pt-4 text-sm"><Clock3 className="h-4 w-4" /> 10:00 a. m.</div><button type="button" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"><Video className="h-4 w-4" /> Ir a la reunión</button></section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-slate-900">Antes de tu entrevista</h2><p className="mt-1 text-xs leading-5 text-slate-500">Pequeños detalles que pueden marcar la diferencia.</p><div className="mt-4 space-y-3"><ChecklistItem text="Revisa la descripción del empleo" done /><ChecklistItem text="Prepara ejemplos de tus proyectos" /><ChecklistItem text="Comprueba tu cámara y micrófono" /><ChecklistItem text="Conéctate 5 minutos antes" /></div><button type="button" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">Ver guía de preparación <ArrowRight className="h-4 w-4" /></button></section>
        </aside>
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, value, label, tone }: { icon: React.ReactNode; value: string; label: string; tone: 'blue' | 'emerald' | 'indigo' }) => { const tones = { blue: 'bg-blue-50 text-blue-600', emerald: 'bg-emerald-50 text-emerald-600', indigo: 'bg-indigo-50 text-indigo-600' }; return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]} [&>svg]:h-5 [&>svg]:w-5`}>{icon}</div><p className="text-2xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs font-medium text-slate-500">{label}</p></div>; };

const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => <button type="button" onClick={onClick} className={`border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${active ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>{children}</button>;

const InterviewCard = ({ interview, upcoming }: { interview: Interview; upcoming: boolean }) => <article className="p-5 transition-colors hover:bg-slate-50/70 sm:p-6"><div className="flex gap-4"><div className="hidden w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-50 py-2 sm:flex"><span className="text-xl font-bold text-slate-800">{interview.day}</span><span className="text-[10px] font-bold tracking-wider text-slate-500">{interview.month}</span></div><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold sm:hidden ${interview.color}`}>{interview.initials}</div><div className="min-w-0 flex-1"><div className="flex flex-col justify-between gap-2 sm:flex-row"><div><div className="flex items-center gap-2"><h3 className="font-bold text-slate-900">{interview.type}</h3>{upcoming && <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${interview.status === 'Confirmada' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>{interview.status}</span>}</div><p className="mt-1 text-sm font-medium text-blue-600">{interview.role} · {interview.company}</p></div><span className="flex items-center gap-1 text-xs text-slate-500"><Clock3 className="h-3.5 w-3.5" />{interview.time}</span></div><div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-2"><span className="flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5 text-slate-400" />{interview.interviewer}</span><span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-400" />{interview.location}</span></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3"><span className={`inline-flex items-center gap-1.5 text-xs font-medium ${upcoming ? 'text-blue-600' : 'text-emerald-600'}`}>{upcoming ? <Video className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}{upcoming ? 'Preparar entrevista' : 'Entrevista completada'}</span>{upcoming ? <button type="button" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">Ver detalles <ExternalLink className="h-3.5 w-3.5" /></button> : <span className="text-xs text-slate-400">Proceso finalizado</span>}</div></div></div></article>;

const ChecklistItem = ({ text, done = false }: { text: string; done?: boolean }) => <div className="flex items-center gap-2.5 text-sm text-slate-600"><span className={`flex h-5 w-5 items-center justify-center rounded-full ${done ? 'bg-emerald-100 text-emerald-600' : 'border border-slate-300 text-transparent'}`}><CheckCircle2 className="h-3.5 w-3.5" /></span><span>{text}</span></div>;
