import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Shield,
  Building2,
  GraduationCap,
  CheckCircle2,
  Clock,
  Ban,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Lock,
  Unlock,
  Trash2,
  Download,
  Award,
  Check,
  X,
  SlidersHorizontal,
  Building
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminUsuariosService } from '../services/admin-usuarios.service';

// ─── Tipos ───────────────────────────────────────────────────────────────────
export type UserRole = 'ESTUDIANTE' | 'PROFESIONAL' | 'EMPRESA' | 'RECLUTADOR' | 'ADMINISTRADOR';
export type UserStatus = 'ACTIVA' | 'PENDIENTE' | 'INACTIVA' | 'BLOQUEADA';

export interface AdminUserItem {
  id: string;
  uuid: string;
  email: string;
  rol: UserRole;
  estadoCuenta: UserStatus;
  nombreCompleto: string;
  fotoPerfil?: string;
  telefono?: string;
  fechaRegistro: string;
  ultimoAcceso: string;
  // Campos específicos estudiante
  carrera?: string;
  universidad?: string;
  ciclo?: string;
  postulacionesCount?: number;
  // Campos específicos empresa
  ruc?: string;
  razonSocial?: string;
  sector?: string;
  ofertasActivasCount?: number;
  verificada?: boolean;
}

const getLastAccessDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatLastAccess = (value: string) => {
  const date = getLastAccessDate(value);
  if (!date) return value || 'Nunca';
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (elapsedSeconds < 60) return 'Ahora mismo';
  if (elapsedSeconds < 3600) return `Hace ${Math.floor(elapsedSeconds / 60)} min`;
  if (elapsedSeconds < 86400) return `Hace ${Math.floor(elapsedSeconds / 3600)} h`;
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
};

const hasRecentAccess = (value: string) => {
  const date = getLastAccessDate(value);
  return Boolean(date && Date.now() - date.getTime() < 5 * 60 * 1000);
};

// ─── Datos Mock Enriquecidos ──────────────────────────────────────────────────
// Datos históricos conservados para referencia; la vista usa exclusivamente
// la respuesta del backend y no los muestra como datos reales.
export const INITIAL_USERS: AdminUserItem[] = [
  {
    id: 'u-1',
    uuid: '65b09f07-9686-485f-be3e-07ae112d07ed',
    email: 'jeffersonhuichochacchi@gmail.com',
    rol: 'ESTUDIANTE',
    estadoCuenta: 'ACTIVA',
    nombreCompleto: 'Jefferson Huicho Chacchi',
    telefono: '+51 987 654 321',
    fechaRegistro: '2026-08-10T14:30:00Z',
    ultimoAcceso: 'Hace 10 minutos',
    carrera: 'Ingeniería de Sistemas e Informática',
    universidad: 'Universidad Nacional Mayor de San Marcos',
    ciclo: 'X Ciclo',
    postulacionesCount: 8,
  },
  {
    id: 'u-2',
    uuid: 'b8c90b88-c8c2-441e-88e4-cd8aaa38e24f',
    email: 'contacto@empresa.com',
    rol: 'EMPRESA',
    estadoCuenta: 'ACTIVA',
    nombreCompleto: 'TechNova Solutions S.A.C.',
    razonSocial: 'TechNova Solutions Sociedad Anónima Cerrada',
    ruc: '20601234567',
    sector: 'Desarrollo de Software y Cloud',
    telefono: '+51 (01) 456-7890',
    fechaRegistro: '2026-07-22T09:15:00Z',
    ultimoAcceso: 'Hace 1 hora',
    ofertasActivasCount: 5,
    verificada: true,
  },
  {
    id: 'u-3',
    uuid: '268a315a-9b3d-4655-b884-8ddeb532cd9d',
    email: 'leocrispaitan@gmail.com',
    rol: 'ESTUDIANTE',
    estadoCuenta: 'ACTIVA',
    nombreCompleto: 'Leonardo Crispaitán Pérez',
    telefono: '+51 912 345 678',
    fechaRegistro: '2026-08-14T11:20:00Z',
    ultimoAcceso: 'Ayer',
    carrera: 'Ingeniería de Software',
    universidad: 'Universidad Peruana de Ciencias Aplicadas',
    ciclo: 'VIII Ciclo',
    postulacionesCount: 5,
  },
  {
    id: 'u-4',
    uuid: '0bd0bfc3-56ee-41cc-bd18-c95793ccee63',
    email: 'indira@gmail.com',
    rol: 'ESTUDIANTE',
    estadoCuenta: 'PENDIENTE',
    nombreCompleto: 'Indira Morales Solís',
    telefono: '+51 945 678 123',
    fechaRegistro: '2026-09-12T16:45:00Z',
    ultimoAcceso: 'Hace 3 días',
    carrera: 'Diseño UX/UI & Multimedia',
    universidad: 'Pontificia Universidad Católica del Perú',
    ciclo: 'VII Ciclo',
    postulacionesCount: 2,
  },
  {
    id: 'u-5',
    uuid: '0060c667-c907-42b1-bddc-36b6a18d036a',
    email: 'jeffer@gmail.com',
    rol: 'ESTUDIANTE',
    estadoCuenta: 'INACTIVA',
    nombreCompleto: 'Jeffer Alexander Ramos',
    telefono: '+51 922 113 445',
    fechaRegistro: '2026-06-05T18:00:00Z',
    ultimoAcceso: 'Hace 2 semanas',
    carrera: 'Ciencia de Datos e IA',
    universidad: 'Universidad Nacional de Ingeniería',
    ciclo: 'VI Ciclo',
    postulacionesCount: 1,
  },
  {
    id: 'u-6',
    uuid: '714f8e1e-b1d2-481e-90ae-afbb0982ab71',
    email: 'juan@gmail.com',
    rol: 'RECLUTADOR',
    estadoCuenta: 'ACTIVA',
    nombreCompleto: 'Juan Carlos Mendoza Silva',
    telefono: '+51 966 887 744',
    fechaRegistro: '2026-07-30T10:00:00Z',
    ultimoAcceso: 'Hace 2 horas',
    razonSocial: 'Talent Acquisition Group',
    sector: 'Consultoría y Headhunting Tech',
    ofertasActivasCount: 7,
    verificada: true,
  },
  {
    id: 'u-7',
    uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    email: 'admin.general@empleoelp.edu.pe',
    rol: 'ADMINISTRADOR',
    estadoCuenta: 'ACTIVA',
    nombreCompleto: 'Admin Plataforma ELP',
    telefono: '+51 999 000 111',
    fechaRegistro: '2026-01-01T00:00:00Z',
    ultimoAcceso: 'Ahora mismo',
  },
  {
    id: 'u-8',
    uuid: 'c8d9e0f1-2345-6789-0abc-def123456789',
    email: 'rrhh@bancocentral.pe',
    rol: 'EMPRESA',
    estadoCuenta: 'PENDIENTE',
    nombreCompleto: 'Banco Financiero Central',
    razonSocial: 'Banco Financiero Central S.A.',
    ruc: '20109988776',
    sector: 'Banca y Finanzas Digitales',
    telefono: '+51 (01) 311-5000',
    fechaRegistro: '2026-09-14T08:30:00Z',
    ultimoAcceso: 'Ayer',
    ofertasActivasCount: 0,
    verificada: false,
  },
  {
    id: 'u-9',
    uuid: 'd9e0f1a2-3456-7890-bcde-f12345678901',
    email: 'carlos.bloqueado@correo.com',
    rol: 'ESTUDIANTE',
    estadoCuenta: 'BLOQUEADA',
    nombreCompleto: 'Carlos Alberto Valdivia',
    telefono: '+51 933 222 111',
    fechaRegistro: '2026-05-18T13:00:00Z',
    ultimoAcceso: 'Hace 1 mes',
    carrera: 'Ingeniería Industrial',
    universidad: 'Universidad Nacional Mayor de San Marcos',
    ciclo: 'IX Ciclo',
    postulacionesCount: 0,
  }
];

export const AdminUsuariosView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Estados principales
  // No mostrar datos de demostración mientras llega la respuesta real. Antes la
  // vista iniciaba con 9 mocks y luego los reemplazaba por los usuarios reales.
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [roleCounts, setRoleCounts] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'TODOS' | UserRole>('TODOS');
  const [selectedStatus, setSelectedStatus] = useState<'TODOS' | UserStatus>('TODOS');
  const [sortBy, setSortBy] = useState<'recientes' | 'nombre' | 'rol'>('recientes');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modales
  const [detailUser, setDetailUser] = useState<AdminUserItem | null>(null);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);

  // Formulario nuevo usuario
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    rol: 'ESTUDIANTE' as UserRole,
    telefono: '',
    carrera: '',
    universidad: '',
    razonSocial: '',
    ruc: '',
    sector: '',
  });

  // Determinar tab activo según la URL
  const activeTab = useMemo(() => {
    const path = location.pathname;
    if (path.includes('/candidatos')) return 'CANDIDATOS';
    if (path.includes('/empresas')) return 'EMPRESAS';
    if (path.includes('/roles')) return 'ROLES';
    return 'TODOS';
  }, [location.pathname]);

  // Manejar cambio de Tab
  const handleTabChange = (tab: 'TODOS' | 'CANDIDATOS' | 'EMPRESAS' | 'ROLES') => {
    switch (tab) {
      case 'CANDIDATOS':
        navigate('/admin/usuarios/candidatos');
        break;
      case 'EMPRESAS':
        navigate('/admin/usuarios/empresas');
        break;
      case 'ROLES':
        navigate('/admin/usuarios/roles');
        break;
      case 'TODOS':
      default:
        navigate('/admin/usuarios/listado');
        break;
    }
  };

  // Métricas
  const stats = useMemo(() => {
    const total = users.length;
    const candidatos = users.filter(u => u.rol === 'ESTUDIANTE' || u.rol === 'PROFESIONAL').length;
    const empresas = users.filter(u => u.rol === 'EMPRESA' || u.rol === 'RECLUTADOR').length;
    const pendientes = users.filter(u => u.estadoCuenta === 'PENDIENTE').length;
    const activas = users.filter(u => u.estadoCuenta === 'ACTIVA').length;
    return { total, candidatos, empresas, pendientes, activas };
  }, [users]);

  // Filtrado y ordenación
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Filtro por Tab de ruta
      if (activeTab === 'CANDIDATOS' && user.rol !== 'ESTUDIANTE' && user.rol !== 'PROFESIONAL') {
        return false;
      }
      if (activeTab === 'EMPRESAS' && user.rol !== 'EMPRESA' && user.rol !== 'RECLUTADOR') {
        return false;
      }

      // Filtro por Rol seleccionado en dropdown
      if (selectedRole !== 'TODOS' && user.rol !== selectedRole) {
        return false;
      }

      // Filtro por Estado
      if (selectedStatus !== 'TODOS' && user.estadoCuenta !== selectedStatus) {
        return false;
      }

      // Filtro por búsqueda
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = user.nombreCompleto.toLowerCase().includes(q);
        const matchEmail = user.email.toLowerCase().includes(q);
        const matchRuc = user.ruc?.toLowerCase().includes(q);
        const matchCarrera = user.carrera?.toLowerCase().includes(q);
        return matchName || matchEmail || matchRuc || matchCarrera;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'nombre') {
        return a.nombreCompleto.localeCompare(b.nombreCompleto);
      }
      if (sortBy === 'rol') {
        return a.rol.localeCompare(b.rol);
      }
      return new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime();
    });
  }, [users, activeTab, selectedRole, selectedStatus, searchTerm, sortBy]);

  // Paginación de resultados
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole, selectedStatus, activeTab]);

  useEffect(() => {
    let mounted = true;
    const loadUsers = async (showSpinner = true) => {
      if (showSpinner) setIsLoadingUsers(true);
      try {
        // La tabla y el resumen son independientes. La tabla no debe quedarse
        // esperando a que termine la consulta secundaria de roles.
        const [usersResult, rolesResult] = await Promise.allSettled([
          adminUsuariosService.listar({ size: 500 }),
          adminUsuariosService.resumenRoles(),
        ]);
        if (!mounted) return;
        if (usersResult.status === 'fulfilled') {
          setUsers(Array.isArray(usersResult.value.content) ? usersResult.value.content : []);
        }
        if (rolesResult.status === 'fulfilled') {
          setRoleCounts(rolesResult.value ?? {});
        }
        if (usersResult.status === 'rejected') {
          setUsers([]);
          toast.error('No se pudo cargar la lista de usuarios');
        }
      } catch {
        if (mounted && showSpinner) {
          setUsers([]);
          setRoleCounts({});
          toast.error('No se pudo cargar la lista de usuarios');
        }
      } finally {
        if (mounted && showSpinner) setIsLoadingUsers(false);
      }
    };
    void loadUsers();
    const interval = window.setInterval(() => void loadUsers(false), 15000);
    return () => { mounted = false; window.clearInterval(interval); };
  }, []);

  // Acciones de Usuario
  const handleToggleBlock = async (userItem: AdminUserItem) => {
    const newStatus: UserStatus = userItem.estadoCuenta === 'BLOQUEADA' ? 'ACTIVA' : 'BLOQUEADA';
    try { await adminUsuariosService.cambiarBloqueo(userItem.id, newStatus === 'BLOQUEADA'); }
    catch { toast.error('No se pudo actualizar el estado de la cuenta'); return; }
    setUsers(prev => prev.map(u => u.id === userItem.id ? { ...u, estadoCuenta: newStatus } : u));
    if (newStatus === 'BLOQUEADA') {
      toast.error(`Usuario ${userItem.nombreCompleto} ha sido bloqueado.`);
    } else {
      toast.success(`Usuario ${userItem.nombreCompleto} desbloqueado.`);
    }
    if (detailUser?.id === userItem.id) {
      setDetailUser(prev => prev ? { ...prev, estadoCuenta: newStatus } : null);
    }
  };

  const handleVerifyEmpresa = async (userItem: AdminUserItem) => {
    try { await adminUsuariosService.verificarEmpresa(userItem.id); }
    catch { toast.error('No se pudo verificar la empresa'); return; }
    setUsers(prev => prev.map(u => u.id === userItem.id ? { ...u, verificada: true, estadoCuenta: 'ACTIVA' } : u));
    toast.success(`Empresa ${userItem.nombreCompleto} verificada correctamente.`);
    if (detailUser?.id === userItem.id) {
      setDetailUser(prev => prev ? { ...prev, verificada: true, estadoCuenta: 'ACTIVA' } : null);
    }
  };

  const handleDeleteUser = async (userItem: AdminUserItem) => {
    if (!window.confirm(`¿Estás seguro de eliminar permanentemente al usuario ${userItem.nombreCompleto}?`)) return;
    try { await adminUsuariosService.eliminar(userItem.id); }
    catch { toast.error('No se pudo eliminar el usuario'); return; }
    setUsers(prev => prev.filter(u => u.id !== userItem.id));
    toast.success('Usuario eliminado del sistema.');
    if (detailUser?.id === userItem.id) setDetailUser(null);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombreCompleto.trim() || !formData.email.trim()) {
      toast.error('Nombre y Correo electrónico son obligatorios');
      return;
    }

    try {
      const created = await adminUsuariosService.crear({
        nombreCompleto: formData.nombreCompleto.trim(), email: formData.email.trim(), rol: formData.rol,
        telefono: formData.telefono, ruc: formData.ruc, sector: formData.sector,
      });
      setUsers(prev => [created, ...prev]);
      toast.success('Usuario creado satisfactoriamente. Contraseña temporal: Temporal123!');
      setIsNewUserModalOpen(false);
      setFormData({ nombreCompleto: '', email: '', rol: 'ESTUDIANTE', telefono: '', carrera: '', universidad: '', razonSocial: '', ruc: '', sector: '' });
      return;
    } catch { toast.error('No se pudo crear el usuario. Verifica el rol y los datos.'); return; }

    const newUser: AdminUserItem = {
      id: `u-${Date.now()}`,
      uuid: `uuid-${Date.now()}`,
      email: formData.email.trim(),
      nombreCompleto: formData.nombreCompleto.trim(),
      rol: formData.rol,
      estadoCuenta: 'ACTIVA',
      telefono: formData.telefono || '+51 900 000 000',
      fechaRegistro: new Date().toISOString(),
      ultimoAcceso: 'Nunca',
      carrera: formData.carrera || undefined,
      universidad: formData.universidad || undefined,
      razonSocial: formData.razonSocial || undefined,
      ruc: formData.ruc || undefined,
      sector: formData.sector || undefined,
      verificada: formData.rol === 'EMPRESA' ? true : undefined,
    };

    setUsers(prev => [newUser, ...prev]);
    toast.success('Usuario creado satisfactoriamente.');
    setIsNewUserModalOpen(false);
    setFormData({
      nombreCompleto: '',
      email: '',
      rol: 'ESTUDIANTE',
      telefono: '',
      carrera: '',
      universidad: '',
      razonSocial: '',
      ruc: '',
      sector: '',
    });
  };

  const handleExportCSV = () => {
    toast.success('Descargando reporte de usuarios en formato CSV...');
  };

  // Helper de Role Badge
  const getRoleBadge = (rol: UserRole) => {
    switch (rol) {
      case 'ADMINISTRADOR':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <Shield className="w-3.5 h-3.5" /> Administrador
          </span>
        );
      case 'EMPRESA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
            <Building2 className="w-3.5 h-3.5" /> Empresa
          </span>
        );
      case 'RECLUTADOR':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Award className="w-3.5 h-3.5" /> Reclutador
          </span>
        );
      case 'PROFESIONAL':
      case 'ESTUDIANTE':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <GraduationCap className="w-3.5 h-3.5" /> Candidato
          </span>
        );
    }
  };

  // Helper de Estado Badge
  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'ACTIVA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Activo
          </span>
        );
      case 'PENDIENTE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-500" />
            Pendiente
          </span>
        );
      case 'BLOQUEADA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <Ban className="w-3 h-3 text-rose-500" />
            Bloqueado
          </span>
        );
      case 'INACTIVA':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            Inactivo
          </span>
        );
    }
  };

  // Iniciales para el avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      
      {/* ── Encabezado Principal ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Gestión de Usuarios
              </h1>
              <p className="text-sm text-slate-500">
                Supervisa cuentas de estudiantes, reclutadores, empresas y directores del sistema.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Exportar
          </button>
          <button
            onClick={() => setIsNewUserModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <UserPlus className="w-4 h-4" />
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* ── Métricas Superiores (Cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Usuarios */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total de Cuentas</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-600">
            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-bold">+18.5%</span>
            <span className="text-slate-500">crecimiento mensual</span>
          </div>
        </div>

        {/* Candidatos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Candidatos / Alumnos</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.candidatos}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">92%</span> con CV activo adjunto
          </div>
        </div>

        {/* Empresas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-violet-300 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Empresas Aliadas</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.empresas}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-violet-700">12</span> ofertas laborales en curso
          </div>
        </div>

        {/* Pendientes de Verificación */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Por Verificar</p>
              <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{stats.pendientes}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <span className="bg-amber-100/70 text-amber-800 px-1.5 py-0.5 rounded font-semibold">Prioridad</span>
            Requieren revisión manual
          </div>
        </div>
      </div>

      {/* ── Tabs de Navegación Visual ── */}
      <div className="border-b border-slate-200 bg-white px-2 rounded-2xl shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto py-2">
          <button
            onClick={() => handleTabChange('TODOS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'TODOS'
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Todos los Usuarios</span>
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'TODOS' ? 'bg-blue-200/60 text-blue-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {users.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('CANDIDATOS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'CANDIDATOS'
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Candidatos / Alumnos</span>
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'CANDIDATOS' ? 'bg-blue-200/60 text-blue-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {stats.candidatos}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('EMPRESAS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'EMPRESAS'
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Empresas</span>
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'EMPRESAS' ? 'bg-blue-200/60 text-blue-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {stats.empresas}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('ROLES')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'ROLES'
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Roles y Permisos</span>
          </button>
        </div>
      </div>

      {/* ── Vista Especial: Matriz de Roles y Permisos ── */}
      {activeTab === 'ROLES' ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">ADMINISTRADOR</h4>
              <p className="text-xs text-slate-500 mt-1">Control maestro total del sistema, auditorías y configuración.</p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Asignados:</span>
                <span className="font-bold text-slate-800">{roleCounts.ADMINISTRADOR ?? 0} Usuarios</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">EMPRESA</h4>
              <p className="text-xs text-slate-500 mt-1">Publicación de empleos, gestión de postulantes y entrevistas.</p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Asignados:</span>
                <span className="font-bold text-slate-800">{(roleCounts.EMPRESA ?? 0) + (roleCounts.RECLUTADOR ?? 0)} Empresas</span>
              </div>
            </div>

            <div className="hidden bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">RECLUTADOR</h4>
              <p className="text-xs text-slate-500 mt-1">Filtrado y evaluación técnica de talento para ofertas asignadas.</p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Asignados:</span>
                <span className="font-bold text-slate-800">{roleCounts.RECLUTADOR ?? 0} Reclutadores</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">CANDIDATO</h4>
              <p className="text-xs text-slate-500 mt-1">Postulación, carga de currículum y seguimiento en tiempo real.</p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Asignados:</span>
                <span className="font-bold text-slate-800">{(roleCounts.ESTUDIANTE ?? 0) + (roleCounts.PROFESIONAL ?? 0)} Alumnos</span>
              </div>
            </div>
          </div>

          {/* Tabla de Matriz de Permisos */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Matriz de Acceso y Privilegios</h3>
                <p className="text-xs text-slate-500">Mapeo de permisos granulares por cada rol del ecosistema</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
                Políticas de Seguridad RBAC Activas
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5">Módulo / Capacidad</th>
                    <th className="px-4 py-3.5 text-center">Candidato</th>
                    <th className="px-4 py-3.5 text-center">Empresa</th>
                    <th className="px-4 py-3.5 text-center">Administrador</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { mod: 'Buscar y postular a ofertas', cand: true, emp: false, rec: false, adm: true },
                    { mod: 'Publicar y editar ofertas laborales', cand: false, emp: true, rec: true, adm: true },
                    { mod: 'Aprobar o rechazar postulaciones', cand: false, emp: true, rec: true, adm: true },
                    { mod: 'Programar entrevistas con candidatos', cand: false, emp: true, rec: true, adm: true },
                    { mod: 'Calificar evaluaciones internas', cand: false, emp: true, rec: true, adm: true },
                    { mod: 'Screening y Match de IA Gemini', cand: false, emp: true, rec: true, adm: true },
                    { mod: 'Gestión global de cuentas de usuarios', cand: false, emp: false, rec: false, adm: true },
                    { mod: 'Auditoría, logs y configuración', cand: false, emp: false, rec: false, adm: true },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-3.5 font-medium text-slate-800">{row.mod}</td>
                      <td className="px-4 py-3.5 text-center">
                        {row.cand ? <Check className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {row.emp ? <Check className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {row.adm ? <Check className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ── Vista de Listado Principal (Usuarios / Candidatos / Empresas) ── */
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Barra de Búsqueda y Filtros */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, correo, RUC o carrera..."
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all placeholder:text-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              {/* Filtro por Rol (solo visible en vista "TODOS") */}
              {activeTab === 'TODOS' && (
                <div className="flex items-center gap-1 bg-slate-50/80 px-2.5 py-1.5 rounded-xl border border-slate-200">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as any)}
                    className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="TODOS">Todos los roles</option>
                    <option value="ESTUDIANTE">Candidato</option>
                    <option value="EMPRESA">Empresa</option>
                    <option value="RECLUTADOR">Reclutador</option>
                    <option value="ADMINISTRADOR">Administrador</option>
                  </select>
                </div>
              )}

              {/* Filtro por Estado */}
              <div className="flex items-center gap-1 bg-slate-50/80 px-2.5 py-1.5 rounded-xl border border-slate-200">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="TODOS">Todos los estados</option>
                  <option value="ACTIVA">Activos</option>
                  <option value="PENDIENTE">Pendientes</option>
                  <option value="BLOQUEADA">Bloqueados</option>
                  <option value="INACTIVA">Inactivos</option>
                </select>
              </div>

              {/* Ordenación */}
              <div className="flex items-center gap-1 bg-slate-50/80 px-2.5 py-1.5 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-400">Orden:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="recientes">Más recientes</option>
                  <option value="nombre">Nombre (A-Z)</option>
                  <option value="rol">Por Rol</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabla de Usuarios */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Usuario</th>
                    <th className="px-4 py-4">Rol en Sistema</th>
                    <th className="px-4 py-4">Información Clave</th>
                    <th className="px-4 py-4">Estado</th>
                    <th className="px-4 py-4">Último Acceso</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoadingUsers ? (
                    <tr><td colSpan={6} className="py-12 text-center text-sm text-slate-500"><span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent align-middle" /> <span className="ml-2">Cargando usuarios...</span></td></tr>
                  ) : paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12">
                        <div className="max-w-xs mx-auto text-center">
                          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-slate-700">No se encontraron usuarios</p>
                          <p className="text-xs text-slate-400 mt-1">Prueba con otros términos de búsqueda o filtros.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/70 transition-colors group">
                        
                        {/* Usuario / Avatar */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm ${
                              user.rol === 'ADMINISTRADOR'
                                ? 'bg-red-100 text-red-700'
                                : user.rol === 'EMPRESA'
                                ? 'bg-violet-100 text-violet-700'
                                : user.rol === 'RECLUTADOR'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {getInitials(user.nombreCompleto)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  {user.nombreCompleto}
                                </span>
                                {user.verificada && (
                                  <span title="Empresa Verificada" className="text-blue-500 inline-block">
                                    <CheckCircle2 className="w-4 h-4 fill-blue-500 text-white" />
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                                <Mail className="w-3 h-3" />
                                <span>{user.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Rol */}
                        <td className="px-4 py-4">
                          {getRoleBadge(user.rol)}
                        </td>

                        {/* Información Clave Contextual */}
                        <td className="px-4 py-4">
                          {user.rol === 'EMPRESA' || user.rol === 'RECLUTADOR' ? (
                            <div className="text-xs space-y-0.5">
                              {user.ruc && (
                                <p className="font-semibold text-slate-700">RUC: <span className="font-mono text-slate-500">{user.ruc}</span></p>
                              )}
                              <p className="text-slate-500 truncate max-w-[200px]">{user.sector || user.razonSocial || 'Sector no especificado'}</p>
                              {user.ofertasActivasCount !== undefined && (
                                <span className="text-[11px] text-violet-600 font-medium">
                                  {user.ofertasActivasCount} ofertas activas
                                </span>
                              )}
                            </div>
                          ) : user.rol === 'ADMINISTRADOR' ? (
                            <div className="text-xs text-slate-500">
                              <span className="font-semibold text-slate-700">Acceso Maestro</span>
                              <p>Administrador Central</p>
                            </div>
                          ) : (
                            <div className="text-xs space-y-0.5">
                              <p className="font-semibold text-slate-700 truncate max-w-[220px]">{user.carrera || 'Carrera Profesional'}</p>
                              <p className="text-slate-400 truncate max-w-[220px]">{user.universidad || 'Universidad del postulante'}</p>
                              {user.postulacionesCount !== undefined && (
                                <span className="text-[11px] text-blue-600 font-medium">
                                  {user.postulacionesCount} postulaciones enviadas
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Estado de Cuenta */}
                        <td className="px-4 py-4">
                          {getStatusBadge(user.estadoCuenta)}
                        </td>

                        {/* Último Acceso */}
                        <td className="px-4 py-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span className={hasRecentAccess(user.ultimoAcceso) ? 'font-semibold text-emerald-600' : ''}>
                              {formatLastAccess(user.ultimoAcceso)}
                            </span>
                          </div>
                        </td>

                        {/* Acciones */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setDetailUser(user)}
                              title="Ver Ficha Completa"
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {user.rol === 'EMPRESA' && !user.verificada && (
                              <button
                                onClick={() => handleVerifyEmpresa(user)}
                                title="Verificar Empresa"
                                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              >
                                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                              </button>
                            )}

                            <button
                              onClick={() => handleToggleBlock(user)}
                              title={user.estadoCuenta === 'BLOQUEADA' ? 'Desbloquear cuenta' : 'Bloquear cuenta'}
                              className={`p-1.5 rounded-lg transition-colors ${
                                user.estadoCuenta === 'BLOQUEADA'
                                  ? 'text-red-600 hover:bg-red-50'
                                  : 'text-emerald-600 hover:bg-emerald-50'
                              }`}
                            >
                              {user.estadoCuenta === 'BLOQUEADA' ? (
                                <Lock className="w-4 h-4" />
                              ) : (
                                <Unlock className="w-4 h-4" />
                              )}
                            </button>

                            <button
                              onClick={() => handleDeleteUser(user)}
                              title="Dar de baja / Eliminar"
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Mostrando <span className="font-bold text-slate-700">{paginatedUsers.length}</span> de{' '}
                <span className="font-bold text-slate-700">{filteredUsers.length}</span> usuarios
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-slate-700 px-2">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal 1: Ficha / Detalle de Usuario ── */}
      {detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 md:p-8 animate-in slide-in-from-bottom-4 border border-slate-100 max-h-[90vh] overflow-y-auto">
            
            {/* Header Modal */}
            <div className="flex items-start justify-between pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-md ${
                  detailUser.rol === 'ADMINISTRADOR'
                    ? 'bg-red-100 text-red-700'
                    : detailUser.rol === 'EMPRESA'
                    ? 'bg-violet-100 text-violet-700'
                    : detailUser.rol === 'RECLUTADOR'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {getInitials(detailUser.nombreCompleto)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900">{detailUser.nombreCompleto}</h3>
                    {detailUser.verificada && (
                      <span className="text-blue-500" title="Verificada por Admin">
                        <CheckCircle2 className="w-5 h-5 fill-blue-500 text-white" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {getRoleBadge(detailUser.rol)}
                    {getStatusBadge(detailUser.estadoCuenta)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setDetailUser(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Modal */}
            <div className="py-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Mail className="w-3.5 h-3.5" /> Correo Electrónico
                  </div>
                  <p className="text-sm font-semibold text-slate-800 break-all">{detailUser.email}</p>
                </div>

                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Phone className="w-3.5 h-3.5" /> Teléfono de Contacto
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{detailUser.telefono || 'No registrado'}</p>
                </div>

                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Calendar className="w-3.5 h-3.5" /> Fecha de Registro
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    {new Date(detailUser.fechaRegistro).toLocaleDateString('es-PE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Clock className="w-3.5 h-3.5" /> Último Ingreso
                  </div>
                  <p className={`text-sm font-semibold ${hasRecentAccess(detailUser.ultimoAcceso) ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {formatLastAccess(detailUser.ultimoAcceso)}
                  </p>
                </div>
              </div>

              {/* Bloque Específico según Rol */}
              {detailUser.rol === 'EMPRESA' || detailUser.rol === 'RECLUTADOR' ? (
                <div className="p-5 bg-violet-50/50 rounded-2xl border border-violet-100 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-violet-700 uppercase tracking-wider">
                    <Building className="w-4 h-4" /> Datos Corporativos
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-slate-400">Razón Social:</span>
                      <p className="font-semibold text-slate-800">{detailUser.razonSocial || detailUser.nombreCompleto}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">RUC:</span>
                      <p className="font-semibold text-slate-800 font-mono">{detailUser.ruc || '20601234567'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Sector Industrial:</span>
                      <p className="font-semibold text-slate-800">{detailUser.sector || 'Tecnología & Servicios'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Ofertas Publicadas:</span>
                      <p className="font-semibold text-violet-700">{detailUser.ofertasActivasCount || 0} activas</p>
                    </div>
                  </div>
                </div>
              ) : detailUser.rol === 'ADMINISTRADOR' ? (
                <div className="p-5 bg-red-50/50 rounded-2xl border border-red-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider">
                    <Shield className="w-4 h-4" /> Nivel de Acceso Root
                  </div>
                  <p className="text-xs text-slate-600">
                    Este usuario cuenta con privilegios de superadministrador en la base de datos central y servicios distribuidos.
                  </p>
                </div>
              ) : (
                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <GraduationCap className="w-4 h-4" /> Expediente Académico
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-slate-400">Carrera:</span>
                      <p className="font-semibold text-slate-800">{detailUser.carrera || 'Ingeniería de Sistemas'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Universidad / Institución:</span>
                      <p className="font-semibold text-slate-800">{detailUser.universidad || 'Universidad Nacional Mayor de San Marcos'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Nivel / Ciclo:</span>
                      <p className="font-semibold text-slate-800">{detailUser.ciclo || 'Egresado / Bachiller'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Postulaciones:</span>
                      <p className="font-semibold text-blue-700">{detailUser.postulacionesCount || 0} enviadas</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => handleToggleBlock(detailUser)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2 ${
                  detailUser.estadoCuenta === 'BLOQUEADA'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                }`}
              >
                {detailUser.estadoCuenta === 'BLOQUEADA' ? (
                  <>
                    <Unlock className="w-4 h-4" /> Desbloquear Cuenta
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Bloquear Cuenta
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDetailUser(null)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal 2: Crear Nuevo Usuario ── */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 animate-in slide-in-from-bottom-4 border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Crear Nuevo Usuario</h3>
                <p className="text-xs text-slate-500">Registra un nuevo usuario en la base de datos</p>
              </div>
              <button
                onClick={() => setIsNewUserModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Rol del Usuario *
                </label>
                <select
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value as UserRole })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="ESTUDIANTE">Candidato / Estudiante</option>
                  <option value="EMPRESA">Empresa</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nombre Completo / Razón Social *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombreCompleto}
                  onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                  placeholder={formData.rol === 'EMPRESA' ? 'TechNova Solutions S.A.C.' : 'Juan Pérez Gómez'}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="usuario@dominio.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Teléfono de Contacto
                </label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="+51 987 654 321"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              {/* Campos dinámicos para Estudiante */}
              {(formData.rol === 'ESTUDIANTE' || formData.rol === 'PROFESIONAL') && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Carrera Profesional
                    </label>
                    <input
                      type="text"
                      value={formData.carrera}
                      onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
                      placeholder="Ej. Ingeniería de Software"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Universidad / Instituto
                    </label>
                    <input
                      type="text"
                      value={formData.universidad}
                      onChange={(e) => setFormData({ ...formData, universidad: e.target.value })}
                      placeholder="Ej. Universidad Nacional de Ingeniería"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Campos dinámicos para Empresa */}
              {formData.rol === 'EMPRESA' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      RUC (11 dígitos)
                    </label>
                    <input
                      type="text"
                      maxLength={11}
                      value={formData.ruc}
                      onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                      placeholder="20601234567"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Sector / Industria
                    </label>
                    <input
                      type="text"
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                      placeholder="Ej. Fintech, Logística, Retail..."
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewUserModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition-all"
                >
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
