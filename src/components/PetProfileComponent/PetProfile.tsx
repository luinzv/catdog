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
export default function PetsPage() {
  const [showModalPetCreate, setShowModalPetCreate] = useState(false);

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [estadoSalud, setEstadoSalud] = useState("Excelente");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {

  const obtenerMascotas = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:4000/api/mascotas",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setMascotas(data);

    } catch (error) {

      console.error(error);

    }
  };

  obtenerMascotas();

}, []);


  const handleCreateMascota = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const response = await fetch("http://localhost:4000/api/mascotas", {
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

      setNombre("");
      setTipo("");
      setEdad("");
      setPeso("");
      setEstadoSalud("Excelente");
      setDescripcion("");
      setImagen("");

      setShowModalPetCreate(false);
    } catch (error) {
      console.error("Error creando mascota:", error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-cyan-50">

      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

            <div>


              <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                Mis Mascotas
              </h1>
            </div>

            <button onClick={() => setShowModalPetCreate(true)} className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/30 text-white font-semibold rounded-2xl px-6 py-3 flex items-center gap-2 transition-all">
              <Plus className="w-5 h-5" />
              Agregar Mascota
            </button>

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

              <input
                type="text"
                placeholder="Tipo: Perro o Gato"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
              />

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

              <textarea
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModalPetCreate(false)}
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
                <p className="text-slate-600 text-sm font-medium">Total Mascotas</p>
                <p className="text-4xl font-bold text-slate-900 mt-1">4</p>
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
                <p className="text-4xl font-bold text-emerald-600 mt-1">2</p>
              </div>

              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Revisión Pendiente</p>
                <p className="text-4xl font-bold text-blue-600 mt-1">1</p>
              </div>

              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">En Tratamiento</p>
                <p className="text-4xl font-bold text-amber-600 mt-1">1</p>
              </div>

              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

        </div>

        {/* GRID MASCOTAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

          {/* CARD MASCOTA */}
          {mascotas.map((mascota: any) => (

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

          <button className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 px-3 py-2 flex items-center justify-center gap-1 text-sm font-medium transition">
            <FileText className="w-4 h-4" />
            Ficha
          </button>

          <button className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 px-3 py-2 flex items-center justify-center gap-1 text-sm font-medium transition">
            <Edit2 className="w-4 h-4" />
            Editar
          </button>

        </div>

      </div>

    </div>

  ))}
        </div>

      </main>
    </div>
  );
}