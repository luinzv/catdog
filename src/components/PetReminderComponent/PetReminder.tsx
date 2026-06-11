import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Mascota = {
  _id: string;
  imagen: string;
  nombre: string;
  tipo: string;
  edad: number;
  peso: number;
};

export default function PetReminders() {
  const [recordatorios, setRecordatorios] = useState<any[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editarModal, setEditarModal] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<Mascota | null>(null);
  const [fecha, setFecha] = useState("");
  const [tipo, setTipo] = useState("Vacuna");
  const [editarId, setEditarId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    obtenerRecordatorios();
    obtenerMascotas();
  }, []);

  const obtenerMascotas = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        }
        return;
      }
      const data = await res.json();
      setMascotas(Array.isArray(data.mascotas) ? data.mascotas : []);
    } catch (err) {
      console.error(err);
    }
  };

  const obtenerRecordatorios = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/recordatorios`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await response.json();
    console.log("RECORDATORIOS:", data); // <-- agrega esto
    setRecordatorios(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error(error);
  }
};

  const abrirModalConMascota = (mascota: Mascota) => {
    setMascotaSeleccionada(mascota);
    setTitulo("");
    setFecha("");
    setTipo("Vacuna");
    setMostrarModal(true);
  };

  const crearRecordatorio = async () => {
    if (!mascotaSeleccionada) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/recordatorios`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            titulo,
            mascota: mascotaSeleccionada._id,
            fecha,
            tipo,
          }),
        }
      );
      const data = await response.json();
      setRecordatorios([...recordatorios, data]);
      setTitulo("");
      setFecha("");
      setTipo("Vacuna");
      setMascotaSeleccionada(null);
      setMostrarModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const completarRecordatorio = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/recordatorios/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ estado: "Completado" }),
        }
      );
      const actualizado = await response.json();
      setRecordatorios(
        recordatorios.map((r) => (r._id === actualizado._id ? actualizado : r))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const editarRecordatorio = (recordatorio: any) => {
    setEditarId(recordatorio._id);
    setTitulo(recordatorio.titulo);
    setMascotaSeleccionada(
      typeof recordatorio.mascota === "object" ? recordatorio.mascota : null
    );
    setFecha(recordatorio.fecha.slice(0, 10));
    setTipo(recordatorio.tipo);
    setEditarModal(true);
  };

  const guardarEdicion = async () => {
    if (!editarId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/recordatorios/${editarId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            titulo,
            mascota: mascotaSeleccionada?._id,
            fecha,
            tipo,
          }),
        }
      );
      const actualizado = await response.json();
      setRecordatorios(
        recordatorios.map((r) => (r._id === actualizado._id ? actualizado : r))
      );
      setEditarModal(false);
      setEditarId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarRecordatorio = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_API_URL}/api/recordatorios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecordatorios(recordatorios.filter((r) => r._id !== id));
      setEditarModal(false);
      setEditarId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const pendientes = recordatorios.filter((r) => r.estado === "Pendiente");
  const completados = recordatorios.filter((r) => r.estado === "Completado");

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100">
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                CatDog
              </h1>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Recordatorios
              </h1>
            </div>
            <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4">
              <nav className="flex gap-6 sm:gap-8">
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Inicio</a>
                <a href="/mascotas" className="text-gray-600 hover:text-blue-600 transition">Mascotas</a>
                <a href="/recordatorios" className="text-blue-600 hover:text-blue-600 transition">Recordatorios</a>
                <a href="/alertas" className="text-gray-600 font-medium hover:text-blue-600 transition">Alertas</a>
                <a href="/perfil" className="text-gray-600 font-medium hover:text-blue-600 transition">Perfil</a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
              <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mascotas.map((mascota) => (
              <div
                key={mascota._id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-100 group"
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                  <img
                    src={
                      mascota.imagen ||
                      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=500&fit=crop"
                    }
                    alt={mascota.nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{mascota.nombre}</h3>
                      <p className="text-sm text-slate-500 mt-1">{mascota.tipo}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b border-slate-100">
                    <div className="bg-blue-50 rounded-2xl p-3">
                      <p className="text-xs text-slate-600 font-medium">Edad</p>
                      <p className="text-lg font-bold text-blue-600 mt-1">{mascota.edad} años</p>
                    </div>
                    <div className="bg-cyan-50 rounded-2xl p-3">
                      <p className="text-xs text-slate-600 font-medium">Peso</p>
                      <p className="text-lg font-bold text-cyan-600 mt-1">{mascota.peso} kg</p>
                    </div>
                  </div>

                  <button
                    onClick={() => abrirModalConMascota(mascota)}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Nuevo recordatorio
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* RECORDATORIOS PENDIENTES */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            Pendientes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendientes.map((recordatorio) => (
              <div
                key={recordatorio._id}
                className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{recordatorio.titulo}</h3>
                    <p className="text-gray-500 text-sm">
                      {typeof recordatorio.mascota === "object"
                        ? recordatorio.mascota.nombre
                        : recordatorio.mascota}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                    {recordatorio.tipo}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">
                  {new Date(recordatorio.fecha).toLocaleDateString()}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => editarRecordatorio(recordatorio)}
                    className="flex-1 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => completarRecordatorio(recordatorio._id)}
                    className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition"
                  >
                    Completar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECORDATORIOS COMPLETADOS */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            Completados
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completados.map((recordatorio) => (
              <div
                key={recordatorio._id}
                className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{recordatorio.titulo}</h3>
                    <p className="text-gray-500 text-sm">
                      {typeof recordatorio.mascota === "object" && recordatorio.mascota !== null
                        ? recordatorio.mascota.nombre
                        : recordatorio.mascota}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                    Completado
                  </span>
                </div>
                <p className="text-gray-700">
                  {new Date(recordatorio.fecha).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* MASCOTAS */}

      </div>

      {/* MODAL EDITAR */}
      {editarModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-1">Editar Recordatorio</h2>
            {mascotaSeleccionada && (
              <p className="text-sm text-slate-500 mb-4">
                Mascota: <span className="font-semibold text-slate-700">{mascotaSeleccionada.nombre}</span>
              </p>
            )}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="Vacuna">Vacuna</option>
                <option value="Control">Control</option>
                <option value="Medicacion">Medicación</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditarModal(false)} className="px-5 py-2 bg-gray-100 rounded-xl">Cancelar</button>
              <button onClick={guardarEdicion} className="px-5 py-2 bg-blue-600 text-white rounded-xl">Guardar</button>
              <button onClick={() => eliminarRecordatorio(editarId!)} className="px-5 py-2 bg-red-500 text-white rounded-xl">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR */}
      {mostrarModal && mascotaSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-1">Nuevo Recordatorio</h2>
            <p className="text-sm text-slate-500 mb-4">
              Mascota: <span className="font-semibold text-slate-700">{mascotaSeleccionada.nombre}</span>
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="Vacuna">Vacuna</option>
                <option value="Control">Control</option>
                <option value="Medicacion">Medicación</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setMostrarModal(false)} className="px-5 py-2 bg-gray-100 rounded-xl">Cancelar</button>
              <button onClick={crearRecordatorio} className="px-5 py-2 bg-blue-600 text-white rounded-xl">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}