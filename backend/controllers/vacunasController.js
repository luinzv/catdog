import Vacuna from "../models/Vacuna.js";

export const getVacunas = async (req, res) => {
  try {
    const vacunas = await Vacuna.find({ mascota: req.params.mascotaId });
    res.json(vacunas);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener vacunas" });
  }
};

export const createVacuna = async (req, res) => {
  try {
    const nuevaVacuna = new Vacuna({ ...req.body, mascota: req.params.mascotaId });
    await nuevaVacuna.save();
    res.status(201).json(nuevaVacuna);
  } catch (error) {
    res.status(500).json({ msg: "Error al crear vacuna" });
  }
};

export const updateVacuna = async (req, res) => {
  try {
    const vacunaActualizada = await Vacuna.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!vacunaActualizada) {
      return res.status(404).json({ msg: "Vacuna no encontrada" });
    }

    res.json(vacunaActualizada);
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar vacuna" });
  }
};

export const deleteVacuna = async (req, res) => {
  try {
    const vacunaEliminada = await Vacuna.findByIdAndDelete(req.params.id);

    if (!vacunaEliminada) {
      return res.status(404).json({ msg: "Vacuna no encontrada" });
    }

    res.json({ msg: "Vacuna eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar vacuna" });
  }
};

