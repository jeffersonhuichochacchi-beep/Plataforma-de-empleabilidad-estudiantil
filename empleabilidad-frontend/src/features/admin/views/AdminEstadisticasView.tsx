import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  Users,
  Briefcase,
  FileText,
  Building2,
  GraduationCap,
  Star,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  Zap,
} from 'lucide-react';
import { adminDashboardService } from '../services/admin-dashboard.service';

// ─── Tipos ─────────────────────────────────────────────────────────────────────
type Periodo = '7d' | '30d' | '90d' | '1y';

// ─── Datos Mock ────────────────────────────────────────────────────────────────
const DATA_BY_PERIOD: Record<Periodo, {
  nuevosUsuarios: number; usuariosDelta: number;
  ofertasActivas: number; ofertasDelta: number;
  postulaciones: number; postulacionesDelta: number;
  tasaConversion: number; conversionDelta: number;
  matchPromedio: number;
  empresasRegistradas: number;
  estudiantesActivos: number;
  entrevistasProgramadas: number;
}> = {
  '7d': {
    nuevosUsuarios: 42, usuariosDelta: 18.5,
    ofertasActivas: 87, ofertasDelta: 5.2,
    postulaciones: 245, postulacionesDelta: 31.4,
    tasaConversion: 28.5, conversionDelta: 2.1,
    matchPromedio: 83, empresasRegistradas: 18, estudiantesActivos: 134, entrevistasProgramadas: 12,
  },
  '30d': {
    nuevosUsuarios: 198, usuariosDelta: 24.0,
    ofertasActivas: 112, ofertasDelta: 12.8,
    postulaciones: 1024, postulacionesDelta: 45.7,
    tasaConversion: 31.2, conversionDelta: 4.5,
    matchPromedio: 81, empresasRegistradas: 34, estudiantesActivos: 389, entrevistasProgramadas: 57,
  },
  '90d': {
    nuevosUsuarios: 541, usuariosDelta: 38.2,
    ofertasActivas: 156, ofertasDelta: 22.1,
    postulaciones: 3218, postulacionesDelta: 62.3,
    tasaConversion: 29.8, conversionDelta: 6.7,
    matchPromedio: 79, empresasRegistradas: 62, estudiantesActivos: 871, entrevistasProgramadas: 143,
  },
  '1y': {
    nuevosUsuarios: 1847, usuariosDelta: 112.4,
    ofertasActivas: 284, ofertasDelta: 87.5,
    postulaciones: 11493, postulacionesDelta: 210.8,
    tasaConversion: 26.4, conversionDelta: 11.2,
    matchPromedio: 77, empresasRegistradas: 118, estudiantesActivos: 2341, entrevistasProgramadas: 498,
  },
};

// Datos de series temporales (barras mensuales)
const MONTHLY_SERIES = [
  { mes: 'Abr', usuarios: 89,  postulaciones: 412, ofertas: 31 },
  { mes: 'May', usuarios: 134, postulaciones: 589, ofertas: 48 },
  { mes: 'Jun', usuarios: 112, postulaciones: 478, ofertas: 42 },
  { mes: 'Jul', usuarios: 178, postulaciones: 734, ofertas: 67 },
  { mes: 'Ago', usuarios: 203, postulaciones: 891, ofertas: 78 },
  { mes: 'Sep', usuarios: 247, postulaciones: 1024, ofertas: 112 },
];

const ESTADOS_POSTULACION = [
  { label: 'Preseleccionados',    val: 31, color: '#6366f1', light: '#eef2ff' },
  { label: 'Con Entrevista',      val: 22, color: '#8b5cf6', light: '#f5f3ff' },
  { label: 'Aceptados',          val: 18, color: '#10b981', light: '#ecfdf5' },
  { label: 'Rechazados',         val: 15, color: '#f43f5e', light: '#fff1f2' },
  { label: 'Pendientes',         val: 14, color: '#f59e0b', light: '#fffbeb' },
];

const TOP_CARRERAS = [
  { carrera: 'Ing. de Sistemas e Informática', count: 412, pct: 94 },
  { carrera: 'Ing. de Software',               count: 378, pct: 86 },
  { carrera: 'Ciencia de Datos e IA',          count: 289, pct: 66 },
  { carrera: 'Diseño UX/UI & Multimedia',      count: 241, pct: 55 },
  { carrera: 'Ing. Industrial',                count: 198, pct: 45 },
];

const TOP_EMPRESAS = [
  { empresa: 'TechNova Solutions',  ofertas: 14, postulaciones: 312, matchAvg: 87 },
  { empresa: 'Banco Financiero',    ofertas: 9,  postulaciones: 228, matchAvg: 82 },
  { empresa: 'Talent Acquisition',  ofertas: 11, postulaciones: 189, matchAvg: 79 },
  { empresa: 'InnovatePe',          ofertas: 7,  postulaciones: 154, matchAvg: 85 },
  { empresa: 'DataCorp Perú',       ofertas: 5,  postulaciones: 98,  matchAvg: 91 },
];

const UNIVERSIDADES = [
  { uni: 'UNMSM',  pct: 28, color: '#6366f1' },
  { uni: 'UPC',    pct: 22, color: '#8b5cf6' },
  { uni: 'PUCP',   pct: 18, color: '#06b6d4' },
  { uni: 'UNI',    pct: 14, color: '#10b981' },
  { uni: 'USIL',   pct: 10, color: '#f59e0b' },
  { uni: 'Otros',  pct: 8,  color: '#94a3b8' },
];

const MODALIDADES = [
  { label: 'Remoto',     val: 42, color: '#6366f1' },
  { label: 'Híbrido',    val: 35, color: '#8b5cf6' },
  { label: 'Presencial', val: 23, color: '#cbd5e1' },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();


// ─── Componente: Donut Chart SVG ──────────────────────────────────────────────
const DonutChart: React.FC<{ data: { label: string; val: number; color: string; light: string }[] }> = ({ data }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = data.reduce((a, d) => a + d.val, 0);
  const R = 52, CX = 64, CY = 64, stroke = 20;
  let cumulative = 0;

  const slices = data.map((d, i) => {
    const pct = d.val / total;
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += pct;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const x1 = CX + R * Math.cos(startAngle);
    const y1 = CY + R * Math.sin(startAngle);
    const x2 = CX + R * Math.cos(endAngle);
    const y2 = CY + R * Math.sin(endAngle);
    const large = pct > 0.5 ? 1 : 0;
    return { ...d, x1, y1, x2, y2, large, startAngle, endAngle, pct, i };
  });

  const hov = hovered !== null ? data[hovered] : null;

  return (
    <svg viewBox="0 0 128 128" className="w-32 h-32">
      {slices.map((s) => (
        <path
          key={s.i}
          d={`M ${CX} ${CY} L ${s.x1} ${s.y1} A ${R} ${R} 0 ${s.large} 1 ${s.x2} ${s.y2} Z`}
          fill={hovered === s.i ? s.color : s.color + 'dd'}
          stroke="white" strokeWidth="2"
          onMouseEnter={() => setHovered(s.i)}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer', transition: 'fill 0.15s', transform: hovered === s.i ? `scale(1.04)` : 'scale(1)', transformOrigin: `${CX}px ${CY}px` }}
        />
      ))}
      {/* Hole */}
      <circle cx={CX} cy={CY} r={R - stroke} fill="white" />
      {/* Centro texto */}
      <text x={CX} y={CY - 6} textAnchor="middle" fontSize={10} fontWeight="700" fill={hov ? hov.color : '#1e293b'}>
        {hov ? `${hov.val}%` : `${total}%`}
      </text>
      <text x={CX} y={CY + 8} textAnchor="middle" fontSize={6} fill="#94a3b8">
        {hov ? hov.label.split(' ')[0] : 'Total'}
      </text>
    </svg>
  );
};

// ─── Componente: Mini Sparkline SVG ───────────────────────────────────────────
const Sparkline: React.FC<{ data: number[]; color: string; up?: boolean }> = ({ data, color, up = true }) => {
  const min = Math.min(...data), max = Math.max(...data);
  const H = 36, W = 80;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / (max - min || 1)) * H;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-20 h-9">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {up !== undefined && (
        <circle cx={data.length > 1 ? W : W / 2} cy={H - ((data[data.length - 1] - min) / (max - min || 1)) * H} r="3" fill={color} />
      )}
    </svg>
  );
};

// ─── Componente: KPI Card ─────────────────────────────────────────────────────
const KpiCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  delta?: number;
  sparkData?: number[];
  sparkColor?: string;
  accent?: string;
  suffix?: string;
}> = ({ icon, label, value, delta, sparkData, sparkColor = '#6366f1', accent = 'indigo', suffix }) => {
  const isUp = (delta ?? 0) >= 0;
  const accentMap: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600',
    violet: 'bg-violet-50 text-violet-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    cyan: 'bg-cyan-50 text-cyan-600',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 hover:border-slate-300 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accentMap[accent] ?? accentMap.indigo}`}>
          {icon}
        </div>
        {sparkData && (
          <Sparkline data={sparkData} color={sparkColor} up={isUp} />
        )}
      </div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-extrabold text-slate-900">{value}</span>
        {suffix && <span className="text-sm text-slate-500 mb-0.5">{suffix}</span>}
      </div>
      {delta !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${isUp ? 'text-emerald-600' : 'text-rose-500'}`}>
          {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          <span>{Math.abs(delta)}%</span>
          <span className="text-slate-400 font-normal">vs período anterior</span>
        </div>
      )}
    </div>
  );
};

// ─── Vista Principal ───────────────────────────────────────────────────────────
export const AdminEstadisticasView: React.FC = () => {
  const [periodo, setPeriodo] = useState<Periodo>('30d');
  const [activeMetric, setActiveMetric] = useState<'usuarios' | 'postulaciones' | 'ofertas'>('postulaciones');
  const [live, setLive] = useState<Awaited<ReturnType<typeof adminDashboardService.getResumen>> | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { let mounted = true; const load = async () => { try { const data = await adminDashboardService.getResumen(); if (mounted) setLive(data); } catch { /* Mantiene la vista disponible si un servicio está temporalmente fuera de línea. */ } finally { if (mounted) setLoading(false); } }; void load(); const timer = window.setInterval(load, 30000); return () => { mounted = false; window.clearInterval(timer); }; }, []);
  const d = live ? { nuevosUsuarios: live.usuarios.totalUsuarios, usuariosDelta: 0, ofertasActivas: live.ofertas.ofertasPublicadas, ofertasDelta: 0, postulaciones: live.postulaciones.totalPostulaciones, postulacionesDelta: 0, tasaConversion: live.postulaciones.totalPostulaciones ? Math.round((live.postulaciones.seleccionadas / live.postulaciones.totalPostulaciones) * 1000) / 10 : 0, conversionDelta: 0, matchPromedio: 0, empresasRegistradas: live.usuarios.empresas, estudiantesActivos: live.usuarios.candidatos, entrevistasProgramadas: live.postulaciones.totalEntrevistas } : DATA_BY_PERIOD[periodo];
  const estadoData = useMemo(() => live ? [{ label: 'Preseleccionados', val: live.postulaciones.preseleccionadas, color: '#6366f1', light: '#eef2ff' }, { label: 'Con Entrevista', val: live.postulaciones.entrevistas, color: '#8b5cf6', light: '#f5f3ff' }, { label: 'Aceptados', val: live.postulaciones.seleccionadas, color: '#10b981', light: '#ecfdf5' }, { label: 'Rechazados', val: live.postulaciones.rechazadas, color: '#f43f5e', light: '#fff1f2' }, { label: 'Pendientes', val: live.postulaciones.enviadas + live.postulaciones.enRevision, color: '#f59e0b', light: '#fffbeb' }] : ESTADOS_POSTULACION, [live]);

  const periodoLabel: Record<Periodo, string> = {
    '7d': 'Últimos 7 días', '30d': 'Últimos 30 días',
    '90d': 'Últimos 90 días', '1y': 'Este año',
  };

  const sparkUsers       = [62, 71, 58, 89, 103, 134, 178, d.nuevosUsuarios];
  const sparkPost        = [312, 478, 398, 589, 734, 891, 967, d.postulaciones];
  const sparkOfertas     = [28, 35, 31, 48, 54, 67, 89, d.ofertasActivas];
  const sparkConversion  = [22, 25, 21, 27, 26, 29, 28, d.tasaConversion];

  const metricColors: Record<string, string> = {
    usuarios: '#6366f1',
    postulaciones: '#8b5cf6',
    ofertas: '#06b6d4',
  };
  const exportStats = () => {
    if (!live) return;
    const csv = `Métrica;Valor\r\nUsuarios;${live.usuarios.totalUsuarios}\r\nCandidatos;${live.usuarios.candidatos}\r\nEmpresas;${live.usuarios.empresas}\r\nOfertas publicadas;${live.ofertas.ofertasPublicadas}\r\nPostulaciones;${live.postulaciones.totalPostulaciones}\r\nEntrevistas;${live.postulaciones.totalEntrevistas}`;
    const url = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = 'estadisticas-plataforma.csv'; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); 
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen">

      {/* ── Encabezado ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-violet-500/25 text-white">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Estadísticas & Analytics
            </h1>
            <p className="text-sm text-slate-500">
              Visión completa del rendimiento de la plataforma · {periodoLabel[periodo]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Selector de período */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            {(['7d', '30d', '90d', '1y'] as Periodo[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  periodo === p
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {p === '1y' ? '1 Año' : p}
              </button>
            ))}
          </div>

          <button
            onClick={exportStats}
            disabled={loading || !live}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Exportar
          </button>
        </div>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={<Users className="w-5 h-5" />}
          label="Nuevos Usuarios"
          value={fmt(d.nuevosUsuarios)}
          delta={d.usuariosDelta}
          sparkData={sparkUsers}
          sparkColor="#6366f1"
          accent="indigo"
        />
        <KpiCard
          icon={<FileText className="w-5 h-5" />}
          label="Postulaciones"
          value={fmt(d.postulaciones)}
          delta={d.postulacionesDelta}
          sparkData={sparkPost}
          sparkColor="#8b5cf6"
          accent="violet"
        />
        <KpiCard
          icon={<Briefcase className="w-5 h-5" />}
          label="Ofertas Activas"
          value={d.ofertasActivas}
          delta={d.ofertasDelta}
          sparkData={sparkOfertas}
          sparkColor="#06b6d4"
          accent="cyan"
        />
        <KpiCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Tasa de Conversión"
          value={`${d.tasaConversion}%`}
          delta={d.conversionDelta}
          sparkData={sparkConversion}
          sparkColor="#10b981"
          accent="emerald"
        />
      </div>

      {/* ── Segunda Fila: Gráfico de Barras + Donut ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Gráfico de Barras principal */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Tendencia Mensual</h2>
              <p className="text-xs text-slate-500">Evolución en los últimos 6 meses</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-50 rounded-xl p-1 border border-slate-200">
              {([
                { key: 'usuarios', label: 'Usuarios', color: '#6366f1' },
                { key: 'postulaciones', label: 'Postulaciones', color: '#8b5cf6' },
                { key: 'ofertas', label: 'Ofertas', color: '#06b6d4' },
              ] as const).map(m => (
                <button
                  key={m.key}
                  onClick={() => setActiveMetric(m.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeMetric === m.key
                      ? 'bg-white shadow-sm text-slate-900'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Barras */}
          <div className="flex items-end gap-3 h-44 px-2">
            {MONTHLY_SERIES.map((d, i) => {
              const val = d[activeMetric];
              const maxV = Math.max(...MONTHLY_SERIES.map(x => x[activeMetric]));
              const pct = (val / maxV) * 100;
              const color = metricColors[activeMetric];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group/bar">
                  <span className="text-xs font-bold text-slate-600 opacity-0 group-hover/bar:opacity-100 transition-opacity">
                    {fmt(val)}
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-xl flex flex-col justify-end" style={{ height: 140 }}>
                    <div
                      className="w-full rounded-t-xl transition-all duration-500"
                      style={{ height: `${pct}%`, background: color, opacity: 0.85 }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">{d.mes}</span>
                </div>
              );
            })}
          </div>

          {/* Leyenda */}
          <div className="flex items-center justify-end gap-4 mt-4 pt-3 border-t border-slate-100">
            {[
              { key: 'usuarios', label: 'Usuarios', color: '#6366f1' },
              { key: 'postulaciones', label: 'Postulaciones', color: '#8b5cf6' },
              { key: 'ofertas', label: 'Ofertas', color: '#06b6d4' },
            ].map(m => (
              <div key={m.key} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-3 h-3 rounded-full" style={{ background: m.color }} />
                {m.label}
              </div>
            ))}
          </div>
        </div>

        {/* Distribución por Estado */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-900 mb-1">Estado de Postulaciones</h2>
          <p className="text-xs text-slate-500 mb-5">Distribución actual del pipeline</p>

          <div className="flex justify-center mb-5">
            <DonutChart data={estadoData} />
          </div>

          <div className="space-y-2.5">
            {estadoData.map((e, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.color }} />
                <span className="text-xs text-slate-600 flex-1">{e.label}</span>
                <div className="w-16 bg-slate-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full" style={{ width: `${e.val}%`, background: e.color }} />
                </div>
                <span className="text-xs font-bold text-slate-800 w-8 text-right">{e.val}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tercera Fila: Cards de resumen rápido ─────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: <Star className="w-5 h-5" />, label: 'AI Match Promedio', value: `${d.matchPromedio}%`, accent: 'bg-amber-50 text-amber-600', border: 'hover:border-amber-200' },
          { icon: <Building2 className="w-5 h-5" />, label: 'Empresas Registradas', value: d.empresasRegistradas, accent: 'bg-violet-50 text-violet-600', border: 'hover:border-violet-200' },
          { icon: <GraduationCap className="w-5 h-5" />, label: 'Estudiantes Activos', value: fmt(d.estudiantesActivos), accent: 'bg-blue-50 text-blue-600', border: 'hover:border-blue-200' },
          { icon: <Calendar className="w-5 h-5" />, label: 'Entrevistas Programadas', value: d.entrevistasProgramadas, accent: 'bg-emerald-50 text-emerald-600', border: 'hover:border-emerald-200' },
        ].map((item, i) => (
          <div key={i} className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3 transition-all ${item.border}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.accent}`}>
              {item.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">{item.label}</p>
              <p className="text-xl font-extrabold text-slate-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Cuarta Fila: Top Carreras + Top Empresas ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Carreras */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Top Carreras</h2>
              <p className="text-xs text-slate-500">Por volumen de postulaciones</p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-200">
              <GraduationCap className="w-3.5 h-3.5" /> {TOP_CARRERAS.length} carreras
            </span>
          </div>
          <div className="space-y-4">
            {TOP_CARRERAS.map((c, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 truncate max-w-[220px]">{c.carrera}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-600 shrink-0">{c.count.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{ width: `${c.pct}%`, background: `hsl(${234 + i * 8}, 80%, ${55 + i * 4}%)` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Empresas */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Top Empresas Contratantes</h2>
              <p className="text-xs text-slate-500">Mayor volumen de selección</p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 text-violet-700 rounded-lg text-xs font-bold border border-violet-200">
              <Building2 className="w-3.5 h-3.5" /> {TOP_EMPRESAS.length} empresas
            </span>
          </div>
          <div className="space-y-3">
            {TOP_EMPRESAS.map((e, i) => {
              const mc = e.matchAvg >= 88 ? 'text-emerald-700 bg-emerald-50' : 'text-blue-700 bg-blue-50';
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {e.empresa.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-violet-700 transition-colors">{e.empresa}</p>
                    <p className="text-xs text-slate-400">{e.ofertas} ofertas · {e.postulaciones} postulaciones</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${mc}`}>
                    ⚡ {e.matchAvg}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Quinta Fila: Universidades + Modalidades ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Distribución Universidades */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Origen Universitario</h2>
              <p className="text-xs text-slate-500">Distribución de candidatos por universidad</p>
            </div>
          </div>
          <div className="space-y-3">
            {UNIVERSIDADES.map((u, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600 w-14 text-right shrink-0">{u.uni}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ width: `${u.pct}%`, background: u.color }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-800 w-10 text-right shrink-0">{u.pct}%</span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
            {UNIVERSIDADES.map((u, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: u.color }} />
                {u.uni}
              </div>
            ))}
          </div>
        </div>

        {/* Modalidades de Empleo */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-900 mb-1">Modalidades</h2>
          <p className="text-xs text-slate-500 mb-5">Preferencia de trabajo por tipo</p>

          <div className="space-y-4">
            {MODALIDADES.map((m, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-slate-700">{m.label}</span>
                  <span className="text-sm font-bold text-slate-900">{m.val}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ width: `${m.val}%`, background: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Total ofertas evaluadas</span>
              <span className="font-bold text-slate-800">{d.ofertasActivas}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Preferencia dominante</span>
              <span className="font-bold text-indigo-700">Remoto</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Match promedio IA</span>
              <span className="font-bold text-emerald-700">{d.matchPromedio}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Hero Banner Resumen ───────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 rounded-2xl p-7 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20">
        {/* Decoración fondo */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-bold text-white/80 uppercase tracking-wider">Resumen Ejecutivo · {periodoLabel[periodo]}</span>
            </div>
            <h3 className="text-2xl font-extrabold mb-1">
              La plataforma creció <span className="text-yellow-300">+{d.usuariosDelta.toFixed(1)}%</span> en usuarios
            </h3>
            <p className="text-white/70 text-sm max-w-lg">
              {fmt(d.postulaciones)} postulaciones procesadas con un AI Match promedio de {d.matchPromedio}%,
              logrando una tasa de conversión del {d.tasaConversion}% en el proceso de selección.
            </p>
          </div>
          <div className="flex items-center gap-6 shrink-0">
            <div className="text-center">
              <p className="text-3xl font-extrabold">{d.tasaConversion}%</p>
              <p className="text-xs text-white/70 mt-1">Conversión</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-extrabold">{d.matchPromedio}%</p>
              <p className="text-xs text-white/70 mt-1">AI Match</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-extrabold">{d.entrevistasProgramadas}</p>
              <p className="text-xs text-white/70 mt-1">Entrevistas</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminEstadisticasView;
