import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Syringe,
  Stethoscope,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Mascota = {
  _id: string;
  nombre: string;
  tipo?: string;
  imagen?: string;
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

export default function AlertsPage() {
  const navigate = useNavigate();
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [descartadas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<"todas" | "critica" | "proxima">("todas");

  useEffect(() => {
    cargarAlertas();
  }, []);

  const cargarAlertas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [mascotasRes, recordatoriosRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/mascotas`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/api/recordatorios`, { headers }),
      ]);

      const mascotasData = await mascotasRes.json();
      const recordatorios = await recordatoriosRes.json();

      const mascotasMap: Record<string, Mascota> = {};
      (mascotasData.mascotas || []).forEach((m: Mascota) => {
        mascotasMap[m._id] = m;
      });

      const nuevasAlertas: Alerta[] = [];
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const pendientes = Array.isArray(recordatorios)
        ? recordatorios.filter((r: any) => r.estado === "Pendiente")
        : [];

      pendientes.forEach((r: any) => {
        if (!r.fecha) return;
        const fecha = new Date(r.fecha);
        fecha.setHours(0, 0, 0, 0);
        const diff = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

        const mascotaObj: Mascota =
          typeof r.mascota === "object" && r.mascota !== null
            ? r.mascota
            : mascotasMap[r.mascota] || { _id: r.mascota, nombre: "Mascota" };

        const tipoNorm = r.tipo?.toLowerCase();
        const tipoAlerta: Alerta["tipo"] =
          tipoNorm === "control" ? "control"
          : tipoNorm === "medicacion" ? "medicacion"
          : "vacuna";

        if (diff < 0) {
          nuevasAlertas.push({
            id: `rec-${r._id}`,
            tipo: tipoAlerta,
            urgencia: "critica",
            mascota: mascotaObj,
            titulo: r.titulo,
            descripcion: `Venció hace ${Math.abs(diff)} día${Math.abs(diff) !== 1 ? "s" : ""}`,
            fecha: r.fecha,
            diasRestantes: diff,
          });
        } else if (diff <= 15) {
          nuevasAlertas.push({
            id: `rec-${r._id}`,
            tipo: tipoAlerta,
            urgencia: "proxima",
            mascota: mascotaObj,
            titulo: r.titulo,
            descripcion: diff === 0 ? "Es hoy" : `En ${diff} día${diff !== 1 ? "s" : ""}`,
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

      setAlertas(nuevasAlertas);
    } catch (err) {
      console.error("Error cargando alertas:", err);
    } finally {
      setLoading(false);
    }
  };

  const alertasFiltradas = alertas
    .filter((a) => !descartadas.includes(a.id))
    .filter((a) => filtro === "todas" || a.urgencia === filtro);

  const criticas = alertas.filter((a) => a.urgencia === "critica" && !descartadas.includes(a.id)).length;
  const proximas = alertas.filter((a) => a.urgencia === "proxima" && !descartadas.includes(a.id)).length;
  const total = alertasFiltradas.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">

      {/* HEADER — idéntico al de mascotas */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                CatDog
              </h1>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Alertas
              </h1>
            </div>
            <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-8">
              <nav className="flex gap-6 sm:gap-8">
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Inicio</a>
                <a href="/mascotas" className="text-gray-600 hover:text-blue-600 transition">Mascotas</a>
                <a href="/recordatorios" className="text-gray-600 hover:text-blue-600 transition">Recordatorios</a>
                <a href="/alertas" className="text-blue-600 font-medium">Alertas</a>
                <a href="/perfil" className="text-gray-600 font-medium hover:text-blue-600 transition">Perfil</a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ESTADÍSTICAS — mismo estilo que mascotas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Alertas</p>
                <p className="text-4xl font-bold text-slate-900 mt-1">{total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Críticas</p>
                <p className="text-4xl font-bold text-red-500 mt-1">{criticas}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Próximas</p>
                <p className="text-4xl font-bold text-amber-500 mt-1">{proximas}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Descartadas</p>
                <p className="text-4xl font-bold text-emerald-600 mt-1">{descartadas.length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* FILTROS */}
        <div className="flex gap-3 mb-6">
          {(["todas", "critica", "proxima"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                filtro === f
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {f === "todas" ? "Todas" : f === "critica" ? "Críticas" : "Próximas"}
            </button>
          ))}
        </div>

        {/* GRID ALERTAS — mismo estilo que grid de mascotas */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : alertasFiltradas.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">¡Todo en orden!</h3>
            <p className="text-slate-500 text-sm">No hay alertas activas en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {alertasFiltradas.map((alerta) => {
              const esCritica = alerta.urgencia === "critica";
              return (
                <div
                  key={alerta.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-100 group"
                >
                  {/* Imagen / banner superior */}
                  <div className={`relative h-48 overflow-hidden flex items-center justify-center ${
                    esCritica
                      ? "bg-gradient-to-br from-red-100 to-red-200"
                      : "bg-gradient-to-br from-amber-100 to-yellow-200"
                  }`}>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                      esCritica ? "bg-red-200" : "bg-amber-200"
                    }`}>
                      {alerta.tipo === "control"
                        ? <Stethoscope className={`w-10 h-10 ${esCritica ? "text-red-500" : "text-amber-500"}`} />
                        : <Syringe className={`w-10 h-10 ${esCritica ? "text-red-500" : "text-amber-500"}`} />
                      }
                    </div>

                    {/* Badge urgencia */}
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                      esCritica
                        ? "bg-red-500 text-white"
                        : "bg-amber-400 text-white"
                    }`}>
                      {esCritica ? "CRÍTICA" : "PRÓXIMA"}
                    </div>

                  </div>

                  <div className="p-6">
                    {/* Nombre y tipo */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{alerta.titulo}</h3>
                        <p className="text-sm text-slate-500 mt-1 capitalize">{alerta.tipo}</p>
                      </div>
                    </div>

                    {/* Grid fecha / días — igual que edad/peso en mascotas */}
                    <div className="grid grid-cols-2 gap-3 mb-3 pb-4 border-b border-slate-100">
                      <div className={`rounded-2xl p-3 ${esCritica ? "bg-red-50" : "bg-amber-50"}`}>
                        <p className="text-xs text-slate-600 font-medium">Fecha</p>
                        <p className={`text-lg font-bold mt-1 ${esCritica ? "text-red-500" : "text-amber-500"}`}>
                          {new Date(alerta.fecha).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-2xl p-3">
                        <p className="text-xs text-slate-600 font-medium">Estado</p>
                        <p className="text-lg font-bold text-blue-600 mt-1">{alerta.descripcion}</p>
                      </div>
                    </div>

                    {/* Mascota */}
                    {alerta.mascota?.nombre && (
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm font-medium text-slate-700">{alerta.mascota.nombre}</span>
                      </div>
                    )}

                    {/* Botón acción */}
                    <button
                      onClick={() => navigate("/recordatorios")}
                      className={`w-full flex items-center justify-center gap-2 text-white font-semibold py-2.5 rounded-xl shadow-md transition-all text-sm ${
                        esCritica
                          ? "bg-gradient-to-r from-red-500 to-red-400 hover:from-red-600 hover:to-red-500"
                          : "bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500"
                      }`}
                    >
                      Ver recordatorio
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center text-gray-500 text-sm pb-8">
          <p>© 2026 CatDog - Cuidado integral para tus mascotas</p>
        </div>
      </main>
    </div>
  );
}