import {
  PawPrint,
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
  MapPin,
  Syringe,
  Stethoscope,
  User,
  Calendar,
  Search,
  Heart,
  X,
  MessageCircle,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../NavbarComponent/Navbar";

type Mascota = {
  _id: string;
  nombre: string;
  tipo: string;
  edad: number;
  peso: number;
  estadoSalud?: string;
  imagen?: string;
};

type Recordatorio = {
  _id: string;
  titulo: string;
  fecha: string;
  tipo: string;
  estado: string;
  mascota: { _id: string; nombre: string } | string;
};

type MascotaPerdida = {
  _id: string;
  nombre: string;
  tipo: string;
  ubicacion: string;
  imagen?: string;
  estado: "Perdida" | "Encontrada";
  fechaPerdida: string;
};

type Alerta = {
  id: string;
  tipo: "vacuna" | "control" | "medicacion";
  urgencia: "critica" | "proxima";
  mascota: Mascota;
  titulo: string;
  descripcion: string;
  fecha: string;
  diasRestantes: number;
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [mascotasPerdidas, setMascotasPerdidas] = useState<MascotaPerdida[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensajesNoLeidos, setMensajesNoLeidos] = useState(0);

  const [popupMascotaPerdida, setPopupMascotaPerdida] = useState<MascotaPerdida | null>(null);
  const [mostrarPopupPerdida, setMostrarPopupPerdida] = useState(false);

  const ultimaMascotaPerdidaIdRef = useRef<string | null>(null);
  const popupTimerRef = useRef<number | null>(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    cargarDatos();

    const intervalo = window.setInterval(() => {
      revisarNuevaMascotaPerdida();
    }, 30000);

    return () => {
      window.clearInterval(intervalo);

      if (popupTimerRef.current) {
        window.clearTimeout(popupTimerRef.current);
      }
    };
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [mascotasRes, recordatoriosRes, perdidasRes, conversacionesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/mascotas`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/api/recordatorios`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/api/mascotas-perdidas`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/api/mensajes/conversaciones`, { headers }),
      ]);

      const mascotasData = await mascotasRes.json();
      const recordatoriosData = await recordatoriosRes.json();
      const perdidasData = await perdidasRes.json();
      const conversacionesData = await conversacionesRes.json();

      if (Array.isArray(conversacionesData)) {
        const totalNoLeidos = conversacionesData.reduce(
          (acc: number, c: any) => acc + (c.noLeidos || 0),
          0
        );
        setMensajesNoLeidos(totalNoLeidos);
      }

      const listaMascotas: Mascota[] = mascotasData.mascotas || [];
      const listaRecordatorios: Recordatorio[] = Array.isArray(recordatoriosData) ? recordatoriosData : [];
      const listaPerdidas: MascotaPerdida[] = Array.isArray(perdidasData) ? perdidasData : [];

      const perdidasActivas = listaPerdidas.filter((m) => m.estado === "Perdida");

      setMascotas(listaMascotas);
      setMascotasPerdidas(perdidasActivas.slice(0, 3));

      if (!ultimaMascotaPerdidaIdRef.current && perdidasActivas.length > 0) {
        ultimaMascotaPerdidaIdRef.current = perdidasActivas[0]._id;
      }

      const pendientes = listaRecordatorios
        .filter((r) => r.estado === "Pendiente")
        .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
        .slice(0, 5);
      setRecordatorios(pendientes);

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const nuevasAlertas: Alerta[] = [];

      listaRecordatorios
        .filter((r) => r.estado === "Pendiente")
        .forEach((r) => {
          if (!r.fecha) return;
          const fecha = new Date(r.fecha);
          fecha.setHours(0, 0, 0, 0);
          const diff = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
          const mascotaObj = typeof r.mascota === "object" ? r.mascota : { _id: "", nombre: "Mascota" };

          if (diff < 0 || diff <= 7) {
            nuevasAlertas.push({
              id: r._id,
              tipo: r.tipo?.toLowerCase() === "control" ? "control" : "vacuna",
              urgencia: diff < 0 ? "critica" : "proxima",
              mascota: mascotaObj as any,
              titulo: r.titulo,
              descripcion: diff < 0
                ? `Venció hace ${Math.abs(diff)} día${Math.abs(diff) !== 1 ? "s" : ""}`
                : diff === 0 ? "Es hoy" : `En ${diff} día${diff !== 1 ? "s" : ""}`,
              fecha: r.fecha,
              diasRestantes: diff,
            });
          }
        });

      nuevasAlertas.sort((a, b) => {
        if (a.urgencia === "critica" && b.urgencia !== "critica") return -1;
        if (a.urgencia !== "critica" && b.urgencia === "critica") return 1;
        return a.diasRestantes - b.diasRestantes;
      });

      setAlertas(nuevasAlertas.slice(0, 4));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const revisarNuevaMascotaPerdida = async () => {
    try {
      const perdidasRes = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas-perdidas`, { headers });
      const perdidasData = await perdidasRes.json();

      const listaPerdidas: MascotaPerdida[] = Array.isArray(perdidasData) ? perdidasData : [];
      const perdidasActivas = listaPerdidas.filter((m) => m.estado === "Perdida");

      setMascotasPerdidas(perdidasActivas.slice(0, 3));

      const mascotaMasReciente = perdidasActivas[0];

      if (!mascotaMasReciente) return;

      if (!ultimaMascotaPerdidaIdRef.current) {
        ultimaMascotaPerdidaIdRef.current = mascotaMasReciente._id;
        return;
      }

      if (mascotaMasReciente._id !== ultimaMascotaPerdidaIdRef.current) {
        ultimaMascotaPerdidaIdRef.current = mascotaMasReciente._id;
        mostrarPopupNuevaMascotaPerdida(mascotaMasReciente);
      }
    } catch (err) {
      console.error("Error revisando nuevas mascotas perdidas:", err);
    }
  };

  const mostrarPopupNuevaMascotaPerdida = (mascota: MascotaPerdida) => {
    setPopupMascotaPerdida(mascota);
    setMostrarPopupPerdida(true);

    if (popupTimerRef.current) {
      window.clearTimeout(popupTimerRef.current);
    }

    popupTimerRef.current = window.setTimeout(() => {
      setMostrarPopupPerdida(false);
    }, 7000);
  };

  const cerrarPopupMascotaPerdida = () => {
    setMostrarPopupPerdida(false);

    if (popupTimerRef.current) {
      window.clearTimeout(popupTimerRef.current);
    }
  };

  const irAMascotasPerdidas = () => {
    cerrarPopupMascotaPerdida();
    navigate("/perdidos");
  };

  const saludables = mascotas.filter((m) => m.estadoSalud === "Excelente").length;
  const enTratamiento = mascotas.filter((m) => m.estadoSalud === "En tratamiento").length;
  const pendientesCount = recordatorios.length;
  const alertasCriticas = alertas.filter((a) => a.urgencia === "critica").length;

  const saludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Buenos días";
    if (hora < 19) return "Buenas tardes";
    return "Buenas noches";
  };

  const accesosRapidos = [
    { label: "Mis Mascotas", icon: PawPrint, href: "/mascotas", color: "bg-blue-100 text-blue-600", hover: "hover:bg-blue-200" },
    { label: "Recordatorios", icon: Bell, href: "/recordatorios", color: "bg-purple-100 text-purple-600", hover: "hover:bg-purple-200" },
    { label: "Alertas", icon: AlertTriangle, href: "/alertas", color: "bg-red-100 text-red-600", hover: "hover:bg-red-200" },
    { label: "Perdidos", icon: Search, href: "/perdidos", color: "bg-orange-100 text-orange-600", hover: "hover:bg-orange-200" },
    { label: "Mapa", icon: MapPin, href: "/mapa", color: "bg-cyan-100 text-cyan-600", hover: "hover:bg-cyan-200" },
    { label: "Mensajes", icon: MessageCircle, href: "/mensajes", color: "bg-indigo-100 text-indigo-600", hover: "hover:bg-indigo-200", badge: mensajesNoLeidos },
    { label: "Grupos", icon: Users, href: "/grupos", color: "bg-pink-100 text-pink-600", hover: "hover:bg-pink-200" },
    { label: "Amistades", icon: Users, href: "/amigos", color: "bg-teal-100 text-teal-600", hover: "hover:bg-teal-200" },
    { label: "Mi Perfil", icon: User, href: "/perfil", color: "bg-emerald-100 text-emerald-600", hover: "hover:bg-emerald-200" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">

      {/* HEADER */}
      <Navbar title="Dashboard" />

      {/* POPUP MASCOTA PERDIDA */}
      {mostrarPopupPerdida && popupMascotaPerdida && (
        <div className="fixed bottom-6 right-6 z-[9999] w-[calc(100%-2rem)] max-w-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4 text-white">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Search className="w-6 h-6" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-blue-100">
                      Nueva publicación
                    </p>
                    <h3 className="text-base font-bold leading-tight">
                      Mascota perdida
                    </h3>
                  </div>
                </div>

                <button
                  onClick={cerrarPopupMascotaPerdida}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
                  aria-label="Cerrar popup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <button
              onClick={irAMascotasPerdidas}
              className="w-full text-left p-4 hover:bg-blue-50 transition"
            >
              <div className="flex gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-red-100 shrink-0">
                  <img
                    src={popupMascotaPerdida.imagen || "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop"}
                    alt={popupMascotaPerdida.nombre}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    Perdida
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-bold text-slate-900 truncate">
                    {popupMascotaPerdida.nombre}
                  </h4>

                  <p className="text-sm text-slate-500 truncate">
                    {popupMascotaPerdida.tipo}
                  </p>

                  <div className="flex items-center gap-1 mt-2 text-sm text-slate-500">
                    <MapPin className="w-4 h-4 shrink-0 text-red-400" />
                    <span className="truncate">{popupMascotaPerdida.ubicacion}</span>
                  </div>

                  <p className="text-xs text-blue-600 font-semibold mt-2">
                    Ver mascotas perdidas
                  </p>
                </div>
              </div>
            </button>

            <div className="h-1.5 bg-slate-100">
              <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-r-full"></div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* BIENVENIDA */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute right-16 bottom-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2" />
          <div className="relative">
            <p className="text-blue-100 text-sm font-medium mb-1">{saludo()},</p>
            <h2 className="text-3xl font-bold mb-2">{user.nombre || "Usuario"} </h2>
            <p className="text-blue-100 text-sm">
              Tienes <span className="font-bold text-white">{mascotas.length}</span> mascota{mascotas.length !== 1 ? "s" : ""} registrada{mascotas.length !== 1 ? "s" : ""}
              {alertasCriticas > 0 && (
                <> y <span className="font-bold text-red-200">{alertasCriticas} alerta{alertasCriticas !== 1 ? "s" : ""} crítica{alertasCriticas !== 1 ? "s" : ""}</span> pendiente{alertasCriticas !== 1 ? "s" : ""}</>
              )}.
            </p>
          </div>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Mascotas</p>
                <p className="text-4xl font-bold text-slate-900 mt-1">{mascotas.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Saludables</p>
                <p className="text-4xl font-bold text-emerald-600 mt-1">{saludables}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Recordatorios</p>
                <p className="text-4xl font-bold text-purple-600 mt-1">{pendientesCount}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Alertas</p>
                <p className="text-4xl font-bold text-red-500 mt-1">{alertasCriticas}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </div>
        </div>

        {/* ACCESOS RÁPIDOS */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Accesos Rápidos</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {accesosRapidos.map((item) => (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={`relative bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:scale-105 flex flex-col items-center gap-2`}
              >
                <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center ${item.color} ${item.hover} transition`}>
                  <item.icon className="w-6 h-6" />
                  {"badge" in item && !!item.badge && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-700 text-center">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* MIS MASCOTAS */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Mis Mascotas</h2>
              <button
                onClick={() => navigate("/mascotas")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Ver todas <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {mascotas.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <PawPrint className="w-7 h-7 text-blue-600" />
                </div>
                <p className="font-semibold text-slate-900 mb-1">Sin mascotas aún</p>
                <p className="text-sm text-slate-500 mb-4">Agrega tu primera mascota para comenzar</p>
                <button
                  onClick={() => navigate("/mascotas")}
                  className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                >
                  Agregar mascota
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mascotas.slice(0, 4).map((mascota) => (
                  <div
                    key={mascota._id}
                    onClick={() => navigate("/mascotas")}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-100 group cursor-pointer"
                  >
                    <div className="relative h-36 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                      <img
                        src={mascota.imagen || "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=500&fit=crop"}
                        alt={mascota.nombre}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                        mascota.estadoSalud === "Excelente" ? "bg-emerald-500 text-white"
                        : mascota.estadoSalud === "En tratamiento" ? "bg-amber-500 text-white"
                        : "bg-blue-500 text-white"
                      }`}>
                        {mascota.estadoSalud || "Sin datos"}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 text-lg">{mascota.nombre}</h3>
                      <p className="text-xs text-slate-500 mb-3">{mascota.tipo}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-blue-50 rounded-xl p-2">
                          <p className="text-xs text-slate-500">Edad</p>
                          <p className="text-sm font-bold text-blue-600">{mascota.edad} años</p>
                        </div>
                        <div className="bg-cyan-50 rounded-xl p-2">
                          <p className="text-xs text-slate-500">Peso</p>
                          <p className="text-sm font-bold text-cyan-600">{mascota.peso} kg</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA */}
          <div className="flex flex-col gap-6">

            {/* ALERTAS */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Alertas</h2>
                <button
                  onClick={() => navigate("/alertas")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  Ver todas <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {alertas.length === 0 ? (
                  <div className="p-6 text-center">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">¡Sin alertas!</p>
                    <p className="text-xs text-slate-400 mt-1">Todo está en orden</p>
                  </div>
                ) : (
                  alertas.map((alerta) => {
                    const esCritica = alerta.urgencia === "critica";
                    return (
                      <div
                        key={alerta.id}
                        onClick={() => navigate("/alertas")}
                        className={`flex items-start gap-3 p-4 border-b border-slate-50 last:border-0 cursor-pointer hover:bg-slate-50 transition ${
                          esCritica ? "border-l-4 border-l-red-400" : "border-l-4 border-l-amber-400"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          esCritica ? "bg-red-100" : "bg-amber-100"
                        }`}>
                          {alerta.tipo === "control"
                            ? <Stethoscope className={`w-4 h-4 ${esCritica ? "text-red-500" : "text-amber-500"}`} />
                            : <Syringe className={`w-4 h-4 ${esCritica ? "text-red-500" : "text-amber-500"}`} />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{alerta.titulo}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{alerta.descripcion}</p>
                          {alerta.mascota?.nombre && (
                            <p className="text-xs text-blue-500 mt-0.5 font-medium">{alerta.mascota.nombre}</p>
                          )}
                        </div>
                        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-bold ${
                          esCritica ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                        }`}>
                          {esCritica ? "⚠ Crítica" : "Próxima"}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* ESTADO DE SALUD */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Estado de Salud</h2>
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-slate-600">Excelente</span>
                  </div>
                  <span className="font-bold text-slate-900">{saludables}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm text-slate-600">En tratamiento</span>
                  </div>
                  <span className="font-bold text-slate-900">{enTratamiento}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <span className="text-sm text-slate-600">Pendiente revisión</span>
                  </div>
                  <span className="font-bold text-slate-900">
                    {mascotas.filter((m) => m.estadoSalud === "Pendiente").length}
                  </span>
                </div>
                {mascotas.length > 0 && (
                  <div className="pt-2">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-2 transition-all"
                        style={{ width: `${(saludables / mascotas.length) * 100}%` }}
                      />
                      <div
                        className="bg-amber-400 h-2 transition-all"
                        style={{ width: `${(enTratamiento / mascotas.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RECORDATORIOS PRÓXIMOS */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Recordatorios Próximos</h2>
            <button
              onClick={() => navigate("/recordatorios")}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              Ver todos <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {recordatorios.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center">
              <Calendar className="w-10 h-10 text-purple-400 mx-auto mb-3" />
              <p className="font-semibold text-slate-700">Sin recordatorios pendientes</p>
              <p className="text-sm text-slate-400 mt-1">Agrega recordatorios para tus mascotas</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recordatorios.map((rec) => {
                const fecha = new Date(rec.fecha);
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                fecha.setHours(0, 0, 0, 0);
                const diff = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
                const esCritico = diff < 0;
                const esHoy = diff === 0;

                return (
                  <div
                    key={rec._id}
                    onClick={() => navigate("/recordatorios")}
                    className={`bg-white rounded-2xl p-5 shadow-sm border cursor-pointer hover:shadow-md transition-all hover:scale-105 ${
                      esCritico ? "border-red-200" : esHoy ? "border-amber-200" : "border-slate-100"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 truncate">{rec.titulo}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {typeof rec.mascota === "object" ? rec.mascota.nombre : rec.mascota}
                        </p>
                      </div>
                      <span className={`shrink-0 ml-2 text-xs px-2 py-0.5 rounded-full font-semibold ${
                        rec.tipo === "Vacuna" ? "bg-blue-100 text-blue-600"
                        : rec.tipo === "Control" ? "bg-purple-100 text-purple-600"
                        : "bg-orange-100 text-orange-600"
                      }`}>
                        {rec.tipo}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 shrink-0 ${esCritico ? "text-red-500" : esHoy ? "text-amber-500" : "text-slate-400"}`} />
                      <span className={`text-sm font-medium ${
                        esCritico ? "text-red-500"
                        : esHoy ? "text-amber-500"
                        : diff <= 7 ? "text-orange-500"
                        : "text-slate-600"
                      }`}>
                        {esCritico
                          ? `Venció hace ${Math.abs(diff)} día${Math.abs(diff) !== 1 ? "s" : ""}`
                          : esHoy ? "¡Hoy!"
                          : `${new Date(rec.fecha).toLocaleDateString()}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MASCOTAS PERDIDAS RECIENTES */}
        {mascotasPerdidas.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Mascotas Perdidas Recientes</h2>
              <button
                onClick={() => navigate("/perdidos")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Ver todas <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {mascotasPerdidas.map((m) => (
                <div
                  key={m._id}
                  onClick={() => navigate("/perdidos")}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-red-100 hover:shadow-md transition-all hover:scale-105 cursor-pointer group"
                >
                  <div className="relative h-32 overflow-hidden bg-gradient-to-br from-red-100 to-red-200">
                    <img
                      src={m.imagen || "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=200&fit=crop"}
                      alt={m.nombre}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      Perdida
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900">{m.nombre}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{m.tipo}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                      <MapPin className="w-3 h-3 shrink-0 text-red-400" />
                      <span className="truncate">{m.ubicacion}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center text-gray-500 text-sm pb-8">
          <p>© 2026 CatDog - Cuidado integral para tus mascotas</p>
        </div>
      </main>
    </div>
  );
}