import {
  Plus,
  CheckCircle,
  Clock,
  Zap,
  PawPrint,
  Edit2,
  FileText,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Mascota = {
  _id: string;
  nombre: string;
  tipo: string;
  edad: number;
  peso: number;
  estadoSalud?: string;
  descripcion?: string;
  imagen?: string;
};

export default function PetsPage() {
  const navigate = useNavigate();
  const [showModalPetCreate, setShowModalPetCreate] = useState(false);
  const [showModalEditPet, setShowModalEditPet] = useState(false);

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [estadoSalud, setEstadoSalud] = useState("Excelente");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");

  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [selectedMascota, setSelectedMascota] = useState<Mascota | null>(null);

  const limpiarFormulario = () => {
    setNombre("");
    setTipo("");
    setEdad("");
    setPeso("");
    setEstadoSalud("Excelente");
    setDescripcion("");
    setImagen("");
    setSelectedMascota(null);
  };

  const openEditModal = (mascota: Mascota) => {
    setSelectedMascota(mascota);
    setNombre(mascota.nombre || "");
    setTipo(mascota.tipo || "");
    setEdad(String(mascota.edad ?? ""));
    setPeso(String(mascota.peso ?? ""));
    setShowModalEditPet(true);
  };

  const obtenerMascotas = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Error al obtener mascotas");
      }

      setMascotas(data.mascotas || []);
    } catch (error) {
      console.error("Error obteniendo mascotas:", error);
    }
  };

  useEffect(() => {
    obtenerMascotas();
  }, []);

  const handleCreateMascota = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre.trim() || !tipo.trim() || !edad || !peso) {
      console.error("Todos los campos son requeridos");
      return;
    }

    const token = localStorage.getItem("token");

    const nuevaMascota = {
      nombre,
      tipo,
      edad: Number(edad),
      peso: Number(peso),
      estadoSalud,
      descripcion,
      imagen,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevaMascota),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Error al crear mascota");
      }

      console.log("Mascota creada:", data);

      // Actualiza la lista inmediatamente
      setMascotas(prev => [...prev, data.mascota]);

      limpiarFormulario();
      setShowModalPetCreate(false);
    } catch (error) {
      console.error("Error creando mascota:", error);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedMascota) {
      console.error("No hay mascota seleccionada");
      return;
    }

    if (!nombre.trim() || !tipo.trim() || !edad || !peso) {
      console.error("Todos los campos son requeridos");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/mascotas/${selectedMascota._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre,
            tipo,
            edad: Number(edad),
            peso: Number(peso),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Error al actualizar mascota");
      }

      console.log("Mascota actualizada:", data);

      // Actualiza la tarjeta inmediatamente
      setMascotas((prev) =>
        prev.map((mascota) =>
          mascota._id === selectedMascota._id ? data.mascota : mascota
        )
      );

      limpiarFormulario();
      setShowModalEditPet(false);
    } catch (error) {
      console.error("Error al guardar mascota:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedMascota) {
      console.error("No hay mascota seleccionada");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/mascotas/${selectedMascota._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar mascota");
      }

      console.log("Mascota eliminada");

      // Elimina la tarjeta inmediatamente
      setMascotas((prev) =>
        prev.filter((mascota) => mascota._id !== selectedMascota._id)
      );

      limpiarFormulario();
      setShowModalEditPet(false);
    } catch (error) {
      console.error("Error al eliminar mascota:", error);
    }
  };

  const mascotasSaludables = mascotas.filter(
    (mascota) => mascota.estadoSalud === "Excelente"
  ).length;

  const mascotasTratamiento = mascotas.filter(
    (mascota) => mascota.estadoSalud === "En tratamiento"
  ).length;

  const mascotasPendientes = mascotas.filter(
    (mascota) => mascota.estadoSalud === "Pendiente"
  ).length;
  console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="ext-xl sm:text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                CatDog
              </h1>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Mis Mascotas
              </h1>
            </div>
            <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-8">

              <nav className="flex gap-6 sm:gap-8">
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">
                  Inicio
                </a>

                <a href="/mascotas" className="text-blue-600 hover:text-blue-600 transition">
                  Mascotas
                </a>
                <a href="/recordatorios" className="text-gray-600 hover:text-blue-600 transition">
                  Recordatorios
                </a>
                <a href="/perfil" className="text-gray-600 font-medium">
                  Perfil
                </a>
              </nav>
              <button
                onClick={() => {
                  limpiarFormulario();
                  setShowModalPetCreate(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/30 text-white font-semibold rounded-2xl px-6 py-3 flex items-center gap-2 transition-all"
              >
                <Plus className="w-5 h-5" />
                Agregar Mascota
              </button>
            </div>


          </div>
        </div>
      </header>

      {/* MODAL CREAR MASCOTA */}
      {showModalPetCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Crear Mascota
            </h2>

            <form className="space-y-4" onSubmit={handleCreateMascota}>
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
              />

              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Selecciona tipo</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
              </select>

              <input
                type="number"
                placeholder="Edad"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
              />

              <input
                type="number"
                placeholder="Peso"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
              />

              <select
                value={estadoSalud}
                onChange={(e) => setEstadoSalud(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="Excelente">Excelente</option>
                <option value="En tratamiento">En tratamiento</option>
                <option value="Pendiente">Pendiente</option>
              </select>

              <input
                type="text"
                placeholder="URL de imagen"
                value={imagen}
                onChange={(e) => setImagen(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
              />

              <textarea
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    limpiarFormulario();
                    setShowModalPetCreate(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Total Mascotas
                </p>
                <p className="text-4xl font-bold text-slate-900 mt-1">
                  {mascotas.length}
                </p>
              </div>

              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Saludables
                </p>
                <p className="text-4xl font-bold text-emerald-600 mt-1">
                  {mascotasSaludables}
                </p>
              </div>

              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Revisión Pendiente
                </p>
                <p className="text-4xl font-bold text-blue-600 mt-1">
                  {mascotasPendientes}
                </p>
              </div>

              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  En Tratamiento
                </p>
                <p className="text-4xl font-bold text-amber-600 mt-1">
                  {mascotasTratamiento}
                </p>
              </div>

              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* GRID MASCOTAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                    <h3 className="text-2xl font-bold text-slate-900">
                      {mascota.nombre}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      {mascota.tipo}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b border-slate-100">
                  <div className="bg-blue-50 rounded-2xl p-3">
                    <p className="text-xs text-slate-600 font-medium">
                      Edad
                    </p>

                    <p className="text-lg font-bold text-blue-600 mt-1">
                      {mascota.edad} años
                    </p>
                  </div>

                  <div className="bg-cyan-50 rounded-2xl p-3">
                    <p className="text-xs text-slate-600 font-medium">
                      Peso
                    </p>

                    <p className="text-lg font-bold text-cyan-600 mt-1">
                      {mascota.peso} kg
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 px-3 py-2 flex items-center justify-center gap-1 text-sm font-medium transition">
                    <Eye className="w-4 h-4" />
                    Perfil
                  </button>

                  <button onClick={() => navigate(`/ficha-medica/${mascota._id}`)} className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 px-3 py-2 flex items-center justify-center gap-1 text-sm font-medium transition">
                    <FileText className="w-4 h-4" />
                    Ficha
                  </button>

                  <button
                    onClick={() => openEditModal(mascota)}
                    className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 px-3 py-2 flex items-center justify-center gap-1 text-sm font-medium transition"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL EDITAR MASCOTA */}
        {showModalEditPet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Editar Mascota
                </h2>

                <button
                  onClick={() => {
                    limpiarFormulario();
                    setShowModalEditPet(false);
                  }}
                  className="text-slate-500 hover:text-slate-700 text-xl"
                >
                  ✕
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSave}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nombre
                  </label>

                  <input
                    type="text"
                    placeholder="Nombre"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    onChange={(e) => setNombre(e.target.value)}
                    value={nombre}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tipo
                  </label>

                  <select
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    onChange={(e) => setTipo(e.target.value)}
                    value={tipo}
                  >
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Edad
                  </label>

                  <input
                    type="number"
                    placeholder="Edad"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    onChange={(e) => setEdad(e.target.value)}
                    value={edad}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Peso
                  </label>

                  <input
                    type="number"
                    placeholder="Peso"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    onChange={(e) => setPeso(e.target.value)}
                    value={peso}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleDelete}
                    type="button"
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition"
                  >
                    Eliminar
                  </button>

                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}