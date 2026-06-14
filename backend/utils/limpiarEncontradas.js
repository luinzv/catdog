import MascotaPerdida from "../models/MascotaPerdida.js";

export const limpiarMascotasEncontradas = async () => {
  try {
    const hace3Dias = new Date();
    hace3Dias.setDate(hace3Dias.getDate() - 3);

    const resultado = await MascotaPerdida.deleteMany({
      estado: "Encontrada",
      fechaEncontrada: { $lte: hace3Dias },
    });

    if (resultado.deletedCount > 0) {
      console.log(`🗑️ ${resultado.deletedCount} mascota(s) encontrada(s) eliminada(s) automáticamente.`);
    }
  } catch (error) {
    console.error("Error al limpiar mascotas encontradas:", error);
  }
};