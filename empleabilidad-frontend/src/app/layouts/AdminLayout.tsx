import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  ShoppingBag, 
  Store, 
  Menu,
  Mail,
  MessageSquare,
  Calendar,
  Columns3,
  FileText,
  Users,
  Shield,
  FileStack,
  Search,
  Bell,
  Moon,
  Grid3x3,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    if (user) {
      logout();
    }
    navigate('/auth/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Gestión de Usuarios', path: '/admin/usuarios', hasSubmenu: true },
    { icon: ShoppingBag, label: 'Gestión de Ofertas', path: '/admin/ofertas', hasSubmenu: true },
    { icon: FileText, label: 'Gestión de Postulaciones', path: '/admin/postulaciones', hasSubmenu: true },
    { icon: BarChart3, label: 'Estadísticas', path: '/admin/estadisticas' },
  ];

  const appsPages = [
    { icon: Users, label: 'Usuarios', path: '/admin/usuarios/listado' },
    { icon: Shield, label: 'Candidatos', path: '/admin/usuarios/candidatos' },
    { icon: Store, label: 'Empresas', path: '/admin/usuarios/empresas' },
    { icon: Shield, label: 'Roles y Permisos', path: '/admin/usuarios/roles' },
    { icon: ShoppingBag, label: 'Ofertas de Empleo', path: '/admin/ofertas/listado' },
    { icon: FileStack, label: 'Categorías de Ofertas', path: '/admin/ofertas/categorias' },
    { icon: FileText, label: 'Postulaciones', path: '/admin/postulaciones/listado' },
    { icon: MessageSquare, label: 'Estado de Postulaciones', path: '/admin/postulaciones/estados' },
    { icon: Calendar, label: 'Entrevistas', path: '/admin/postulaciones/entrevistas' },
    { icon: Mail, label: 'Notificaciones', path: '/admin/notificaciones' },
    { icon: BarChart3, label: 'Reportes', path: '/admin/reportes' },
    { icon: Columns3, label: 'Configuración', path: '/admin/configuracion' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-800">EmpleoAdmin</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {/* Main Menu */}
          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-violet-100 text-violet-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded">
                    {item.badge}
                  </span>
                )}
                {item.hasSubmenu && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </NavLink>
            ))}
          </div>

          {/* Apps & Pages Section */}
          <div className="mt-6">
            <div className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Módulos del Sistema
            </div>
            <div className="space-y-1">
              {appsPages.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-violet-100 text-violet-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-600 rounded">
                      {item.badge}
                    </span>
                  )}
                  {item.hasSubmenu && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6">
          <div className="flex items-center flex-1 gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
            
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar (Ctrl+/)"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              <img src="https://flagcdn.com/w40/us.png" alt="US" className="w-5 h-5 rounded" />
            </button>
            
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Moon className="w-5 h-5 text-slate-600" />
            </button>
            
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Grid3x3 className="w-5 h-5 text-slate-600" />
            </button>
            
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title={user ? 'Logout' : 'Login'}
            >
              <img
                src={user?.avatar || "https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff"}
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <LogOut className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
