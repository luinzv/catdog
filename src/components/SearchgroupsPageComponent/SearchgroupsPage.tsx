import {
  Users,
  Plus,
  Search,
  MapPin,
  Send,
  Shield,
  LogOut,
  X,
  UserPlus,
  Crown,
  Lock,
  CheckCircle,
  ArrowLeft,
  MoreVertical,
  Trash2,
  Loader2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Navbar from "../NavbarComponent/Navbar";

type Usuario = {
  _id: string;
  nombre: string;
  email: string;
  imagen?: string;
};

type Miembro = {
  usuario: Usuario;
  rol: "admin" | "miembro";
};

type MascotaPerdida = {
  _id: string;
  nombre: string;
  tipo: string;
  imagen?: string;
  estado: string;
};

type Grupo = {
  _id: string;
  nombre: string;
  descripcion: string;
  creador: Usuario;
  miembros: Miembro[];
  mascotaPerdida?: MascotaPerdida | null;
  estado: "Activo" | "Cerrado";
  createdAt: string;
};

type Ubicacion = {
  lat: number;
  lng: number;
  direccion?: string;
};

type Aviso = {
  _id: string;
  autor: Usuario;
  contenido: string;
  createdAt: string;
  tipo?: "texto" | "ubicacion";
  ubicacion?: Ubicacion;
};

type Amistad = {
  _id: string;
  solicitante: Usuario;
  receptor: Usuario;
  estado: string;
};

const AVATAR = "https://i.pinimg.com/736x/08/0a/fb/080afbcc2ed1022bbdc59446190164d8.jpg";

export default function SearchGroupsPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id || user.id;
  const token = localStorage.getItem("token");
  const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loadingGrupos, setLoadingGrupos] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [grupoActivo, setGrupoActivo] = useState<Grupo | null>(null);

  const [amigos, setAmigos] = useState<Usuario[]>([]);
  const [mascotasPerdidas, setMascotasPerdidas] = useState<MascotaPerdida[]>([]);

  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loadingAvisos, setLoadingAvisos] = useState(false);
  const [nuevoAviso, setNuevoAviso] = useState("");
  const [enviandoAviso, setEnviandoAviso] = useState(false);

  // ── Compartir ubicación en el grupo ──
  const [obteniendoUbicacionGrupo, setObteniendoUbicacionGrupo] = useState(false);
  const [errorUbicacionGrupo, setErrorUbicacionGrupo] = useState("");

  const [showModalCrear, setShowModalCrear] = useState(false);
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [descripcionGrupo, setDescripcionGrupo] = useState("");
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState("");
  const [invitadosSeleccionados, setInvitadosSeleccionados] = useState<Set<string>>(new Set());
  const [creando, setCreando] = useState(false);

  const [showModalInvitar, setShowModalInvitar] = useState(false);
  const [showMenuMiembro, setShowMenuMiembro] = useState<string | null>(null);

  const [toast, setToast] = useState<{ msg: string; tipo: "ok" | "err" } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const mostrarToast = (msg: string, tipo: "ok" | "err" = "ok") => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Cargar datos base ────────────────────────────────

  const cargarGrupos = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/grupos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setGrupos(Array.isArray(data) ? data : []);
    } catch {
      mostrarToast("Error al cargar los grupos", "err");
    } finally {
      setLoadingGrupos(false);
    }
  };

  const cargarAmigos = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/amistades`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: Amistad[] = await res.json();
      const lista = (Array.isArray(data) ? data : []).map((a) =>
        a.solicitante._id === userId ? a.receptor : a.solicitante
      );
      setAmigos(lista);
    } catch {
      mostrarToast("Error al cargar amistades", "err");
    }
  };

  const cargarMascotasPerdidas = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas-perdidas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const propias = (Array.isArray(data) ? data : []).filter(
        (m: any) => (m.usuario?._id || m.usuario) === userId
      );
      setMascotasPerdidas(propias);
    } catch {
      // silencioso, es opcional
    }
  };

  useEffect(() => {
    cargarGrupos();
    cargarAmigos();
    cargarMascotasPerdidas();
    const interval = setInterval(cargarGrupos, 10000);
    return () => clearInterval(interval);
  }, []);

  // ── Avisos del grupo activo (con polling) ───────────

  const cargarAvisos = async (grupoId: string, mostrarLoading = false) => {
    if (mostrarLoading) setLoadingAvisos(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/grupos/${grupoId}/avisos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAvisos(Array.isArray(data) ? data : []);
    } catch {
      mostrarToast("Error al cargar los avisos", "err");
    } finally {
      if (mostrarLoading) setLoadingAvisos(false);
    }
  };

  useEffect(() => {
    if (!grupoActivo) return;
    cargarAvisos(grupoActivo._id, true);
    const interval = setInterval(() => cargarAvisos(grupoActivo._id, false), 5000);
    return () => clearInterval(interval);
  }, [grupoActivo?._id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [avisos]);

  // ── Crear grupo ──────────────────────────────────────

  const limpiarModalCrear = () => {
    setNombreGrupo("");
    setDescripcionGrupo("");
    setMascotaSeleccionada("");
    setInvitadosSeleccionados(new Set());
  };

  const toggleInvitado = (id: string) => {
    setInvitadosSeleccionados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCrearGrupo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreGrupo.trim()) {
      mostrarToast("El nombre del grupo es obligatorio", "err");
      return;
    }

    setCreando(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/grupos`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          nombre: nombreGrupo.trim(),
          descripcion: descripcionGrupo.trim(),
          mascotaPerdida: mascotaSeleccionada || null,
          invitados: Array.from(invitadosSeleccionados),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al crear el grupo");
      setGrupos((prev) => [data, ...prev]);
      limpiarModalCrear();
      setShowModalCrear(false);
      mostrarToast("Grupo creado con éxito");
    } catch (err: any) {
      mostrarToast(err.message, "err");
    } finally {
      setCreando(false);
    }
  };

  // ── Acciones sobre el grupo activo ───────────────────

  const miRol = (grupo: Grupo) =>
    grupo.miembros.find((m) => m.usuario._id === userId)?.rol || null;

  const handleInvitar = async (usuarioId: string) => {
    if (!grupoActivo) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/grupos/${grupoActivo._id}/invitar`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ usuarioId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al invitar");
      setGrupoActivo(data);
      setGrupos((prev) => prev.map((g) => (g._id === data._id ? data : g)));
      mostrarToast("Miembro invitado");
    } catch (err: any) {
      mostrarToast(err.message, "err");
    }
  };

  const handleExpulsar = async (usuarioId: string) => {
    if (!grupoActivo) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/grupos/${grupoActivo._id}/miembros/${usuarioId}`,
        { method: "DELETE", headers: headers() }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al expulsar");
      setGrupoActivo((prev) =>
        prev ? { ...prev, miembros: prev.miembros.filter((m) => m.usuario._id !== usuarioId) } : prev
      );
      setShowMenuMiembro(null);
      mostrarToast("Miembro expulsado");
      cargarGrupos();
    } catch (err: any) {
      mostrarToast(err.message, "err");
    }
  };

  const handleSalir = async () => {
    if (!grupoActivo) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/grupos/${grupoActivo._id}/salir`, {
        method: "POST",
        headers: headers(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al salir del grupo");
      setGrupos((prev) => prev.filter((g) => g._id !== grupoActivo._id));
      setGrupoActivo(null);
      mostrarToast("Saliste del grupo");
    } catch (err: any) {
      mostrarToast(err.message, "err");
    }
  };

  const handleCerrar = async () => {
    if (!grupoActivo) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/grupos/${grupoActivo._id}/cerrar`, {
        method: "PUT",
        headers: headers(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al cerrar el grupo");
      setGrupoActivo((prev) => (prev ? { ...prev, estado: "Cerrado" } : prev));
      setGrupos((prev) => prev.map((g) => (g._id === grupoActivo._id ? { ...g, estado: "Cerrado" } : g)));
      mostrarToast("Grupo cerrado");
    } catch (err: any) {
      mostrarToast(err.message, "err");
    }
  };

  const handleEnviarAviso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grupoActivo || !nuevoAviso.trim()) return;

    setEnviandoAviso(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/grupos/${grupoActivo._id}/avisos`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ contenido: nuevoAviso.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al enviar el aviso");
      setAvisos((prev) => [...prev, data]);
      setNuevoAviso("");
    } catch (err: any) {
      mostrarToast(err.message, "err");
    } finally {
      setEnviandoAviso(false);
    }
  };

  // ── Compartir ubicación actual en el grupo ───────────

  const compartirUbicacionGrupo = () => {
    if (!grupoActivo) return;
    setErrorUbicacionGrupo("");

    if (!("geolocation" in navigator)) {
      setErrorUbicacionGrupo("Tu dispositivo/navegador no soporta geolocalización.");
      return;
    }

    setObteniendoUbicacionGrupo(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/grupos/${grupoActivo._id}/avisos/ubicacion`,
            {
              method: "POST",
              headers: headers(),
              body: JSON.stringify({ lat: latitude, lng: longitude }),
            }
          );
          const data = await res.json();
          if (!res.ok) throw new Error(data.msg || "Error al compartir la ubicación");
          setAvisos((prev) => [...prev, data]);
        } catch (err: any) {
          setErrorUbicacionGrupo(err.message || "Error al compartir la ubicación");
        } finally {
          setObteniendoUbicacionGrupo(false);
        }
      },
      (geoError) => {
        setObteniendoUbicacionGrupo(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setErrorUbicacionGrupo(
            "Permiso de ubicación denegado. Actívalo en la configuración de tu navegador/dispositivo."
          );
        } else {
          setErrorUbicacionGrupo("No se pudo obtener tu ubicación. Intenta nuevamente.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const gruposFiltrados = grupos.filter((g) =>
    g.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const amigosDisponiblesParaInvitar = grupoActivo
    ? amigos.filter((a) => !grupoActivo.miembros.some((m) => m.usuario._id === a._id))
    : [];

  const formatearFecha = (fecha: string) =>
    new Date(fecha).toLocaleString([], { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navbar title="Grupos de Búsqueda" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden h-[calc(100vh-220px)] min-h-[500px] flex">
          {/* ── LISTA DE GRUPOS ── */}
          <div
            className={`w-full md:w-80 border-r border-slate-100 flex flex-col ${
              grupoActivo ? "hidden md:flex" : "flex"
            }`}
          >
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-slate-900">Mis Grupos</h2>
                <button
                  onClick={() => setShowModalCrear(true)}
                  className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white hover:shadow-lg hover:shadow-blue-500/30 transition"
                  title="Crear grupo"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar grupo..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingGrupos ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : gruposFiltrados.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-7 h-7 text-blue-500" />
                  </div>
                  <p className="text-slate-500 text-sm mb-3">
                    {grupos.length === 0 ? "Aún no perteneces a ningún grupo." : "Sin resultados."}
                  </p>
                  {grupos.length === 0 && (
                    <button
                      onClick={() => setShowModalCrear(true)}
                      className="text-blue-600 text-sm font-semibold hover:underline"
                    >
                      Crear tu primer grupo
                    </button>
                  )}
                </div>
              ) : (
                gruposFiltrados.map((g) => (
                  <button
                    key={g._id}
                    onClick={() => setGrupoActivo(g)}
                    className={`w-full flex items-center gap-3 p-4 border-b border-slate-50 hover:bg-slate-50 transition text-left ${
                      grupoActivo?._id === g._id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold shrink-0">
                      {g.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-slate-900 truncate">{g.nombre}</p>
                        {g.estado === "Cerrado" && <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                      </div>
                      <p className="text-sm text-slate-500 truncate">
                        {g.miembros.length} {g.miembros.length === 1 ? "miembro" : "miembros"}
                        {g.mascotaPerdida && ` · ${g.mascotaPerdida.nombre}`}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ── DETALLE DEL GRUPO ── */}
          <div className={`flex-1 flex flex-col ${grupoActivo ? "flex" : "hidden md:flex"}`}>
            {!grupoActivo ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Selecciona un grupo</h3>
                <p className="text-slate-500 text-sm">Elige un grupo de la lista o crea uno nuevo para coordinar la búsqueda.</p>
              </div>
            ) : (
              <>
                {/* HEADER GRUPO */}
                <div className="flex items-center justify-between gap-3 p-4 border-b border-slate-100 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => setGrupoActivo(null)}
                      className="md:hidden w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center shrink-0"
                    >
                      <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold shrink-0">
                      {grupoActivo.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{grupoActivo.nombre}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {grupoActivo.miembros.length} miembros
                        {grupoActivo.estado === "Cerrado" && " · Cerrado"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {miRol(grupoActivo) === "admin" && (
                      <button
                        onClick={() => setShowModalInvitar(true)}
                        className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center"
                        title="Invitar amigos"
                      >
                        <UserPlus className="w-4 h-4 text-slate-600" />
                      </button>
                    )}
                    <button
                      onClick={() => setShowMenuMiembro(showMenuMiembro === "panel" ? null : "panel")}
                      className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center"
                      title="Opciones del grupo"
                    >
                      <MoreVertical className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* PANEL DE OPCIONES / MIEMBROS */}
                {showMenuMiembro === "panel" && (
                  <div className="border-b border-slate-100 p-4 bg-slate-50 max-h-56 overflow-y-auto">
                    {grupoActivo.mascotaPerdida && (
                      <div className="flex items-center gap-3 bg-white rounded-xl p-3 mb-3 border border-slate-100">
                        <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                        <p className="text-sm text-slate-700">
                          Asociado a: <span className="font-semibold">{grupoActivo.mascotaPerdida.nombre}</span> ({grupoActivo.mascotaPerdida.tipo})
                        </p>
                      </div>
                    )}
                    <p className="text-xs font-semibold text-slate-500 mb-2">MIEMBROS</p>
                    <div className="space-y-2 mb-3">
                      {grupoActivo.miembros.map((m) => (
                        <div key={m.usuario._id} className="flex items-center gap-3 bg-white rounded-xl p-2.5 border border-slate-100">
                          <img
                            src={m.usuario.imagen || AVATAR}
                            alt={m.usuario.nombre}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{m.usuario.nombre}</p>
                          </div>
                          {m.rol === "admin" && (
                            <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                              <Crown className="w-3 h-3" /> Admin
                            </span>
                          )}
                          {miRol(grupoActivo) === "admin" &&
                            m.usuario._id !== grupoActivo.creador._id &&
                            m.usuario._id !== userId && (
                              <button
                                onClick={() => handleExpulsar(m.usuario._id)}
                                className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center shrink-0"
                                title="Expulsar"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                              </button>
                            )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {grupoActivo.creador._id !== userId ? (
                        <button
                          onClick={handleSalir}
                          className="flex-1 flex items-center justify-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 font-semibold px-4 py-2 rounded-xl text-sm transition"
                        >
                          <LogOut className="w-4 h-4" /> Salir del grupo
                        </button>
                      ) : grupoActivo.estado === "Activo" ? (
                        <button
                          onClick={handleCerrar}
                          className="flex-1 flex items-center justify-center gap-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold px-4 py-2 rounded-xl text-sm transition"
                        >
                          <Shield className="w-4 h-4" /> Cerrar grupo
                        </button>
                      ) : (
                        <span className="flex-1 flex items-center justify-center gap-1.5 text-slate-400 text-sm py-2">
                          <Lock className="w-4 h-4" /> Grupo cerrado
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* AVISOS */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loadingAvisos ? (
                    <div className="flex justify-center py-12">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : avisos.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-slate-400 text-sm">Sin avisos todavía. Comparte información de la búsqueda aquí.</p>
                    </div>
                  ) : (
                    avisos.map((a) => {
                      const esMio = a.autor._id === userId;
                      const esUbicacion = a.tipo === "ubicacion" && a.ubicacion;

                      if (esUbicacion) {
                        const { lat, lng, direccion } = a.ubicacion!;
                        const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
                        const staticMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=15&size=300x150&markers=${lat},${lng},red-pushpin`;
                        return (
                          <div key={a._id} className={`flex ${esMio ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] sm:max-w-[65%] ${esMio ? "items-end" : "items-start"} flex flex-col`}>
                              {!esMio && (
                                <p className="text-xs font-semibold text-slate-500 mb-1 ml-1">{a.autor.nombre}</p>
                              )}
                              <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`rounded-2xl overflow-hidden border block hover:opacity-90 transition ${
                                  esMio ? "border-blue-200 rounded-br-md" : "border-slate-200 rounded-bl-md"
                                }`}
                              >
                                <div className="relative bg-slate-100">
                                  <img
                                    src={staticMapUrl}
                                    alt="Ubicación compartida"
                                    className="w-full h-32 object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <MapPin className="w-8 h-8 text-red-500 drop-shadow" fill="currentColor" />
                                  </div>
                                </div>
                                <div
                                  className={`px-3 py-2 text-sm ${
                                    esMio
                                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                                      : "bg-slate-100 text-slate-800"
                                  }`}
                                >
                                  <p className="font-semibold flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                                    Ubicación compartida
                                  </p>
                                  {direccion && (
                                    <p className="text-xs opacity-90 mt-0.5 break-words">{direccion}</p>
                                  )}
                                </div>
                              </a>
                              <span className="text-[11px] text-slate-400 mt-1 mx-1">{formatearFecha(a.createdAt)}</span>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={a._id} className={`flex ${esMio ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] sm:max-w-[65%] ${esMio ? "items-end" : "items-start"} flex flex-col`}>
                            {!esMio && (
                              <p className="text-xs font-semibold text-slate-500 mb-1 ml-1">{a.autor.nombre}</p>
                            )}
                            <div
                              className={`rounded-2xl px-4 py-2.5 text-sm ${
                                esMio
                                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-br-md"
                                  : "bg-slate-100 text-slate-800 rounded-bl-md"
                              }`}
                            >
                              <p className="break-words">{a.contenido}</p>
                            </div>
                            <span className="text-[11px] text-slate-400 mt-1 mx-1">{formatearFecha(a.createdAt)}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* AVISO ERROR UBICACIÓN */}
                {errorUbicacionGrupo && (
                  <div className="mx-4 mb-2 flex items-start gap-2 bg-red-50 border border-red-100 text-red-500 text-xs rounded-xl p-3">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="flex-1">{errorUbicacionGrupo}</p>
                    <button onClick={() => setErrorUbicacionGrupo("")} className="shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* INPUT AVISO */}
                {grupoActivo.estado === "Activo" ? (
                  <form onSubmit={handleEnviarAviso} className="p-4 border-t border-slate-100 flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={compartirUbicacionGrupo}
                      disabled={obteniendoUbicacionGrupo}
                      title="Compartir mi ubicación actual"
                      className="w-11 h-11 shrink-0 rounded-xl border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 flex items-center justify-center text-slate-500 transition disabled:opacity-50"
                    >
                      {obteniendoUbicacionGrupo ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <MapPin className="w-5 h-5" />
                      )}
                    </button>
                    <input
                      type="text"
                      value={nuevoAviso}
                      onChange={(e) => setNuevoAviso(e.target.value)}
                      placeholder="Escribe un aviso para el grupo..."
                      className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <button
                      type="submit"
                      disabled={enviandoAviso || !nuevoAviso.trim()}
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-5 py-2.5 flex items-center gap-2 font-semibold text-sm transition"
                    >
                      <Send className="w-4 h-4" />
                      <span className="hidden sm:inline">Enviar</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-4 border-t border-slate-100 text-center text-sm text-slate-400 shrink-0">
                    Este grupo está cerrado. No se pueden enviar más avisos.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* MODAL CREAR GRUPO */}
      {showModalCrear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Nuevo Grupo de Búsqueda</h2>
              <button
                onClick={() => { limpiarModalCrear(); setShowModalCrear(false); }}
                className="text-slate-500 hover:text-slate-700 text-xl"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleCrearGrupo}>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre del grupo</label>
                <input
                  type="text"
                  placeholder="Ej. Búsqueda de Rocky - Sector Norte"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  value={nombreGrupo}
                  onChange={(e) => setNombreGrupo(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Descripción (opcional)</label>
                <textarea
                  placeholder="Detalles sobre la búsqueda..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none"
                  value={descripcionGrupo}
                  onChange={(e) => setDescripcionGrupo(e.target.value)}
                />
              </div>

              {mascotasPerdidas.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Asociar a mascota perdida (opcional)</label>
                  <select
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    value={mascotaSeleccionada}
                    onChange={(e) => setMascotaSeleccionada(e.target.value)}
                  >
                    <option value="">Ninguna</option>
                    {mascotasPerdidas.map((m) => (
                      <option key={m._id} value={m._id}>{m.nombre} ({m.tipo})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Invitar amistades (opcional)</label>
                {amigos.length === 0 ? (
                  <p className="text-sm text-slate-400">No tienes amistades para invitar todavía.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-slate-100 rounded-xl p-2">
                    {amigos.map((a) => (
                      <label
                        key={a._id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={invitadosSeleccionados.has(a._id)}
                          onChange={() => toggleInvitado(a._id)}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <img src={a.imagen || AVATAR} alt={a.nombre} className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-sm text-slate-700">{a.nombre}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={creando}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
              >
                {creando ? "Creando..." : "Crear Grupo"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL INVITAR A GRUPO EXISTENTE */}
      {showModalInvitar && grupoActivo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Invitar amigos</h2>
              <button onClick={() => setShowModalInvitar(false)} className="text-slate-500 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {amigosDisponiblesParaInvitar.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">
                Todos tus amigos ya son parte de este grupo, o no tienes amistades disponibles.
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {amigosDisponiblesParaInvitar.map((a) => (
                  <div key={a._id} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100">
                    <img src={a.imagen || AVATAR} alt={a.nombre} className="w-9 h-9 rounded-full object-cover" />
                    <span className="flex-1 text-sm font-medium text-slate-800 truncate">{a.nombre}</span>
                    <button
                      onClick={() => handleInvitar(a._id)}
                      className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition"
                    >
                      Invitar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold transition-all ${
          toast.tipo === "ok" ? "bg-emerald-600 text-white" : "bg-red-500 text-white"
        }`}>
          {toast.tipo === "ok" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}