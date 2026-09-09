import { useRef, useState } from 'react';
import {
  BookOpen,
  BriefcaseBusiness,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  Edit3,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

type Tab = 'resumen' | 'experiencia' | 'educacion' | 'habilidades';

const skills = ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Node.js', 'Git'];
export const CandidateProfileView = () => {
  const [activeTab, setActiveTab] = useState<Tab>('resumen');
  const [isEditing, setIsEditing] = useState(false);
  const [photo, setPhoto] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Cambios guardados en esta vista de demostración');
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'experiencia', label: 'Experiencia' },
    { id: 'educacion', label: 'Educación' },
    { id: 'habilidades', label: 'Habilidades' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-32 bg-gradient-to-r from-blue-700 via-indigo-600 to-slate-900 relative">
          <div className="absolute -right-8 -top-20 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl" />
        </div>

        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative h-28 w-28 shrink-0 rounded-2xl border-4 border-white bg-blue-100 shadow-lg overflow-hidden">
                {photo ? (
                  <img src={photo} alt="Foto de perfil" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 text-3xl font-bold text-blue-700">CM</div>
                )}
                <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="absolute bottom-1 right-1 rounded-lg bg-slate-900/80 p-1.5 text-white hover:bg-blue-600 transition-colors"
                  title="Cambiar foto"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900">Carlos Mendoza</h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Perfil verificado
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-500">Frontend Developer · Disponible para trabajar</p>
              </div>
            </div>

            <div className="flex gap-2 sm:pb-1">
              {isEditing ? (
                <>
                  <button type="button" onClick={() => setIsEditing(false)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                    <X className="h-4 w-4" /> Cancelar
                  </button>
                  <button type="button" onClick={handleSave} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
                    <Save className="h-4 w-4" /> Guardar
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => setIsEditing(true)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
                  <Edit3 className="h-4 w-4" /> Editar perfil
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm text-slate-600"><MapPin className="h-4 w-4 text-blue-600" /> Bogotá, Colombia</div>
            <div className="flex items-center gap-2 text-sm text-slate-600"><Mail className="h-4 w-4 text-blue-600" /> carlos.mendoza@email.com</div>
            <div className="flex items-center gap-2 text-sm text-slate-600"><Phone className="h-4 w-4 text-blue-600" /> +57 300 456 7890</div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <main className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto border-b border-slate-200 px-5 sm:px-8">
            <nav className="flex min-w-max gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`border-b-2 px-1 py-4 text-sm font-semibold transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-5 sm:p-8">
            {activeTab === 'resumen' && (
              <div className="space-y-8">
                <section>
                  <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold text-slate-900">Sobre mí</h2><Edit3 className="h-4 w-4 text-slate-400" /></div>
                  <p className="text-sm leading-7 text-slate-600">Desarrollador frontend apasionado por crear experiencias digitales simples, accesibles y de alto impacto. Tengo experiencia construyendo productos web escalables y trabajando con equipos ágiles para convertir ideas en soluciones reales.</p>
                </section>
                <section>
                  <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold text-slate-900">Experiencia reciente</h2><button type="button" onClick={() => setActiveTab('experiencia')} className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">Ver todo <ChevronRight className="h-4 w-4" /></button></div>
                  <ExperienceItem current title="Frontend Developer" company="Digital Labs" date="Ene 2023 — Actualmente" description="Desarrollo de interfaces web con React y TypeScript, mejorando la experiencia de más de 20.000 usuarios." />
                  <ExperienceItem title="Desarrollador Web" company="Studio Creativo" date="Mar 2021 — Dic 2022" description="Implementación de sitios web responsivos y componentes reutilizables para clientes de diferentes industrias." />
                </section>
                <section>
                  <h2 className="mb-4 text-lg font-bold text-slate-900">Habilidades destacadas</h2>
                  <div className="flex flex-wrap gap-2">{skills.map((skill) => <span key={skill} className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">{skill}</span>)}</div>
                </section>
              </div>
            )}

            {activeTab === 'experiencia' && <div className="space-y-5"><SectionHeading icon={<BriefcaseBusiness className="h-5 w-5" />} title="Trayectoria profesional" action="Agregar experiencia" /><ExperienceItem current title="Frontend Developer" company="Digital Labs" date="Ene 2023 — Actualmente" description="Desarrollo de interfaces web con React y TypeScript, mejorando la experiencia de más de 20.000 usuarios." /><ExperienceItem title="Desarrollador Web" company="Studio Creativo" date="Mar 2021 — Dic 2022" description="Implementación de sitios web responsivos y componentes reutilizables para clientes de diferentes industrias." /><ExperienceItem title="Practicante de Desarrollo" company="Nexa Solutions" date="Ago 2020 — Feb 2021" description="Apoyo en el desarrollo y mantenimiento de aplicaciones internas." /></div>}
            {activeTab === 'educacion' && <div className="space-y-5"><SectionHeading icon={<GraduationCap className="h-5 w-5" />} title="Educación y certificaciones" action="Agregar estudio" /><EducationItem title="Ingeniería de Sistemas" place="Universidad Nacional de Colombia" date="2016 — 2021" /><EducationItem title="Professional Web Developer" place="Platzi · Certificación profesional" date="2022" /><EducationItem title="English B2 · Upper Intermediate" place="British Council" date="2023" /></div>}
            {activeTab === 'habilidades' && <div className="space-y-8"><SectionHeading icon={<Sparkles className="h-5 w-5" />} title="Habilidades profesionales" action="Agregar habilidad" /><div className="grid gap-3 sm:grid-cols-2">{skills.map((skill, index) => <div key={skill} className="rounded-xl border border-slate-200 p-4"><div className="mb-3 flex items-center justify-between"><span className="font-semibold text-slate-800">{skill}</span><span className="text-xs font-medium text-slate-500">{index < 2 ? 'Avanzado' : 'Intermedio'}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${index < 2 ? 'w-[88%] bg-blue-600' : 'w-[70%] bg-indigo-500'}`} /></div></div>)}</div></div>}
          </div>
        </main>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between"><h2 className="font-bold text-slate-900">Completitud del perfil</h2><span className="text-lg font-bold text-blue-600">85%</span></div>
            <div className="mb-3 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[85%] rounded-full bg-gradient-to-r from-blue-600 to-emerald-500" /></div>
            <p className="text-xs leading-5 text-slate-500">Completa tu perfil para aumentar tus posibilidades de ser contactado.</p>
            <div className="mt-4 space-y-2 text-xs"><div className="flex items-center gap-2 text-emerald-700"><Check className="h-4 w-4" /> Información personal</div><div className="flex items-center gap-2 text-emerald-700"><Check className="h-4 w-4" /> Experiencia laboral</div><div className="flex items-center gap-2 text-amber-700"><Plus className="h-4 w-4" /> Agrega tu portafolio</div></div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-bold text-slate-900">Información adicional</h2>
            <div className="space-y-4"><InfoRow icon={<BriefcaseBusiness />} label="Modalidad" value="Remoto / Híbrido" /><InfoRow icon={<UserRound />} label="Tipo de empleo" value="Tiempo completo" /><InfoRow icon={<Languages />} label="Idiomas" value="Español, Inglés" /></div>
          </section>
          <section className="rounded-2xl bg-slate-900 p-5 text-white shadow-sm"><div className="mb-3 flex items-center gap-2"><Download className="h-5 w-5 text-blue-400" /><h2 className="font-bold">Tu currículum</h2></div><p className="mb-4 text-xs leading-5 text-slate-300">Mantén tu CV actualizado para destacar en tus postulaciones.</p><button type="button" onClick={() => toast('Descarga disponible próximamente')} className="w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-blue-50">Ver currículum</button></section>
        </aside>
      </div>
    </div>
  );
};

const SectionHeading = ({ icon, title, action }: { icon: React.ReactNode; title: string; action: string }) => <div className="flex items-center justify-between border-b border-slate-100 pb-4"><div className="flex items-center gap-2 text-blue-600"><span>{icon}</span><h2 className="text-lg font-bold text-slate-900">{title}</h2></div><button type="button" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"><Plus className="h-4 w-4" /> {action}</button></div>;

const ExperienceItem = ({ current, title, company, date, description }: { current?: boolean; title: string; company: string; date: string; description: string }) => <article className="relative border-l-2 border-slate-200 pb-6 pl-6 last:pb-0"><span className={`absolute -left-[7px] top-0 h-3 w-3 rounded-full border-2 border-white ${current ? 'bg-blue-600' : 'bg-slate-300'}`} /><div className="flex flex-col justify-between gap-1 sm:flex-row"><div><h3 className="font-bold text-slate-800">{title}</h3><p className="text-sm font-medium text-blue-600">{company}</p></div><span className="text-xs text-slate-500">{date}</span></div><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></article>;

const EducationItem = ({ title, place, date }: { title: string; place: string; date: string }) => <article className="flex gap-4 rounded-xl border border-slate-200 p-4"><div className="rounded-xl bg-blue-50 p-3 text-blue-600"><BookOpen className="h-5 w-5" /></div><div className="flex-1"><div className="flex flex-col justify-between gap-1 sm:flex-row"><h3 className="font-bold text-slate-800">{title}</h3><span className="text-xs text-slate-500">{date}</span></div><p className="mt-1 text-sm text-slate-500">{place}</p></div></article>;

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => <div className="flex items-center gap-3"><span className="text-blue-600 [&>svg]:h-4 [&>svg]:w-4">{icon}</span><div><p className="text-xs text-slate-400">{label}</p><p className="text-sm font-medium text-slate-700">{value}</p></div></div>;
