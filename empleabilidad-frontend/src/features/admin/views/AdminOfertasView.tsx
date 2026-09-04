import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Building2,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Tag,
} from 'lucide-react';

// ─── Datos de ejemplo ──────────────────────────────────────────────────────────
const MOCK_OFFERS = [
  {
    id: 1,
    titulo: 'Desarrollador Full-Stack Senior',
    empresa: 'TechCorp S.A.',
    ubicacion: 'Lima, Perú',
    modalidad: 'Remoto',
    categoria: 'Tecnología',
    salario: 'S/. 6,000 – 9,000',
    postulantes: 34,
    estado: 'Activa',
    fechaPublicacion: '2026-08-20',
    logo: 'TC',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 2,
    titulo: 'Diseñador UX/UI',
    empresa: 'Creative Studio',
    ubicacion: 'Arequipa, Perú',
    modalidad: 'Híbrido',
    categoria: 'Diseño',
    salario: 'S/. 3,500 – 5,000',
    postulantes: 21,
    estado: 'Activa',
    fechaPublicacion: '2026-08-22',
    logo: 'CS',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 3,
    titulo: 'Analista de Datos',
    empresa: 'DataSoft Inc.',
    ubicacion: 'Cusco, Perú',
    modalidad: 'Presencial',
    categoria: 'Datos',
    salario: 'S/. 4,000 – 6,500',
    postulantes: 15,
    estado: 'Pausada',
    fechaPublicacion: '2026-08-15',
    logo: 'DS',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 4,
    titulo: 'Gerente de Proyectos TI',
    empresa: 'Global Solutions',
    ubicacion: 'Lima, Perú',
    modalidad: 'Remoto',
    categoria: 'Gestión',
    salario: 'S/. 8,000 – 12,000',
    postulantes: 9,
    estado: 'Activa',
    fechaPublicacion: '2026-08-28',
    logo: 'GS',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 5,
    titulo: 'Ingeniero DevOps',
    empresa: 'CloudBase Ltd.',
    ubicacion: 'Lima, Perú',
    modalidad: 'Remoto',
    categoria: 'Tecnología',
    salario: 'S/. 7,000 – 10,000',
    postulantes: 27,
    estado: 'Cerrada',
    fechaPublicacion: '2026-07-30',
    logo: 'CB',
    color: 'from-orange-500 to-amber-500',
  },
  {
    id: 6,
    titulo: 'Marketing Digital Specialist',
    empresa: 'AdVenture Corp.',
    ubicacion: 'Trujillo, Perú',
    modalidad: 'Híbrido',
    categoria: 'Marketing',
    salario: 'S/. 2,800 – 4,000',
    postulantes: 42,
    estado: 'Activa',
    fechaPublicacion: '2026-09-01',
    logo: 'AV',
    color: 'from-cyan-500 to-sky-600',
  },
];

const STATS = [
  {
    label: 'Total Ofertas',
    value: '87',
    change: '+12%',
    up: true,
    icon: Briefcase,
    bg: 'bg-violet-50',
    text: 'text-violet-600',
  },
  {
    label: 'Ofertas Activas',
    value: '64',
    change: '+8%',
    up: true,
    icon: CheckCircle,
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
  {
    label: 'Postulantes Totales',
    value: '1,248',
    change: '+22%',
    up: true,
    icon: Users,
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    label: 'Ofertas Cerradas',
    value: '23',
    change: '-5%',
    up: false,
    icon: XCircle,
    bg: 'bg-rose-50',
    text: 'text-rose-600',
  },
];

const CATEGORIAS_FILTER = ['Todas', 'Tecnología', 'Diseño', 'Datos', 'Gestión', 'Marketing'];
const ESTADOS = ['Todos', 'Activa', 'Pausada', 'Cerrada'];

// ─── Sub-componentes ───────────────────────────────────────────────────────────
const EstadoBadge = ({ estado }: { estado: string }) => {
  const map: Record<string, string> = {
    Activa: 'bg-emerald-100 text-emerald-700',
    Pausada: 'bg-amber-100 text-amber-700',
    Cerrada: 'bg-rose-100 text-rose-700',
  };
  const iconMap: Record<string, React.ReactNode> = {
    Activa: <CheckCircle className="w-3 h-3" />,
    Pausada: <Clock className="w-3 h-3" />,
    Cerrada: <XCircle className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${map[estado] ?? 'bg-slate-100 text-slate-600'}`}>
      {iconMap[estado]}
      {estado}
    </span>
  );
};

const ModalidadBadge = ({ modalidad }: { modalidad: string }) => {
  const map: Record<string, string> = {
    Remoto: 'bg-blue-100 text-blue-700',
    Híbrido: 'bg-violet-100 text-violet-700',
    Presencial: 'bg-slate-100 text-slate-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${map[modalidad] ?? 'bg-slate-100 text-slate-600'}`}>
      {modalidad}
    </span>
  );
};

const CATEGORIAS_DATA = [
  { nombre: 'Tecnología', ofertas: 32, color: 'from-blue-500 to-indigo-600', icono: '💻' },
  { nombre: 'Diseño', ofertas: 14, color: 'from-pink-500 to-rose-500', icono: '🎨' },
  { nombre: 'Datos & Analytics', ofertas: 11, color: 'from-emerald-500 to-teal-600', icono: '📊' },
  { nombre: 'Gestión', ofertas: 9, color: 'from-violet-500 to-purple-600', icono: '📋' },
  { nombre: 'Marketing', ofertas: 12, color: 'from-orange-500 to-amber-500', icono: '📣' },
  { nombre: 'Finanzas', ofertas: 6, color: 'from-cyan-500 to-sky-600', icono: '💰' },
  { nombre: 'Recursos Humanos', ofertas: 3, color: 'from-rose-400 to-pink-500', icono: '🤝' },
];

const CategoriasView = () => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Tag className="w-5 h-5 text-violet-600" />
        <span className="text-base font-semibold text-slate-700">
          {CATEGORIAS_DATA.length} categorías registradas
        </span>
      </div>
      <button className="flex items-center gap-2 border border-violet-300 text-violet-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-violet-50 transition-colors">
        <Plus className="w-4 h-4" />
        Nueva Categoría
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {CATEGORIAS_DATA.map((cat) => (
        <div
          key={cat.nombre}
          className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer group"
        >
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
            {cat.icono}
          </div>
          <h3 className="font-semibold text-slate-800 mb-1">{cat.nombre}</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              <span className="font-bold text-slate-700">{cat.ofertas}</span> ofertas
            </span>
            <div className="flex items-center gap-1 text-xs text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              Activa
            </div>
          </div>
          <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${cat.color}`}
              style={{ width: `${(cat.ofertas / 32) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Vista Principal ────────────────────────────────────────────────────────────
export const AdminOfertasView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [estadoFiltro, setEstadoFiltro] = useState('Todos');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  // Determina el tab activo según la ruta actual
  const getTabFromPath = (path: string): 'lista' | 'categorias' => {
    if (path.includes('categorias')) return 'categorias';
    return 'lista';
  };
  const [activeTab, setActiveTab] = useState<'lista' | 'categorias'>(
    getTabFromPath(location.pathname)
  );

  // Sincroniza tab con la URL cuando cambia la navegación
  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const ofertas = MOCK_OFFERS.filter((o) => {
    const matchSearch =
      o.titulo.toLowerCase().includes(search.toLowerCase()) ||
      o.empresa.toLowerCase().includes(search.toLowerCase());
    const matchCategoria = categoriaFiltro === 'Todas' || o.categoria === categoriaFiltro;
    const matchEstado = estadoFiltro === 'Todos' || o.estado === estadoFiltro;
    return matchSearch && matchCategoria && matchEstado;
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestión de Ofertas</h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra todas las ofertas de empleo publicadas en la plataforma
          </p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-600/25">
          <Plus className="w-4 h-4" />
          Nueva Oferta
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.text}`} />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {s.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-800">{s.value}</div>
            <div className="text-sm text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {(['lista', 'categorias'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              navigate(tab === 'lista' ? '/admin/ofertas/listado' : '/admin/ofertas/categorias');
            }}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-white text-violet-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'lista' ? 'Listado de Ofertas' : 'Categorías'}
          </button>
        ))}
      </div>

      {activeTab === 'lista' ? (
        <>
          {/* Filtros */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por título o empresa..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={categoriaFiltro}
                  onChange={(e) => setCategoriaFiltro(e.target.value)}
                  className="pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none cursor-pointer"
                >
                  {CATEGORIAS_FILTER.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
              >
                {ESTADOS.map((e) => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              Mostrando <span className="font-semibold text-slate-600">{ofertas.length}</span> ofertas
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Oferta</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Empresa</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Modalidad</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Salario</th>
                    <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Postulantes</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ofertas.map((oferta) => (
                    <tr key={oferta.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${oferta.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                            {oferta.logo}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-800 group-hover:text-violet-700 transition-colors">
                              {oferta.titulo}
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span className="text-xs text-slate-400">{oferta.ubicacion}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-600">{oferta.empresa}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <ModalidadBadge modalidad={oferta.modalidad} />
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-sm font-medium text-slate-700">{oferta.salario}</span>
                      </td>
                      <td className="px-4 py-4 text-center hidden lg:table-cell">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-sm font-semibold text-slate-700">{oferta.postulantes}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <EstadoBadge estado={oferta.estado} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1 relative">
                          <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-violet-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-blue-600">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-rose-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => setActiveMenu(activeMenu === oferta.id ? null : oferta.id)}
                              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            {activeMenu === oferta.id && (
                              <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-xl shadow-xl z-10 py-1 min-w-[140px]">
                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700 flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4" /> Activar
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2">
                                  <Clock className="w-4 h-4" /> Pausar
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                                  <XCircle className="w-4 h-4" /> Cerrar
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {ofertas.length === 0 && (
                <div className="py-16 text-center">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No se encontraron ofertas</p>
                  <p className="text-sm text-slate-400 mt-1">Intenta ajustar los filtros de búsqueda</p>
                </div>
              )}
            </div>

            {/* Paginación */}
            {ofertas.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Página <span className="font-semibold text-slate-700">1</span> de <span className="font-semibold text-slate-700">5</span>
                </p>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 disabled:opacity-40" disabled>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {[1, 2, 3, '...', 5].map((p, i) => (
                    <button
                      key={i}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === 1 ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      {p}
                    </button>
                  ))}
                  <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <CategoriasView />
      )}
    </div>
  );
};
