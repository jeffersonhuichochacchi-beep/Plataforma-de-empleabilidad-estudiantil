import { useMemo, useState } from 'react';
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  MapPin,
  Search,
  XCircle,
} from 'lucide-react';

type ApplicationStatus = 'En revisión' | 'Entrevista' | 'Seleccionado' | 'No seleccionado';

interface Application {
  id: number;
  role: string;
  company: string;
  location: string;
  modality: string;
  date: string;
  status: ApplicationStatus;
  color: string;
  initials: string;
  description: string;
}

const applications: Application[] = [
  {
    id: 1,
    role: 'Frontend Developer',
    company: 'Digital Labs',
    location: 'Bogotá, Colombia',
    modality: 'Remoto',
    date: '12 de mayo de 2026',
    status: 'Entrevista',
    color: 'bg-blue-100 text-blue-700',
    initials: 'DL',
    description: 'Construye experiencias web modernas con React y TypeScript.',
  },
  {
    id: 2,
    role: 'Desarrollador React Junior',
    company: 'Nexa Solutions',
    location: 'Medellín, Colombia',
    modality: 'Híbrido',
    date: '08 de mayo de 2026',
    status: 'En revisión',
    color: 'bg-indigo-100 text-indigo-700',
    initials: 'NS',
    description: 'Únete a un equipo que crea productos digitales para toda Latinoamérica.',
  },
  {
    id: 3,
    role: 'Ingeniero de Frontend',
    company: 'Innova Tech',
    location: 'Bogotá, Colombia',
    modality: 'Tiempo completo',
    date: '27 de abril de 2026',
    status: 'Seleccionado',
    color: 'bg-emerald-100 text-emerald-700',
    initials: 'IT',
    description: 'Participa en la evolución de plataformas SaaS de alto impacto.',
  },
  {
    id: 4,
    role: 'Web Developer',
    company: 'Studio Creativo',
    location: 'Cali, Colombia',
    modality: 'Presencial',
    date: '15 de abril de 2026',
    status: 'No seleccionado',
    color: 'bg-orange-100 text-orange-700',
    initials: 'SC',
    description: 'Desarrolla sitios web y experiencias de marca para clientes destacados.',
  },
];

const statusStyles: Record<ApplicationStatus, string> = {
  'En revisión': 'bg-amber-50 text-amber-700 border-amber-200',
  Entrevista: 'bg-blue-50 text-blue-700 border-blue-200',
  Seleccionado: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'No seleccionado': 'bg-slate-100 text-slate-600 border-slate-200',
};

const statusIcons: Record<ApplicationStatus, typeof Clock3> = {
  'En revisión': Clock3,
  Entrevista: CalendarDays,
  Seleccionado: CheckCircle2,
  'No seleccionado': XCircle,
};

export const CandidateApplicationsView = () => {
  const [activeFilter, setActiveFilter] = useState<'Todas' | ApplicationStatus>('Todas');
  const [search, setSearch] = useState('');

  const filteredApplications = useMemo(() => applications.filter((application) => {
    const matchesStatus = activeFilter === 'Todas' || application.status === activeFilter;
    const matchesSearch = `${application.role} ${application.company}`.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  }), [activeFilter, search]);

  const counters = [
    { label: 'Total enviadas', value: applications.length, icon: FileText, tone: 'text-blue-600 bg-blue-50' },
    { label: 'En revisión', value: applications.filter((item) => item.status === 'En revisión').length, icon: Clock3, tone: 'text-amber-600 bg-amber-50' },
    { label: 'Entrevistas', value: applications.filter((item) => item.status === 'Entrevista').length, icon: CalendarDays, tone: 'text-indigo-600 bg-indigo-50' },
    { label: 'Seleccionadas', value: applications.filter((item) => item.status === 'Seleccionado').length, icon: CheckCircle2, tone: 'text-emerald-600 bg-emerald-50' },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-sm font-semibold text-blue-600">Mi actividad</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mis postulaciones</h1>
          <p className="mt-2 text-slate-500">Haz seguimiento a las oportunidades que te interesan.</p>
        </div>
        <a href="/candidato/buscar" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"><Search className="h-4 w-4" /> Buscar empleos</a>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {counters.map(({ label, value, icon: Icon, tone }) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></div><p className="text-2xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs font-medium text-slate-500">{label}</p></div>)}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div><h2 className="text-lg font-bold text-slate-900">Seguimiento de procesos</h2><p className="mt-1 text-sm text-slate-500">Revisa el estado de cada oportunidad laboral.</p></div>
            <div className="relative w-full lg:w-72"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar postulación..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></div>
          </div>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">{(['Todas', 'En revisión', 'Entrevista', 'Seleccionado', 'No seleccionado'] as const).map((filter) => <button key={filter} type="button" onClick={() => setActiveFilter(filter)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{filter}</button>)}</div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredApplications.length > 0 ? filteredApplications.map((application) => <ApplicationCard key={application.id} application={application} />) : <div className="px-6 py-16 text-center"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100"><FileText className="h-7 w-7 text-slate-400" /></div><h3 className="font-bold text-slate-800">No encontramos postulaciones</h3><p className="mt-1 text-sm text-slate-500">Prueba con otro filtro o término de búsqueda.</p></div>}
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5"><div className="rounded-xl bg-white p-2 text-blue-600 shadow-sm"><BriefcaseBusiness className="h-5 w-5" /></div><div><h3 className="text-sm font-bold text-blue-950">Consejo para destacar</h3><p className="mt-1 text-sm leading-6 text-slate-600">Mantén actualizado tu perfil y agrega un currículum para aumentar tus posibilidades de ser contactado.</p></div></div>
    </div>
  );
};

const ApplicationCard = ({ application }: { application: Application }) => {
  const StatusIcon = statusIcons[application.status];
  return <article className="p-5 transition-colors hover:bg-slate-50/70 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-start"><div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${application.color}`}>{application.initials}</div><div className="min-w-0 flex-1"><div className="flex flex-col justify-between gap-2 sm:flex-row"><div><h3 className="text-base font-bold text-slate-900">{application.role}</h3><div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500"><span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{application.company}</span><span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{application.location}</span></div></div><span className={`inline-flex h-fit items-center gap-1.5 self-start rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[application.status]}`}><StatusIcon className="h-3.5 w-3.5" />{application.status}</span></div><p className="mt-3 text-sm text-slate-600">{application.description}</p><div className="mt-4 flex flex-col justify-between gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center"><div className="flex flex-wrap gap-3 text-xs text-slate-500"><span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />Postulada el {application.date}</span><span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-600">{application.modality}</span></div><button type="button" className="inline-flex items-center gap-1 text-left text-xs font-semibold text-blue-600 hover:text-blue-700">Ver detalles <ChevronRight className="h-4 w-4" /></button></div></div></div></article>;
};
