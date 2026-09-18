import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { BriefcaseBusiness, CheckCircle2, Download, Edit3, ExternalLink, FileText, GraduationCap, Loader2, Mail, MapPin, Phone, Plus, Save, Trash2, UserRound, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { api } from '@/core/api';
import { profileService } from '../services/profile.service';
import type { ExperienciaPerfil, PerfilResponseDTO } from '../types';

type Tab = 'resumen' | 'experiencia' | 'educacion' | 'habilidades';
const emptyExperience = { empresa: '', cargo: '', descripcion: '', fechaInicio: '', fechaFin: '', actual: false, ubicacion: '', modalidad: '' };
const emptyEducation = { institucion: '', carrera: '', grado: '', fechaInicio: '', fechaFin: '', actual: false, descripcion: '' };

export const CandidateProfileView = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<PerfilResponseDTO | null>(null);
  const [tab, setTab] = useState<Tab>('resumen');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [viewingCv, setViewingCv] = useState(false);
  const [cvViewerUrl, setCvViewerUrl] = useState<string | null>(null);
  const [personal, setPersonal] = useState({ nombres: '', apellidos: '', telefono: '', tituloProfesional: '', ubicacion: '', biografia: '', enlacePortafolio: '' });
  const [experience, setExperience] = useState(emptyExperience);
  const [education, setEducation] = useState(emptyEducation);
  const [skill, setSkill] = useState({ nombre: '', nivel: 'INTERMEDIO', anosExperiencia: 0 });

  const load = async () => {
    setLoading(true);
    try {
      const result = await profileService.getMiPerfil();
      const parts = (result.nombreParaMostrar && result.nombreParaMostrar !== result.email) ? result.nombreParaMostrar.trim().split(/\s+/) : [];
      const nombres = result.nombres?.trim() || parts.shift() || user?.nombres || '';
      const apellidos = result.apellidos?.trim() || parts.join(' ') || user?.apellidos || '';
      const normalized = { ...result, email: result.email || user?.email || '', nombres, apellidos };
      setProfile(normalized);
      setPersonal({ nombres, apellidos, telefono: result.telefono || user?.telefono || '', tituloProfesional: result.tituloProfesional || '', ubicacion: result.ubicacion || '', biografia: result.biografia || '', enlacePortafolio: result.enlacePortafolio || '' });
    } catch { toast.error('No se pudo cargar tu perfil.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  useEffect(() => {
    let objectUrl: string | null = null;
    if (viewingCv && profile?.enlacePortafolio) {
      void api.get('/perfil/cv-portafolio/archivo', { responseType: 'blob' }).then(response => {
        const blob = response.data as Blob;
        objectUrl = URL.createObjectURL(blob);
        setCvViewerUrl(objectUrl);
      }).catch(() => setCvViewerUrl(null));
    } else {
      setCvViewerUrl(null);
    }
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [viewingCv, profile?.enlacePortafolio]);

  const savePersonal = async () => {
    setSaving(true);
    try {
      const { enlacePortafolio: _unused, ...personalData } = personal;
      let updated = await profileService.updateProfile(personalData);
      if (cvFile) { updated = await profileService.uploadProfileCv(cvFile); setCvFile(null); }
      setProfile(updated); setEditing(false); toast.success('Perfil actualizado correctamente.');
    } catch (error: any) { toast.error(error.response?.data?.message || 'No se pudo actualizar el perfil.'); }
    finally { setSaving(false); }
  };

  const addExperience = async (event: FormEvent) => { event.preventDefault(); if (!experience.empresa || !experience.cargo) return toast.error('Empresa y cargo son obligatorios.'); try { await profileService.addExperience(experience); setExperience(emptyExperience); await load(); toast.success('Experiencia agregada.'); } catch { toast.error('No se pudo agregar la experiencia.'); } };
  const addEducation = async (event: FormEvent) => { event.preventDefault(); if (!education.institucion || !education.carrera) return toast.error('Institución y carrera son obligatorias.'); try { await profileService.addEducation(education); setEducation(emptyEducation); await load(); toast.success('Educación agregada.'); } catch { toast.error('No se pudo agregar la educación.'); } };
  const addSkill = async (event: FormEvent) => { event.preventDefault(); if (!skill.nombre) return; try { await profileService.addSkill(skill); setSkill({ nombre: '', nivel: 'INTERMEDIO', anosExperiencia: 0 }); await load(); toast.success('Habilidad agregada.'); } catch { toast.error('No se pudo agregar la habilidad.'); } };
  const remove = async (type: 'experience' | 'education' | 'skill', id: string) => { try { if (type === 'experience') await profileService.deleteExperience(id); if (type === 'education') await profileService.deleteEducation(id); if (type === 'skill') await profileService.deleteSkill(id); await load(); toast.success('Elemento eliminado.'); } catch { toast.error('No se pudo eliminar.'); } };

  if (loading) return <div className="flex h-64 items-center justify-center text-slate-500"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Cargando perfil...</div>;
  if (!profile) return <div className="rounded-xl bg-white p-8 text-center">No se pudo cargar el perfil.</div>;
  const name = `${profile.nombres || user?.email || ''} ${profile.apellidos || ''}`.trim();
  const tabs: { id: Tab; label: string }[] = [{ id: 'resumen', label: 'Resumen' }, { id: 'experiencia', label: 'Experiencia' }, { id: 'educacion', label: 'Educación' }, { id: 'habilidades', label: 'Habilidades' }];

  return <div className="mx-auto max-w-6xl space-y-6">
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="h-32 bg-gradient-to-r from-blue-700 via-indigo-600 to-slate-900" /><div className="px-5 pb-6 sm:px-8"><div className="-mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div className="flex items-end gap-4"><div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-blue-100 text-2xl font-bold text-blue-700 shadow-lg">{(profile.nombres || name || 'C').slice(0, 2).toUpperCase()}</div><div className="pb-0"><div className="flex items-center gap-2"><h1 className="text-2xl font-bold text-slate-900">{name}</h1><CheckCircle2 className="h-5 w-5 text-emerald-600" /></div><p className="text-sm font-medium text-slate-500">{profile.tituloProfesional || 'Completa tu información profesional'}</p></div></div>{editing ? <div className="flex gap-2"><button onClick={() => setEditing(false)} className="rounded-xl border px-4 py-2 text-sm">Cancelar</button><button onClick={savePersonal} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"><Save className="h-4 w-4" />Guardar</button></div> : <button onClick={() => setEditing(true)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"><Edit3 className="h-4 w-4" />Editar perfil</button>}</div><div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 text-sm text-slate-600 sm:grid-cols-3"><span><MapPin className="mr-2 inline h-4 w-4 text-blue-600" />{profile.ubicacion || 'Ubicación no registrada'}</span><span><Mail className="mr-2 inline h-4 w-4 text-blue-600" />{profile.email}</span><span><Phone className="mr-2 inline h-4 w-4 text-blue-600" />{profile.telefono || 'Teléfono no registrado'}</span></div></div></section>
    {editing && <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-8"><div className="grid gap-4 sm:grid-cols-2">{([['nombres', 'Nombres'], ['apellidos', 'Apellidos'], ['telefono', 'Teléfono'], ['tituloProfesional', 'Título profesional'], ['ubicacion', 'Ubicación']] as const).map(([key, label]) => <label key={key} className="text-sm font-semibold text-slate-700">{label}<input value={personal[key]} onChange={e => setPersonal({ ...personal, [key]: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-normal" /></label>)}<label className="text-sm font-semibold text-slate-700 sm:col-span-2">CV (PDF)<input type="file" accept="application/pdf,.pdf" onChange={e => setCvFile(e.target.files?.[0] || null)} className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 font-normal" /><span className="mt-1 block text-xs font-normal text-slate-500">{cvFile?.name || profile.cvNombre || (profile.enlacePortafolio ? 'CV cargado en Cloudinary' : 'Selecciona un archivo PDF de hasta 5 MB')}</span></label><label className="text-sm font-semibold text-slate-700 sm:col-span-2">Sobre mí<textarea value={personal.biografia} onChange={e => setPersonal({ ...personal, biografia: e.target.value })} rows={4} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-normal" /></label></div></section>}
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]"><main className="rounded-2xl border border-slate-200 bg-white shadow-sm"><nav className="flex gap-6 overflow-x-auto border-b px-5 sm:px-8">{tabs.map(item => <button key={item.id} onClick={() => setTab(item.id)} className={`border-b-2 px-1 py-4 text-sm font-semibold ${tab === item.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500'}`}>{item.label}</button>)}</nav><div className="p-5 sm:p-8">
      {tab === 'resumen' && <div className="space-y-6"><section><h2 className="mb-2 text-lg font-bold">Sobre mí</h2><p className="leading-7 text-slate-600">{profile.biografia || 'Aún no has agregado una descripción profesional.'}</p></section><ListExperience items={(profile.experiencias || []).slice(0, 3)} /><div><h2 className="mb-3 text-lg font-bold">Habilidades destacadas</h2><div className="flex flex-wrap gap-2">{(profile.habilidades || []).map(h => <span key={h.id} className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">{h.nombre}</span>)}</div></div></div>}
      {tab === 'experiencia' && <div className="space-y-5"><h2 className="text-lg font-bold"><BriefcaseBusiness className="mr-2 inline text-blue-600" />Experiencia laboral</h2><form onSubmit={addExperience} className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2"><input placeholder="Empresa *" value={experience.empresa} onChange={e => setExperience({ ...experience, empresa: e.target.value })} className="rounded-lg border px-3 py-2" /><input placeholder="Cargo *" value={experience.cargo} onChange={e => setExperience({ ...experience, cargo: e.target.value })} className="rounded-lg border px-3 py-2" /><input type="date" value={experience.fechaInicio} onChange={e => setExperience({ ...experience, fechaInicio: e.target.value })} className="rounded-lg border px-3 py-2" /><input type="date" value={experience.fechaFin} onChange={e => setExperience({ ...experience, fechaFin: e.target.value })} className="rounded-lg border px-3 py-2" /><textarea placeholder="Descripción" value={experience.descripcion} onChange={e => setExperience({ ...experience, descripcion: e.target.value })} className="rounded-lg border px-3 py-2 sm:col-span-2" /><button className="inline-flex w-fit items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Agregar</button></form><ListExperience items={profile.experiencias || []} onRemove={id => remove('experience', id)} /></div>}
      {tab === 'educacion' && <div className="space-y-5"><h2 className="text-lg font-bold"><GraduationCap className="mr-2 inline text-blue-600" />Educación</h2><form onSubmit={addEducation} className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2"><input placeholder="Institución *" value={education.institucion} onChange={e => setEducation({ ...education, institucion: e.target.value })} className="rounded-lg border px-3 py-2" /><input placeholder="Carrera *" value={education.carrera} onChange={e => setEducation({ ...education, carrera: e.target.value })} className="rounded-lg border px-3 py-2" /><input placeholder="Grado" value={education.grado} onChange={e => setEducation({ ...education, grado: e.target.value })} className="rounded-lg border px-3 py-2" /><input type="date" value={education.fechaInicio} onChange={e => setEducation({ ...education, fechaInicio: e.target.value })} className="rounded-lg border px-3 py-2" /><button className="inline-flex w-fit items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Agregar</button></form><div className="space-y-3">{(profile.educacion || []).map(e => <div key={e.id} className="flex justify-between rounded-xl border p-4"><div><b>{e.carrera}</b><p className="text-sm text-slate-500">{e.institucion} {e.grado && `· ${e.grado}`}</p></div><button onClick={() => remove('education', e.id)} className="text-rose-500"><Trash2 className="h-4 w-4" /></button></div>)}</div></div>}
      {tab === 'habilidades' && <div className="space-y-5"><h2 className="text-lg font-bold"><UserRound className="mr-2 inline text-blue-600" />Habilidades</h2><form onSubmit={addSkill} className="flex flex-wrap gap-3 rounded-xl bg-slate-50 p-4"><input placeholder="Ej. React" value={skill.nombre} onChange={e => setSkill({ ...skill, nombre: e.target.value })} className="rounded-lg border px-3 py-2" /><select value={skill.nivel} onChange={e => setSkill({ ...skill, nivel: e.target.value })} className="rounded-lg border px-3 py-2"><option>INTERMEDIO</option><option>BASICO</option><option>AVANZADO</option><option>EXPERTO</option></select><button className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Agregar</button></form><div className="grid gap-3 sm:grid-cols-2">{(profile.habilidades || []).map(h => <div key={h.id} className="flex items-center justify-between rounded-xl border p-4"><div><b>{h.nombre}</b><p className="text-xs text-slate-500">{h.nivel || 'INTERMEDIO'}</p></div><button onClick={() => remove('skill', h.id)} className="text-rose-500"><Trash2 className="h-4 w-4" /></button></div>)}</div></div>}
    </div></main><aside className="space-y-6"><div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="mb-3 flex justify-between font-bold">Completitud <span className="text-blue-600">{profile.porcentajeCompletitud}%</span></div><div className="h-2 rounded bg-slate-100"><div className="h-2 rounded bg-blue-600" style={{ width: `${profile.porcentajeCompletitud}%` }} /></div><p className="mt-3 text-xs text-slate-500">{profile.motivosPendientes?.join(' · ') || 'Tu perfil está completo.'}</p></div><div className="rounded-2xl bg-slate-900 p-5 text-white"><h2 className="font-bold">Tu currículum</h2><p className="my-3 text-xs text-slate-300">{profile.cvNombre || (profile.enlacePortafolio ? 'CV cargado en Cloudinary' : 'Aún no has subido un CV.')}</p><p className="text-xs text-slate-400">Puedes subirlo desde la sección de perfil.</p>{profile.enlacePortafolio && <button onClick={() => setViewingCv(true)} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">Ver CV</button>}</div></aside></div>
    {viewingCv && profile.enlacePortafolio && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"><div className="flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl"><div className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 px-6 py-3.5"><div className="flex items-center gap-3"><div className="rounded-xl bg-blue-100 p-2 text-blue-700"><FileText className="h-5 w-5" /></div><div><h3 className="flex items-center gap-2 text-base font-bold text-slate-900">Mi currículum <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] text-blue-700">PDF</span></h3><p className="text-xs text-slate-500">CV guardado en Cloudinary</p></div></div><div className="flex items-center gap-2"><a href={cvViewerUrl || '#'} download="CV.pdf" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"><Download className="h-3.5 w-3.5" />Descargar PDF</a><a href={cvViewerUrl || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200/60 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"><ExternalLink className="h-3.5 w-3.5" />Pestaña Nueva</a><button onClick={() => setViewingCv(false)} className="ml-1 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600" title="Cerrar visor"><X className="h-5 w-5" /></button></div></div><div className="flex-1 overflow-hidden bg-slate-100 p-2">{cvViewerUrl ? <iframe src={cvViewerUrl} className="h-full w-full rounded-xl border border-slate-200/80 bg-white shadow-inner" title="Mi currículum" /> : <div className="flex h-full items-center justify-center text-slate-500">Cargando CV...</div>}</div></div></div>}
  </div>;
};

const ListExperience = ({ items, onRemove }: { items: ExperienciaPerfil[]; onRemove?: (id: string) => void }) => <section><h2 className="mb-3 text-lg font-bold">Experiencia reciente</h2>{items.length === 0 ? <p className="text-sm text-slate-500">Aún no has agregado experiencia.</p> : <div className="space-y-4">{items.map(e => <article key={e.id} className="border-l-2 border-blue-500 pl-4"><div className="flex justify-between"><div><b>{e.cargo}</b><p className="text-sm text-blue-600">{e.empresa}</p></div>{onRemove && <button onClick={() => onRemove(e.id)} className="text-rose-500"><Trash2 className="h-4 w-4" /></button>}</div><p className="mt-1 text-sm text-slate-600">{e.descripcion}</p></article>)}</div>}</section>;

