import {
  User,
  Mail,
  Lock,
  Bell,
  Shield,
  LogOut,
  Camera,
  ChevronRight,
  Eye,
  EyeOff,
  CheckCircle,
  X,
  Smartphone,
  Globe,
  Trash2,
} from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../NavbarComponent/Navbar";

export default function SettingsPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sección activa
  const [seccion, setSeccion] = useState<"perfil" | "notificaciones" | "privacidad" | "cuenta">("perfil");

  // Perfil
  const [nombre, setNombre] = useState(user.nombre || "");
  const [email, setEmail] = useState(user.email || "");
  const [imagenPreview, setImagenPreview] = useState(user.imagen || "");
  const [imagenBase64, setImagenBase64] = useState("");
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);
  const [perfilGuardado, setPerfilGuardado] = useState(false);
  const [errorPerfil, setErrorPerfil] = useState("");

  // Contraseña
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirmar, setPasswordConfirmar] = useState("");
  const [mostrarPassActual, setMostrarPassActual] = useState(false);
  const [mostrarPassNueva, setMostrarPassNueva] = useState(false);
  const [mostrarPassConfirmar, setMostrarPassConfirmar] = useState(false);
  const [guardandoPass, setGuardandoPass] = useState(false);
  const [passGuardada, setPassGuardada] = useState(false);
  const [errorPass, setErrorPass] = useState("");

  // Notificaciones
  const [notifVacunas, setNotifVacunas] = useState(true);
  const [notifRecordatorios, setNotifRecordatorios] = useState(true);
  const [notifAlertas, setNotifAlertas] = useState(true);
  const [notifMascotasPerdidas, setNotifMascotasPerdidas] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);

  // Privacidad
  const [perfilPublico, setPerfilPublico] = useState(true);
  const [mostrarContacto, setMostrarContacto] = useState(true);
  const [mostrarUbicacion, setMostrarUbicacion] = useState(false);

  // Cuenta
  const [modalEliminar, setModalEliminar] = useState(false);
  const [confirmEliminar, setConfirmEliminar] = useState("");

  const avatarSrc = imagenPreview || "https://i.pinimg.com/736x/08/0a/fb/080afbcc2ed1022bbdc59446190164d8.jpg";

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrorPerfil("La imagen no puede superar los 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagenPreview(base64);
      setImagenBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const guardarPerfil = async () => {
    setErrorPerfil("");
    setGuardandoPerfil(true);
    try {
      const token = localStorage.getItem("token");
      const body: any = { nombre, email };
      if (imagenBase64) body.imagen = imagenBase64;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/perfil`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        setErrorPerfil(err.msg || "Error al guardar.");
        return;
      }

      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data.usuario));
      setPerfilGuardado(true);
      setTimeout(() => setPerfilGuardado(false), 3000);
    } catch {
      setErrorPerfil("Error de conexión.");
    } finally {
      setGuardandoPerfil(false);
    }
  };

  const guardarPassword = async () => {
    setErrorPass("");
    if (!passwordNueva || !passwordConfirmar) {
      setErrorPass("Completa todos los campos.");
      return;
    }
    if (passwordNueva !== passwordConfirmar) {
      setErrorPass("Las contraseñas no coinciden.");
      return;
    }
    if (passwordNueva.length < 6) {
      setErrorPass("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setGuardandoPass(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/perfil`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password: passwordNueva }),
      });

      if (!res.ok) {
        const err = await res.json();
        setErrorPass(err.msg || "Error al cambiar contraseña.");
        return;
      }

      setPasswordActual("");
      setPasswordNueva("");
      setPasswordConfirmar("");
      setPassGuardada(true);
      setTimeout(() => setPassGuardada(false), 3000);
    } catch {
      setErrorPass("Error de conexión.");
    } finally {
      setGuardandoPass(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const secciones = [
    { id: "perfil", label: "Perfil", icon: User, color: "text-blue-600", bg: "bg-blue-100" },
    { id: "notificaciones", label: "Notificaciones", icon: Bell, color: "text-purple-600", bg: "bg-purple-100" },
    { id: "privacidad", label: "Privacidad", icon: Shield, color: "text-orange-600", bg: "bg-orange-100" },
    { id: "cuenta", label: "Cuenta", icon: Smartphone, color: "text-slate-600", bg: "bg-slate-100" },
  ] as const;

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors ${value ? "bg-blue-600" : "bg-slate-200"}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5.5 left-0.5" : "left-0.5"}`}
        style={{ transform: value ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navbar title="Configuración" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

              {/* Avatar mini */}
              <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                <img
                  src={avatarSrc}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">{user.nombre || "Usuario"}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email || ""}</p>
                </div>
              </div>

              {/* Menú */}
              <nav className="p-3 space-y-1">
                {secciones.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSeccion(s.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      seccion === s.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      seccion === s.id ? "bg-white/20" : s.bg
                    }`}>
                      <s.icon className={`w-4 h-4 ${seccion === s.id ? "text-white" : s.color}`} />
                    </div>
                    {s.label}
                  </button>
                ))}

                <div className="pt-2 border-t border-slate-100 mt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                  >
                    <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                      <LogOut className="w-4 h-4 text-red-600" />
                    </div>
                    Cerrar sesión
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* CONTENIDO */}
          <div className="lg:col-span-3 space-y-6">

            {/* ── PERFIL ── */}
            {seccion === "perfil" && (
              <>
                {/* Información personal */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Información Personal
                  </h2>

                  {/* Avatar */}
                  <div className="flex items-center gap-5 mb-6 pb-6 border-b border-slate-100">
                    <div className="relative">
                      <img
                        src={imagenPreview || avatarSrc}
                        alt="avatar"
                        className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 shadow-md"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow-lg transition"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImagenChange} />
                    <div>
                      <p className="font-semibold text-slate-900">{user.nombre}</p>
                      <p className="text-sm text-slate-500 mt-0.5">Máximo 2MB</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Cambiar foto
                      </button>
                    </div>
                  </div>

                  {/* Campos */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Nombre completo</label>
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Correo electrónico</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                        />
                      </div>
                    </div>
                  </div>

                  {errorPerfil && (
                    <p className="text-sm text-red-500 font-medium mt-3">{errorPerfil}</p>
                  )}

                  {perfilGuardado && (
                    <div className="flex items-center gap-2 mt-3 text-emerald-600 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" /> Perfil actualizado correctamente
                    </div>
                  )}

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={guardarPerfil}
                      disabled={guardandoPerfil}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition disabled:opacity-60"
                    >
                      {guardandoPerfil ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </div>
                </div>

                {/* Cambiar contraseña */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-600" />
                    Cambiar Contraseña
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Contraseña actual</label>
                      <div className="relative">
                        <input
                          type={mostrarPassActual ? "text" : "password"}
                          value={passwordActual}
                          onChange={(e) => setPasswordActual(e.target.value)}
                          placeholder="••••••••"
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <button onClick={() => setMostrarPassActual(!mostrarPassActual)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {mostrarPassActual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Nueva contraseña</label>
                      <div className="relative">
                        <input
                          type={mostrarPassNueva ? "text" : "password"}
                          value={passwordNueva}
                          onChange={(e) => setPasswordNueva(e.target.value)}
                          placeholder="••••••••"
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <button onClick={() => setMostrarPassNueva(!mostrarPassNueva)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {mostrarPassNueva ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Confirmar nueva contraseña</label>
                      <div className="relative">
                        <input
                          type={mostrarPassConfirmar ? "text" : "password"}
                          value={passwordConfirmar}
                          onChange={(e) => setPasswordConfirmar(e.target.value)}
                          placeholder="••••••••"
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <button onClick={() => setMostrarPassConfirmar(!mostrarPassConfirmar)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {mostrarPassConfirmar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {errorPass && <p className="text-sm text-red-500 font-medium mt-3">{errorPass}</p>}

                  {passGuardada && (
                    <div className="flex items-center gap-2 mt-3 text-emerald-600 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" /> Contraseña actualizada correctamente
                    </div>
                  )}

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={guardarPassword}
                      disabled={guardandoPass}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition disabled:opacity-60"
                    >
                      {guardandoPass ? "Guardando..." : "Cambiar contraseña"}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── NOTIFICACIONES ── */}
            {seccion === "notificaciones" && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-600" />
                  Notificaciones
                </h2>

                <div className="space-y-1">
                  {[
                    { label: "Recordatorios de vacunas", desc: "Avísame cuando una vacuna esté próxima a vencer", value: notifVacunas, onChange: () => setNotifVacunas(!notifVacunas) },
                    { label: "Recordatorios generales", desc: "Notificaciones de controles y medicación", value: notifRecordatorios, onChange: () => setNotifRecordatorios(!notifRecordatorios) },
                    { label: "Alertas críticas", desc: "Alertas cuando un recordatorio ya venció", value: notifAlertas, onChange: () => setNotifAlertas(!notifAlertas) },
                    { label: "Mascotas perdidas", desc: "Notificaciones de nuevos reportes de mascotas perdidas", value: notifMascotasPerdidas, onChange: () => setNotifMascotasPerdidas(!notifMascotasPerdidas) },
                    { label: "Notificaciones por correo", desc: "Recibir resumen semanal en tu email", value: notifEmail, onChange: () => setNotifEmail(!notifEmail) },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{item.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                      <Toggle value={item.value} onChange={item.onChange} />
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-2xl flex items-start gap-3">
                  <Bell className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">Las notificaciones se guardan localmente en este dispositivo. Próximamente disponible en todos tus dispositivos.</p>
                </div>
              </div>
            )}

            {/* ── PRIVACIDAD ── */}
            {seccion === "privacidad" && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-600" />
                  Privacidad y Seguridad
                </h2>

                <div className="space-y-1 mb-6">
                  {[
                    { label: "Perfil público", desc: "Otros usuarios pueden ver tu perfil", value: perfilPublico, onChange: () => setPerfilPublico(!perfilPublico) },
                    { label: "Mostrar contacto", desc: "Tu número de contacto es visible en reportes", value: mostrarContacto, onChange: () => setMostrarContacto(!mostrarContacto) },
                    { label: "Mostrar ubicación", desc: "Tu ubicación aparece en el mapa de mascotas perdidas", value: mostrarUbicacion, onChange: () => setMostrarUbicacion(!mostrarUbicacion) },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{item.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                      <Toggle value={item.value} onChange={item.onChange} />
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-500" />
                    Sesiones activas
                  </h3>
                  <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Globe className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Sesión actual</p>
                        <p className="text-xs text-slate-500">Navegador web</p>
                      </div>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-600 font-semibold px-2 py-1 rounded-full">Activa</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── CUENTA ── */}
            {seccion === "cuenta" && (
              <div className="space-y-6">

                {/* Info de cuenta */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-slate-600" />
                    Información de la Cuenta
                  </h2>

                  <div className="space-y-3">
                    {[
                      { label: "Nombre de usuario", value: user.nombre || "—" },
                      { label: "Correo electrónico", value: user.email || "—" },
                      { label: "Plan", value: "Gratuito" },
                      { label: "Miembro desde", value: "Mayo 2026" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <span className="text-sm text-slate-500 font-medium">{item.label}</span>
                        <span className="text-sm font-semibold text-slate-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acciones rápidas */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Acciones</h2>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSeccion("perfil")}
                      className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-blue-50 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-semibold text-slate-900">Editar perfil</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-red-50 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
                          <LogOut className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="text-sm font-semibold text-red-600">Cerrar sesión</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-red-300" />
                    </button>

                    <button
                      onClick={() => setModalEliminar(true)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-red-50 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="text-left">
                          <span className="text-sm font-semibold text-red-600 block">Eliminar cuenta</span>
                          <span className="text-xs text-slate-400">Esta acción no se puede deshacer</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-red-300" />
                    </button>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-slate-400 pb-4">
                  <p>CatDog v1.0.0 — © 2026 Cuidado integral para tus mascotas</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL ELIMINAR CUENTA */}
      {modalEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Eliminar cuenta</h2>
              <button onClick={() => setModalEliminar(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5">
              <p className="text-sm text-red-700 font-medium">⚠️ Esta acción eliminará permanentemente tu cuenta y todos tus datos, incluyendo mascotas, recordatorios y reportes. No se puede deshacer.</p>
            </div>

            <div className="mb-5">
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Escribe <span className="text-red-600 font-bold">ELIMINAR</span> para confirmar
              </label>
              <input
                type="text"
                value={confirmEliminar}
                onChange={(e) => setConfirmEliminar(e.target.value)}
                placeholder="ELIMINAR"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setModalEliminar(false); setConfirmEliminar(""); }} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium transition">
                Cancelar
              </button>
              <button
                disabled={confirmEliminar !== "ELIMINAR"}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Eliminar cuenta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}