import Alergia from "../models/Alergia.js";

export const getAlergias = async (req, res) => {
  try {
    const { mascotaId } = req.params;
    const alergias = await Alergia.find({ mascota: mascotaId });
    res.json(alergias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener alergias" });
  }
};

export const createAlergia = async (req, res) => {
  try {
    const { mascotaId } = req.params;
    const { tipo, gravedad, observaciones } = req.body;

    const nuevaAlergia = new Alergia({
      mascota: mascotaId,
      tipo,
      gravedad,
      observaciones,
    });

    await nuevaAlergia.save();
    res.status(201).json(nuevaAlergia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear alergia" });
  }
};

export const updateAlergia = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, gravedad, observaciones } = req.body;

    const alergiaActualizada = await Alergia.findByIdAndUpdate(
      id,
      { tipo, gravedad, observaciones },
      { new: true } 
    );

    if (!alergiaActualizada) {
      return res.status(404).json({ msg: "Alergia no encontrada" });
    }

    res.json(alergiaActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar alergia" });
  }
};

export const deleteAlergia = async (req, res) => {
  try {
    const { id } = req.params;

    const alergiaEliminada = await Alergia.findByIdAndDelete(id);

    if (!alergiaEliminada) {
      return res.status(404).json({ msg: "Alergia no encontrada" });
    }

    res.json({ msg: "Alergia eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar alergia" });
  }
};