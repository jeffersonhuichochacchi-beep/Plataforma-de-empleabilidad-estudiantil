import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Briefcase,
  Sparkles,
  Bell,
  Database,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Mail,
  Lock,
  Sliders,
  Cpu,
  HardDrive,
  Download,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Info,
  Check,
  Zap,
  Building,
  KeyRound,
  FileCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api, usuariosPublicApi } from '@/core/api';

// ─── Pestañas ──────────────────────────────────────────────────────────────────
type TabType = 'general' | 'seguridad' | 'empleabilidad' | 'ia' | 'notificaciones' | 'sistema';

interface TabItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const TABS: TabItem[] = [
  { id: 'general', label: 'General', icon: Globe, description: 'Identidad, idiomas y mantenimiento' },
  { id: 'seguridad', label: 'Seguridad & Acceso', icon: Shield, description: 'Contraseñas, 2FA y sesiones' },
  { id: 'empleabilidad', label: 'Reglas de Empleabilidad', icon: Briefcase, description: 'Límites y flujos de postulaciones' },
  { id: 'ia', label: 'Motor IA Gemini', icon: Sparkles, description: 'Matching, umbrales y análisis CV' },
  { id: 'notificaciones', label: 'Notificaciones & Correo', icon: Bell, description: 'Plantillas y canales de envío' },
  { id: 'sistema', label: 'Sistema & Backups', icon: Database, description: 'Base de datos, caché y almacenamiento' },
];

export const AdminConfiguracionView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // ─── Estado de Configuraciones ───────────────────────────────────────────────
  const [generalConfig, setGeneralConfig] = useState({
    nombrePlataforma: 'Portal de Empleabilidad ELP',
    lemaPlataforma: 'Conectando talento universitario con las mejores empresas',
    emailContacto: 'empleabilidad@elp.edu.pe',
    telefonoSoporte: '+51 (01) 458-9200',
    zonaHoraria: 'America/Lima (UTC-5)',
    idiomaPredeterminado: 'es',
    modoMantenimiento: false,
    mensajeMantenimiento: 'La plataforma se encuentra en mantenimiento programado. Volveremos pronto.',
    registroAbiertoEstudiantes: true,
    registroAbiertoEmpresas: true,
  });

  const [seguridadConfig, setSeguridadConfig] = useState({
    longitudMinPassword: 8,
    requiereEspeciales: true,
    requiereNumeros: true,
    expiracionPasswordDias: 90,
    mfaObligatorioAdmin: true,
    mfaOpcionalEmpresas: true,
    tiempoInactividadMin: 30,
    maxIntentosLogin: 5,
    bloqueoTemporalMin: 15,
    dominioInstitucionalExclusivo: true,
    dominioPermitido: '@elp.edu.pe',
  });

  const [empleabilidadConfig, setEmpleabilidadConfig] = useState({
    maxPostulacionesActivas: 5,
    diasExpiracionOferta: 30,
    aprobacionPreviaOfertas: true,
    permitirPostulacionSinCV: false,
    permitirMultiplesPostulacionesMismaOferta: false,
    diasLimiteEntrevista: 14,
    notificarCambioEstadoAutomatico: true,
    puntajeMinimoAprobatorio: 70,
  });

  const [iaConfig, setIaConfig] = useState({
    iaHabilitada: true,
    modeloActivo: 'gemini-1.5-flash',
    umbralMatchMinimo: 65,
    analisisAutomaticoCV: true,
    generarResumenCompatibilidad: true,
    sugerirPreguntasEntrevista: true,
    temperaturaModelo: 0.2,
    maxTokensRespuesta: 1024,
  });

  const [notifConfig, setNotifConfig] = useState({
    emailBienvenida: true,
    emailPostulacionRecibida: true,
    emailEstadoCambiado: true,
    emailEntrevistaAgendada: true,
    emailOfertaPublicada: true,
    resumenSemanalAdmin: true,
    servidorSmtp: 'smtp.sendgrid.net',
    puertoSmtp: 587,
    remitenteNombre: 'Empleabilidad ELP',
    remitenteEmail: 'no-reply@elp.edu.pe',
  });

  const [sistemaConfig, setSistemaConfig] = useState({
    backupFrecuencia: 'DIARIO',
    backupHora: '02:00',
    retencionDias: 30,
    autoPurgeLogsDias: 60,
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const { data } = await usuariosPublicApi.get<Record<string, unknown>>('/admin/configuracion');
        if (!mounted) return;
        if (data.general) setGeneralConfig(current => ({ ...current, ...(data.general as Partial<typeof generalConfig>) }));
        if (data.seguridad) setSeguridadConfig(current => ({ ...current, ...(data.seguridad as Partial<typeof seguridadConfig>) }));
        if (data.empleabilidad) setEmpleabilidadConfig(current => ({ ...current, ...(data.empleabilidad as Partial<typeof empleabilidadConfig>) }));
        if (data.ia) setIaConfig(current => ({ ...current, ...(data.ia as Partial<typeof iaConfig>) }));
        if (data.notificaciones) setNotifConfig(current => ({ ...current, ...(data.notificaciones as Partial<typeof notifConfig>) }));
        if (data.sistema) setSistemaConfig(current => ({ ...current, ...(data.sistema as Partial<typeof sistemaConfig>) }));
      } catch { if (mounted) toast.error('No se pudo cargar la configuración guardada'); }
    };
    void load(); return () => { mounted = false; };
  }, []);

  const markChanged = () => setHasChanges(true);

  // Simulación de Guardado
  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setHasChanges(false);
      toast.success('Configuración guardada exitosamente');
    }, 800);
  };

  const handleSaveBackend = async () => {
    setSaving(true);
    try {
      await api.put('/admin/configuracion', { general: generalConfig, seguridad: seguridadConfig, empleabilidad: empleabilidadConfig, ia: iaConfig, notificaciones: notifConfig, sistema: sistemaConfig });
      setHasChanges(false); toast.success('Configuración guardada exitosamente');
    } catch { toast.error('No se pudo guardar la configuración'); }
    finally { setSaving(false); }
  };
  void handleSave;

  // Simulación de Reset
  const handleReset = () => {
    setHasChanges(false);
    toast('Configuraciones restauradas a valores predeterminados', {
      icon: '🔄',
    });
  };

  // Simulación Backup
  const handleBackupNow = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Generando snapshot de la base de datos...',
        success: 'Backup completado: snapshot_20260915_2008.dump (42.5 MB)',
        error: 'Error al generar backup',
      }
    );
  };

  // Simulación Limpiar Caché
  const handleClearCache = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1200)),
      {
        loading: 'Purgando caché de Redis y sesiones...',
        success: 'Caché liberada: 128 MB recuperados',
        error: 'Error al purgar la caché',
      }
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ── Header Principal ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-indigo-700 flex items-center justify-center text-white shadow-md">
            <Settings className="w-6 h-6 animate-[spin_10s_linear_infinite]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Configuración del Sistema
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                En Línea
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Administra las políticas globales, reglas de negocio, motor de IA y parámetros de la plataforma.
            </p>
          </div>
        </div>

        {/* Acciones del Header */}
        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" /> Cambios sin guardar
            </span>
          )}

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Restaurar
          </button>

          <button
            onClick={handleSaveBackend}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* ── Banner de Modo Mantenimiento Activo (si aplica) ───────────────────── */}
      {generalConfig.modoMantenimiento && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">
                ¡Atención! El modo de mantenimiento está actualmente ACTIVO
              </p>
              <p className="text-xs text-amber-700">
                Solo los administradores con rol SuperAdmin tienen acceso completo a la plataforma.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setGeneralConfig((c) => ({ ...c, modoMantenimiento: false }));
              markChanged();
              toast.success('Modo de mantenimiento desactivado');
            }}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Desactivar Ahora
          </button>
        </div>
      )}

      {/* ── Pestañas de Navegación ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center sm:items-start p-3.5 rounded-2xl border text-left transition-all relative ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div
                className={`p-2 rounded-xl mb-2 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-slate-800'}`}>
                {tab.label}
              </span>
              <span
                className={`text-[11px] mt-0.5 line-clamp-1 hidden sm:block ${
                  isActive ? 'text-indigo-100' : 'text-slate-400'
                }`}
              >
                {tab.description}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Contenido de la Pestaña Activa ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-8">
        {/* =========================================================================
            TAB 1: GENERAL
        ========================================================================= */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" /> Información General de la Plataforma
              </h2>
              <p className="text-xs text-slate-500">
                Configura los datos visibles del portal, datos de soporte y disponibilidad de registros.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Nombre de la Plataforma
                </label>
                <input
                  type="text"
                  value={generalConfig.nombrePlataforma}
                  onChange={(e) => {
                    setGeneralConfig({ ...generalConfig, nombrePlataforma: e.target.value });
                    markChanged();
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Lema / Slogan
                </label>
                <input
                  type="text"
                  value={generalConfig.lemaPlataforma}
                  onChange={(e) => {
                    setGeneralConfig({ ...generalConfig, lemaPlataforma: e.target.value });
                    markChanged();
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Correo Electrónico de Contacto
                </label>
                <input
                  type="email"
                  value={generalConfig.emailContacto}
                  onChange={(e) => {
                    setGeneralConfig({ ...generalConfig, emailContacto: e.target.value });
                    markChanged();
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Teléfono / Anexo de Soporte
                </label>
                <input
                  type="text"
                  value={generalConfig.telefonoSoporte}
                  onChange={(e) => {
                    setGeneralConfig({ ...generalConfig, telefonoSoporte: e.target.value });
                    markChanged();
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Zona Horaria Oficial
                </label>
                <select
                  value={generalConfig.zonaHoraria}
                  onChange={(e) => {
                    setGeneralConfig({ ...generalConfig, zonaHoraria: e.target.value });
                    markChanged();
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="America/Lima (UTC-5)">America/Lima (UTC-5) — Perú</option>
                  <option value="America/Bogota (UTC-5)">America/Bogota (UTC-5) — Colombia</option>
                  <option value="America/Mexico_City (UTC-6)">America/Mexico_City (UTC-6) — México</option>
                  <option value="America/Santiago (UTC-4)">America/Santiago (UTC-4) — Chile</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Idioma Predeterminado
                </label>
                <select
                  value={generalConfig.idiomaPredeterminado}
                  onChange={(e) => {
                    setGeneralConfig({ ...generalConfig, idiomaPredeterminado: e.target.value });
                    markChanged();
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="es">Español (Latinoamérica)</option>
                  <option value="en">English (US)</option>
                  <option value="pt">Português (Brasil)</option>
                </select>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Mantenimiento y Registros */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                Control de Acceso y Disponibilidad
              </h3>
              <div className="space-y-4">
                {/* Toggle Modo Mantenimiento */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Modo de Mantenimiento</p>
                      <p className="text-xs text-slate-500">
                        Bloquea el acceso temporal a estudiantes y reclutadores mostrando una pantalla explicativa.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setGeneralConfig({
                        ...generalConfig,
                        modoMantenimiento: !generalConfig.modoMantenimiento,
                      });
                      markChanged();
                    }}
                    className="text-indigo-600 hover:opacity-80 transition-opacity"
                  >
                    {generalConfig.modoMantenimiento ? (
                      <ToggleRight className="w-9 h-9 text-amber-500" />
                    ) : (
                      <ToggleLeft className="w-9 h-9 text-slate-300" />
                    )}
                  </button>
                </div>

                {generalConfig.modoMantenimiento && (
                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 animate-fadeIn">
                    <label className="block text-xs font-bold text-amber-900 mb-1">
                      Mensaje de Mantenimiento para los Usuarios
                    </label>
                    <textarea
                      rows={2}
                      value={generalConfig.mensajeMantenimiento}
                      onChange={(e) => {
                        setGeneralConfig({ ...generalConfig, mensajeMantenimiento: e.target.value });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-amber-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                )}

                {/* Toggles Registros */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Registro de Estudiantes</p>
                      <p className="text-xs text-slate-500">Permitir que nuevos estudiantes creen cuentas.</p>
                    </div>
                    <button
                      onClick={() => {
                        setGeneralConfig({
                          ...generalConfig,
                          registroAbiertoEstudiantes: !generalConfig.registroAbiertoEstudiantes,
                        });
                        markChanged();
                      }}
                    >
                      {generalConfig.registroAbiertoEstudiantes ? (
                        <ToggleRight className="w-9 h-9 text-indigo-600" />
                      ) : (
                        <ToggleLeft className="w-9 h-9 text-slate-300" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Registro de Empresas</p>
                      <p className="text-xs text-slate-500">Permitir que nuevas empresas se registren para publicar.</p>
                    </div>
                    <button
                      onClick={() => {
                        setGeneralConfig({
                          ...generalConfig,
                          registroAbiertoEmpresas: !generalConfig.registroAbiertoEmpresas,
                        });
                        markChanged();
                      }}
                    >
                      {generalConfig.registroAbiertoEmpresas ? (
                        <ToggleRight className="w-9 h-9 text-indigo-600" />
                      ) : (
                        <ToggleLeft className="w-9 h-9 text-slate-300" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: SEGURIDAD
        ========================================================================= */}
        {activeTab === 'seguridad' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" /> Políticas de Seguridad & Autenticación
              </h2>
              <p className="text-xs text-slate-500">
                Reglas para robustecer credenciales, sesiones concurrentes y autenticación multifactor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-600" /> Reglas de Contraseña
                </h3>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Longitud Mínima</span>
                    <span className="text-indigo-600">{seguridadConfig.longitudMinPassword} caracteres</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="16"
                    value={seguridadConfig.longitudMinPassword}
                    onChange={(e) => {
                      setSeguridadConfig({
                        ...seguridadConfig,
                        longitudMinPassword: Number(e.target.value),
                      });
                      markChanged();
                    }}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-xs font-semibold text-slate-700">Requerir caracteres especiales</span>
                  <button
                    onClick={() => {
                      setSeguridadConfig({
                        ...seguridadConfig,
                        requiereEspeciales: !seguridadConfig.requiereEspeciales,
                      });
                      markChanged();
                    }}
                  >
                    {seguridadConfig.requiereEspeciales ? (
                      <ToggleRight className="w-8 h-8 text-indigo-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-300" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-xs font-semibold text-slate-700">Requerir números obligatorios</span>
                  <button
                    onClick={() => {
                      setSeguridadConfig({
                        ...seguridadConfig,
                        requiereNumeros: !seguridadConfig.requiereNumeros,
                      });
                      markChanged();
                    }}
                  >
                    {seguridadConfig.requiereNumeros ? (
                      <ToggleRight className="w-8 h-8 text-indigo-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-300" />
                    )}
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Expiración de Contraseña (Días)
                  </label>
                  <select
                    value={seguridadConfig.expiracionPasswordDias}
                    onChange={(e) => {
                      setSeguridadConfig({
                        ...seguridadConfig,
                        expiracionPasswordDias: Number(e.target.value),
                      });
                      markChanged();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800"
                  >
                    <option value={30}>Cada 30 días</option>
                    <option value={60}>Cada 60 días</option>
                    <option value={90}>Cada 90 días (Recomendado)</option>
                    <option value={180}>Cada 180 días</option>
                    <option value={0}>Nunca expira</option>
                  </select>
                </div>
              </div>

              {/* Sesión y MFA */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-indigo-600" /> Sesiones & Doble Factor (2FA)
                </h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">2FA Obligatorio para Admins</p>
                    <p className="text-[11px] text-slate-500">Uso de Google Authenticator o correo</p>
                  </div>
                  <button
                    onClick={() => {
                      setSeguridadConfig({
                        ...seguridadConfig,
                        mfaObligatorioAdmin: !seguridadConfig.mfaObligatorioAdmin,
                      });
                      markChanged();
                    }}
                  >
                    {seguridadConfig.mfaObligatorioAdmin ? (
                      <ToggleRight className="w-8 h-8 text-indigo-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-300" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <div>
                    <p className="text-xs font-bold text-slate-800">2FA Opcional para Empresas</p>
                    <p className="text-[11px] text-slate-500">Permitir a reclutadores activar 2FA</p>
                  </div>
                  <button
                    onClick={() => {
                      setSeguridadConfig({
                        ...seguridadConfig,
                        mfaOpcionalEmpresas: !seguridadConfig.mfaOpcionalEmpresas,
                      });
                      markChanged();
                    }}
                  >
                    {seguridadConfig.mfaOpcionalEmpresas ? (
                      <ToggleRight className="w-8 h-8 text-indigo-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-300" />
                    )}
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tiempo de Inactividad de Sesión (Minutos)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={seguridadConfig.tiempoInactividadMin}
                    onChange={(e) => {
                      setSeguridadConfig({
                        ...seguridadConfig,
                        tiempoInactividadMin: Number(e.target.value),
                      });
                      markChanged();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Intentos Fallidos antes de Bloqueo
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={seguridadConfig.maxIntentosLogin}
                    onChange={(e) => {
                      setSeguridadConfig({
                        ...seguridadConfig,
                        maxIntentosLogin: Number(e.target.value),
                      });
                      markChanged();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Dominio Institucional */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 text-white rounded-xl">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-950">Restricción de Dominio Institucional</p>
                  <p className="text-xs text-blue-700">
                    Exigir que los estudiantes se registren exclusivamente con su correo institucional.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={seguridadConfig.dominioPermitido}
                  disabled={!seguridadConfig.dominioInstitucionalExclusivo}
                  onChange={(e) => {
                    setSeguridadConfig({ ...seguridadConfig, dominioPermitido: e.target.value });
                    markChanged();
                  }}
                  className="px-3 py-1.5 rounded-lg border border-blue-200 text-xs font-mono font-bold text-blue-900 bg-white"
                />
                <button
                  onClick={() => {
                    setSeguridadConfig({
                      ...seguridadConfig,
                      dominioInstitucionalExclusivo: !seguridadConfig.dominioInstitucionalExclusivo,
                    });
                    markChanged();
                  }}
                >
                  {seguridadConfig.dominioInstitucionalExclusivo ? (
                    <ToggleRight className="w-8 h-8 text-blue-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-300" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: EMPLEABILIDAD & REGLAS
        ========================================================================= */}
        {activeTab === 'empleabilidad' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" /> Reglas de Negocio para Empleabilidad
              </h2>
              <p className="text-xs text-slate-500">
                Límites para estudiantes, validación de ofertas de empresas y parámetros del pipeline.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-indigo-600" /> Parámetros de Postulaciones
                </h3>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Máximo de Postulaciones Activas por Candidato</span>
                    <span className="text-indigo-600 font-extrabold">
                      {empleabilidadConfig.maxPostulacionesActivas} simultáneas
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={empleabilidadConfig.maxPostulacionesActivas}
                    onChange={(e) => {
                      setEmpleabilidadConfig({
                        ...empleabilidadConfig,
                        maxPostulacionesActivas: Number(e.target.value),
                      });
                      markChanged();
                    }}
                    className="w-full accent-indigo-600"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Evita postulaciones masivas sin interés real en la posición.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Permitir Postular sin CV adjunto</p>
                    <p className="text-[11px] text-slate-500">Usa solo el perfil generado en el sistema</p>
                  </div>
                  <button
                    onClick={() => {
                      setEmpleabilidadConfig({
                        ...empleabilidadConfig,
                        permitirPostulacionSinCV: !empleabilidadConfig.permitirPostulacionSinCV,
                      });
                      markChanged();
                    }}
                  >
                    {empleabilidadConfig.permitirPostulacionSinCV ? (
                      <ToggleRight className="w-8 h-8 text-indigo-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-300" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Múltiples postulaciones a la misma oferta</p>
                    <p className="text-[11px] text-slate-500">Si un candidato fue descartado previamente</p>
                  </div>
                  <button
                    onClick={() => {
                      setEmpleabilidadConfig({
                        ...empleabilidadConfig,
                        permitirMultiplesPostulacionesMismaOferta:
                          !empleabilidadConfig.permitirMultiplesPostulacionesMismaOferta,
                      });
                      markChanged();
                    }}
                  >
                    {empleabilidadConfig.permitirMultiplesPostulacionesMismaOferta ? (
                      <ToggleRight className="w-8 h-8 text-indigo-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Parámetros de Ofertas y Entrevistas */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building className="w-4 h-4 text-indigo-600" /> Parámetros de Empresas & Entrevistas
                </h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Aprobación Previa de Ofertas</p>
                    <p className="text-[11px] text-slate-500">
                      Un admin debe aprobar la oferta antes de publicarla
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEmpleabilidadConfig({
                        ...empleabilidadConfig,
                        aprobacionPreviaOfertas: !empleabilidadConfig.aprobacionPreviaOfertas,
                      });
                      markChanged();
                    }}
                  >
                    {empleabilidadConfig.aprobacionPreviaOfertas ? (
                      <ToggleRight className="w-8 h-8 text-indigo-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-300" />
                    )}
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Días de Vigencia por Defecto de una Oferta
                  </label>
                  <select
                    value={empleabilidadConfig.diasExpiracionOferta}
                    onChange={(e) => {
                      setEmpleabilidadConfig({
                        ...empleabilidadConfig,
                        diasExpiracionOferta: Number(e.target.value),
                      });
                      markChanged();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800"
                  >
                    <option value={15}>15 días</option>
                    <option value={30}>30 días (1 mes)</option>
                    <option value={45}>45 días</option>
                    <option value={60}>60 días (2 meses)</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Plazo Límite para Agendar Entrevista (Días)
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="30"
                    value={empleabilidadConfig.diasLimiteEntrevista}
                    onChange={(e) => {
                      setEmpleabilidadConfig({
                        ...empleabilidadConfig,
                        diasLimiteEntrevista: Number(e.target.value),
                      });
                      markChanged();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Tiempo que tiene la empresa desde la preselección para citar al candidato.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: MOTOR IA GEMINI
        ========================================================================= */}
        {activeTab === 'ia' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" /> Configuración del Motor Gemini AI
                </h2>
                <p className="text-xs text-slate-500">
                  Ajustes para el análisis semántico de CVs, cálculo de compatibilidad y generación de reportes.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Motor Activo (API Conectada)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md">
                    <Cpu className="w-6 h-6 text-indigo-200" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">Google Gemini 1.5 Pro / Flash</h3>
                    <p className="text-xs text-indigo-200">
                      Latencia promedio: 240ms · 99.98% de disponibilidad · Token quota: 85% libre
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    toast.success('Prueba de conexión con Gemini AI exitosa (Respuesta en 198ms)');
                  }}
                  className="px-4 py-2 bg-white text-indigo-900 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors shadow-sm"
                >
                  Probar Conexión
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" /> Parámetros de Matching
                </h3>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Umbral Mínimo de Compatibilidad Sugerida</span>
                    <span className="text-indigo-600 font-extrabold">{iaConfig.umbralMatchMinimo}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="90"
                    value={iaConfig.umbralMatchMinimo}
                    onChange={(e) => {
                      setIaConfig({ ...iaConfig, umbralMatchMinimo: Number(e.target.value) });
                      markChanged();
                    }}
                    className="w-full accent-indigo-600"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Los candidatos por debajo de este score no recibirán recomendación automática prioritaria.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Modelo de Lenguaje Asignado
                  </label>
                  <select
                    value={iaConfig.modeloActivo}
                    onChange={(e) => {
                      setIaConfig({ ...iaConfig, modeloActivo: e.target.value });
                      markChanged();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800"
                  >
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultrarrápido y eficiente)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Máxima precisión para cargos sénior)</option>
                    <option value="gemini-pro">Gemini 1.0 Pro (Compatibilidad clásica)</option>
                  </select>
                </div>
              </div>

              {/* Capacidades Autónomas */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-600" /> Funciones Autónomas de la IA
                </h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Análisis Automático de CV al Subir</p>
                    <p className="text-[11px] text-slate-500">Extrae habilidades, experiencia e idiomas en segundos</p>
                  </div>
                  <button
                    onClick={() => {
                      setIaConfig({ ...iaConfig, analisisAutomaticoCV: !iaConfig.analisisAutomaticoCV });
                      markChanged();
                    }}
                  >
                    {iaConfig.analisisAutomaticoCV ? (
                      <ToggleRight className="w-8 h-8 text-indigo-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-300" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Generar Resumen de Compatibilidad</p>
                    <p className="text-[11px] text-slate-500">Muestra a las empresas puntos fuertes y gaps del postulante</p>
                  </div>
                  <button
                    onClick={() => {
                      setIaConfig({
                        ...iaConfig,
                        generarResumenCompatibilidad: !iaConfig.generarResumenCompatibilidad,
                      });
                      markChanged();
                    }}
                  >
                    {iaConfig.generarResumenCompatibilidad ? (
                      <ToggleRight className="w-8 h-8 text-indigo-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-300" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Sugerir Preguntas para Entrevista</p>
                    <p className="text-[11px] text-slate-500">Preguntas técnicas basadas en el perfil de la oferta</p>
                  </div>
                  <button
                    onClick={() => {
                      setIaConfig({
                        ...iaConfig,
                        sugerirPreguntasEntrevista: !iaConfig.sugerirPreguntasEntrevista,
                      });
                      markChanged();
                    }}
                  >
                    {iaConfig.sugerirPreguntasEntrevista ? (
                      <ToggleRight className="w-8 h-8 text-indigo-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: NOTIFICACIONES & CORREO
        ========================================================================= */}
        {activeTab === 'notificaciones' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-600" /> Canales de Notificación y Servidor SMTP
              </h2>
              <p className="text-xs text-slate-500">
                Ajusta las notificaciones automáticas por correo electrónico y el servidor de envíos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600" /> Servidor SMTP de Correo Saliente
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Host SMTP</label>
                  <input
                    type="text"
                    value={notifConfig.servidorSmtp}
                    onChange={(e) => {
                      setNotifConfig({ ...notifConfig, servidorSmtp: e.target.value });
                      markChanged();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-semibold bg-white text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Puerto SMTP</label>
                    <input
                      type="number"
                      value={notifConfig.puertoSmtp}
                      onChange={(e) => {
                        setNotifConfig({ ...notifConfig, puertoSmtp: Number(e.target.value) });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-semibold bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Seguridad</label>
                    <select className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800">
                      <option>STARTTLS</option>
                      <option>SSL/TLS</option>
                      <option>Ninguna</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Remitente</label>
                  <input
                    type="text"
                    value={notifConfig.remitenteNombre}
                    onChange={(e) => {
                      setNotifConfig({ ...notifConfig, remitenteNombre: e.target.value });
                      markChanged();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Remitente</label>
                  <input
                    type="email"
                    value={notifConfig.remitenteEmail}
                    onChange={(e) => {
                      setNotifConfig({ ...notifConfig, remitenteEmail: e.target.value });
                      markChanged();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800"
                  />
                </div>

                <button
                  onClick={() => {
                    toast.promise(
                      new Promise((resolve) => setTimeout(resolve, 1500)),
                      {
                        loading: 'Enviando correo de prueba...',
                        success: 'Correo de prueba enviado con éxito a tu bandeja',
                        error: 'Error al enviar correo',
                      }
                    );
                  }}
                  className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors border border-indigo-200"
                >
                  Enviar Email de Prueba
                </button>
              </div>

              {/* Eventos Disparadores */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                  <Bell className="w-4 h-4 text-indigo-600" /> Notificaciones Transaccionales
                </h3>

                {[
                  {
                    key: 'emailBienvenida',
                    label: 'Bienvenida a nuevos usuarios',
                    desc: 'Correo de confirmación al registrarse estudiante o empresa',
                  },
                  {
                    key: 'emailPostulacionRecibida',
                    label: 'Postulación Recibida',
                    desc: 'Notifica al candidato que su postulación ingresó exitosamente',
                  },
                  {
                    key: 'emailEstadoCambiado',
                    label: 'Cambio de Estado de Postulación',
                    desc: 'Alerta cuando pasa a Preseleccionado, Entrevista o Descartado',
                  },
                  {
                    key: 'emailEntrevistaAgendada',
                    label: 'Entrevista Programada',
                    desc: 'Envía invitación con fecha, hora y enlace de videoconferencia',
                  },
                  {
                    key: 'emailOfertaPublicada',
                    label: 'Aprobación / Publicación de Oferta',
                    desc: 'Notifica a la empresa cuando su oferta fue aprobada por el admin',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">{item.label}</p>
                      <p className="text-[10px] text-slate-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => {
                        setNotifConfig({
                          ...notifConfig,
                          [item.key]: !(notifConfig as any)[item.key],
                        });
                        markChanged();
                      }}
                    >
                      {(notifConfig as any)[item.key] ? (
                        <ToggleRight className="w-7 h-7 text-indigo-600" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-slate-300" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: SISTEMA & BACKUPS
        ========================================================================= */}
        {activeTab === 'sistema' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" /> Salud del Sistema & Almacenamiento
              </h2>
              <p className="text-xs text-slate-500">
                Monitoreo de bases de datos, copias de seguridad automatizadas y optimización de caché.
              </p>
            </div>

            {/* Tarjetas de Recursos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600">Base de Datos PostgreSQL</span>
                  <Database className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-2xl font-black text-slate-900">1.4 GB</p>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '28%' }} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">28% de 5 GB asignados</p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600">Caché Redis / Sesiones</span>
                  <Zap className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-2xl font-black text-slate-900">142 MB</p>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '14%' }} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">14% de 1 GB asignado</p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600">Archivos & CVs (Storage)</span>
                  <HardDrive className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-black text-slate-900">8.2 GB</p>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '41%' }} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">41% de 20 GB en S3/Cloud</p>
              </div>
            </div>

            {/* Backups */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Copias de Seguridad Automatizadas</h3>
                  <p className="text-xs text-slate-500">
                    Último backup exitoso: Hoy a las 02:00 AM · Tamaño: 41.8 MB · Estado: Verificado
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBackupNow}
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" /> Generar Backup Manual
                  </button>
                  <button
                    onClick={handleClearCache}
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Purgar Caché
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Frecuencia</label>
                  <select
                    value={sistemaConfig.backupFrecuencia}
                    onChange={(e) => {
                      setSistemaConfig({ ...sistemaConfig, backupFrecuencia: e.target.value });
                      markChanged();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800"
                  >
                    <option value="DIARIO">Diario (Madrugada)</option>
                    <option value="SEMANAL">Semanal (Domingos)</option>
                    <option value="CADA_12H">Cada 12 Horas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hora de Ejecución</label>
                  <input
                    type="time"
                    value={sistemaConfig.backupHora}
                    onChange={(e) => {
                      setSistemaConfig({ ...sistemaConfig, backupHora: e.target.value });
                      markChanged();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Retención de Snapshots
                  </label>
                  <select
                    value={sistemaConfig.retencionDias}
                    onChange={(e) => {
                      setSistemaConfig({ ...sistemaConfig, retencionDias: Number(e.target.value) });
                      markChanged();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800"
                  >
                    <option value={15}>15 días</option>
                    <option value={30}>30 días (1 mes)</option>
                    <option value={90}>90 días (3 meses)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer de Estado y Guardado Rápido ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-900 text-white rounded-2xl shadow-lg gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-xs text-slate-300">
            Versión del sistema: <span className="font-mono text-white font-bold">v2.4.0-build.2026</span> ·
            Microservicios: <span className="text-emerald-400 font-semibold">100% Operativos</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveBackend}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-sm"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            Aplicar Todas las Configuraciones
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminConfiguracionView;
