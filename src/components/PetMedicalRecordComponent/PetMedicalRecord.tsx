import {
  Syringe,
  Calendar,
  AlertCircle,
  Stethoscope,
  Edit3,
  Plus,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";

export default function PetMedicalRecord() {

  const { id } = useParams();
  const [mascota, setMascota] = useState<any>(null);
  const [vacunas, setVacunas] = useState<any[]>([]);
  const [alergias, setAlergias] = useState<any[]>([]);
  const [showModalAddMedical, setShowModalAddMedical] = useState(false);
  const [vacunaNombre, setVacunaNombre] = useState("");
  const [alergiaTipo, setAlergiaTipo] = useState("");
  const [alergiaGravedad, setAlergiaGravedad] = useState("");
  const [showModalEditMedical, setShowModalEditMedical] = useState(false);
  const [showModalEditPet, setShowModalEditPet] = useState(false);
  const [editEdad, setEditEdad] = useState(0);
  const [editPeso, setEditPeso] = useState(0);
  const [editEstadoSalud, setEditEstadoSalud] = useState("");
  const [recordatorios, setRecordatorios] = useState<any[]>([]);
  const agregarVacuna = async () => {
    if (!vacunaNombre) return;
    try {
      const token = localStorage.getItem("token");
      const bodyData: any = { nombre: vacunaNombre };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vacunas/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
      setVacunas([...vacunas, data]);
      setVacunaNombre("");
    } catch (error) {
      console.error("Error agregando vacuna:", error);
    }
  };
  useEffect(() => {
    const obtenerRecordatorios = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/recordatorios/mascota/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        console.log("Recordatorios:", data);
        setRecordatorios(data);
      } catch (error) {
        console.error(error);
      }
    };

    obtenerRecordatorios();
  }, [id]);

  const actualizarMascota = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/mascotas/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            edad: editEdad,
            peso: editPeso,
            estadoSalud: editEstadoSalud,
          }),
        }
      );

      const data = await response.json();

      setMascota(data.mascota);
      setShowModalEditPet(false);

    } catch (error) {
      console.error(error);
    }
  };
  const agregarAlergia = async () => {
    if (!alergiaTipo || !alergiaGravedad) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/alergias/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tipo: alergiaTipo, gravedad: alergiaGravedad }),
      });

      const data = await response.json();
      setAlergias([...alergias, data]);
      setAlergiaTipo("");
      setAlergiaGravedad("");
    } catch (error) {
      console.error("Error agregando alergia:", error);
    }
  };

  useEffect(() => {
    const obtenerMascota = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/mascotas/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        setMascota(data.mascota);

      } catch (error) {
        console.error(error);
      }
    };

    obtenerMascota();
  }, [id]);

  useEffect(() => {
    const obtenerDatosMedicos = async () => {
      try {
        const token = localStorage.getItem("token");

        const [vacunasRes, alergiasRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/vacunas/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/alergias/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const vacunasData = await vacunasRes.json();
        const alergiasData = await alergiasRes.json();

        setVacunas(vacunasData);
        setAlergias(alergiasData);
      } catch (error) {
        console.error("Error al obtener datos médicos:", error);
      }
    };

    obtenerDatosMedicos();
  }, [id]);

  const handleAddMedical = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowModalAddMedical(false);
    setVacunaNombre("");
    setAlergiaTipo("");
    setAlergiaGravedad("");
  };
  const proximaVacuna = recordatorios.find(
  (r) =>
    r.tipo?.toLowerCase().includes("vacuna") &&
    r.estado?.toLowerCase() === "pendiente"
);

  const proximoControl = recordatorios.find(
    (r) =>
      r.tipo?.toLowerCase().includes("control") &&
      r.estado?.toLowerCase() === "pendiente"
  );
  if (!mascota) {
    return <div>Cargando...</div>;
  }

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
                Ficha Medica de {mascota.nombre}
              </h1>
            </div>
            <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4">
              <nav className="flex gap-6 sm:gap-8">
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Inicio</a>
                <a href="/mascotas" className="text-gray-600 hover:text-blue-600 transition">Mascotas</a>
                <a href="/recordatorios" className="text-gray-600 hover:text-blue-600 transition">Recordatorios</a>
                <a href="/perfil" className="text-gray-600 font-medium">Perfil</a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* TARJETA PRINCIPAL */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-blue-100 hover:shadow-xl transition-shadow duration-300">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 sm:p-8">

            {/* IMAGEN */}
            <div className="sm:col-span-1">

              <div className="w-full aspect-square bg-linear-to-br from-blue-200 to-cyan-200 rounded-2xl overflow-hidden flex items-center justify-center">
                <img
                  src={mascota.imagen}
                  alt="Pet"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* INFO */}
            <div className="sm:col-span-2 flex flex-col justify-between">

              <div>

                <div className="flex items-start justify-between gap-4 mb-4">

                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {mascota.nombre}
                    </h2>

                    <p className="text-lg text-gray-600 mt-1">
                      {mascota.tipo}
                    </p>
                  </div>

                  <div className="px-4 py-2 rounded-full font-semibold text-sm border bg-emerald-100 text-emerald-700 border-emerald-300">
                    {mascota.estadoSalud}
                  </div>

                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">

                  <div className="bg-linear-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
                    <p className="text-gray-600 text-sm font-medium">
                      Edad
                    </p>

                    <p className="text-gray-900 text-lg font-bold">
                      {mascota.edad} años
                    </p>
                  </div>

                  <div className="bg-linear-to-br from-cyan-50 to-cyan-100 p-3 rounded-lg">
                    <p className="text-gray-600 text-sm font-medium">
                      Peso
                    </p>

                    <p className="text-gray-900 text-lg font-bold">
                      {mascota.peso} kg
                    </p>
                  </div>
                  <div className="bg-linear-to-br from-green-50 to-green-100 p-3 rounded-lg">
                    <p className="text-gray-600 text-sm font-medium">
                      Vacunas Aplicadas
                    </p>

                    <p className="text-gray-900 text-lg font-bold">
                      {vacunas.length}
                    </p>
                  </div>
                  <div className="bg-linear-to-br from-yellow-50 to-yellow-100 p-3 rounded-lg">
                    <p className="text-gray-600 text-sm font-medium">
                      Alergias Registradas
                    </p>

                    <p className="text-gray-900 text-lg font-bold">
                      {alergias.length}
                    </p>
                  </div>

                </div>
              </div>

              <button onClick={() => {
                setEditEdad(mascota.edad);
                setEditPeso(mascota.peso);
                setEditEstadoSalud(mascota.estadoSalud);
                setShowModalEditPet(true);
              }} className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">

                <Edit3 className="w-4 h-4" />
                Editar ficha

              </button>

            </div>
          </div>
        </div>

        {/* TARJETAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

          {/* VACUNAS */}
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

            <div className="flex items-center justify-between mb-4">

              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <Syringe className="w-6 h-6 text-blue-600" />
              </div>

              <span className="text-2xl font-bold text-gray-900">
                {vacunas.length}
              </span>

            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Vacunas Aplicadas
            </h3>

            <div className="text-gray-600 text-sm">
              {vacunas.length === 0 ? (
                <p>Sin vacunas aplicadas</p>
              ) : (
                vacunas.map((vacuna) => (
                  <div key={vacuna._id}>
                    <h4 className="font-semibold">{vacuna.nombre}</h4>
                  </div>
                ))
              )}
            </div>

          </div>

          {/* PROXIMA */}
          <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

            <div className="flex items-center justify-between mb-4">

              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>

              <Clock className="w-5 h-5 text-purple-500" />

            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Próxima Vacuna
            </h3>

            <p className="text-gray-600 text-sm">
              15 de julio
            </p>

          </div>

          {/* ALERGIAS */}
          <div className="bg-white rounded-xl shadow-md border border-emerald-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

            <div className="flex items-center justify-between mb-4">

              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-emerald-600" />
              </div>

              <CheckCircle className="w-5 h-5 text-emerald-500" />

            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Alergias
            </h3>

            <div className="text-gray-600 text-sm">
              {alergias.length === 0 ? (
                <p>Sin alergias registradas</p>
              ) : (
                alergias.map((alergia: any) => (
                  <div key={alergia._id} className="mb-1">
                    <p className="font-semibold">{alergia.tipo}</p>
                    <p className="text-xs text-gray-500">{alergia.gravedad}</p>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

        {/* RECORDATORIOS */}
        <div className="mb-8">

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recordatorios
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl p-6 text-white shadow-lg">

              <Syringe className="w-8 h-8 mb-3 opacity-90" />

              <h3 className="font-semibold text-lg mb-1">
                Próxima Vacuna
              </h3>

              <p className="text-white/90 text-sm">
                {proximaVacuna
                  ? new Date(proximaVacuna.fecha).toLocaleDateString()
                  : "Sin vacunas pendientes"}
              </p>

            </div>

            <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl p-6 text-white shadow-lg">

              <Stethoscope className="w-8 h-8 mb-3 opacity-90" />

              <h3 className="font-semibold text-lg mb-1">
                Próximo Control
              </h3>

              <p className="text-white/90 text-sm">
                {proximoControl
                  ? new Date(proximoControl.fecha).toLocaleDateString()
                  : "Sin controles pendientes"}
              </p>

            </div>

          </div>

        </div>

        {/* BOTONES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">

          <button onClick={() => setShowModalAddMedical(true)} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">

            <Plus className="w-5 h-5" />
            Agregar

          </button>

          <button onClick={() => setShowModalEditMedical(true)} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">

            <Edit3 className="w-5 h-5" />
            Editar

          </button>

        </div>
        {showModalEditMedical && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Editar Historial Médico
              </h2>

              <div className="space-y-4">
                {/* VACUNAS */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Vacunas</h3>
                  {vacunas.length === 0 ? (
                    <p className="text-gray-500 text-sm">Sin vacunas registradas</p>
                  ) : (
                    vacunas.map((v) => (
                      <div key={v._id} className="flex items-center justify-between mb-2">
                        <span>{v.nombre}</span>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded"
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem("token");
                              await fetch(`${import.meta.env.VITE_API_URL}/api/vacunas/${v._id}`, {
                                method: "DELETE",
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              setVacunas(vacunas.filter((vac) => vac._id !== v._id));
                            } catch (error) {
                              console.error(error);
                            }
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* ALERGIAS */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Alergias</h3>
                  {alergias.length === 0 ? (
                    <p className="text-gray-500 text-sm">Sin alergias registradas</p>
                  ) : (
                    alergias.map((a) => (
                      <div key={a._id} className="flex items-center justify-between mb-2">
                        <span>{a.tipo} ({a.gravedad})</span>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded"
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem("token");
                              await fetch(`${import.meta.env.VITE_API_URL}/api/alergias/${a._id}`, {
                                method: "DELETE",
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              setAlergias(alergias.filter((al) => al._id !== a._id));
                            } catch (error) {
                              console.error(error);
                            }
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold"
                    onClick={() => setShowModalEditMedical(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showModalEditPet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

              <h2 className="text-2xl font-bold mb-4">
                Editar Ficha Médica
              </h2>

              <div className="space-y-4">

                <div>
                  <label className="block mb-1 font-medium">
                    Edad
                  </label>

                  <input
                    type="number"
                    value={editEdad}
                    onChange={(e) => setEditEdad(Number(e.target.value))}
                    className="w-full border rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    Peso
                  </label>

                  <input
                    type="number"
                    value={editPeso}
                    onChange={(e) => setEditPeso(Number(e.target.value))}
                    className="w-full border rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    Estado de Salud
                  </label>

                  <select
                    value={editEstadoSalud}
                    onChange={(e) => setEditEstadoSalud(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2"
                  >
                    <option value="Excelente">Excelente</option>
                    <option value="En tratamiento">En tratamiento</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>

              </div>

              <div className="flex justify-end gap-3 mt-6">

                <button
                  onClick={() => setShowModalEditPet(false)}
                  className="px-5 py-2 rounded-xl bg-gray-100"
                >
                  Cancelar
                </button>

                <button
                  onClick={actualizarMascota}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white"
                >
                  Guardar
                </button>

              </div>

            </div>
          </div>
        )}
        {showModalAddMedical && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Agregar Historial Médico</h2>
              <form className="space-y-4" onSubmit={handleAddMedical}>
                {/* VACUNAS */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Vacunas</h3>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Nombre vacuna"
                      value={vacunaNombre}
                      onChange={(e) => setVacunaNombre(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <button
                      type="button"
                      onClick={agregarVacuna}
                      className="px-3 py-2 bg-blue-600 text-white rounded-xl"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
                {/* ALERGIAS */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Alergias</h3>
                  <div className="flex flex-col sm:flex-row gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Tipo alergia"
                      value={alergiaTipo}
                      onChange={(e) => setAlergiaTipo(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <select
                      value={alergiaGravedad}
                      onChange={(e) => setAlergiaGravedad(e.target.value)}
                      className="border border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      <option value="">Gravedad</option>
                      <option value="Leve">Leve</option>
                      <option value="Moderada">Moderada</option>
                      <option value="Alta">Alta</option>
                    </select>
                    <button
                      type="button"
                      onClick={agregarAlergia}
                      className="px-3 py-2 bg-blue-600 text-white rounded-xl"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModalAddMedical(false)}
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
      </main>
    </div>
  );
}