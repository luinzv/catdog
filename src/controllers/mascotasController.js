import Mascota from "../models/Mascota.js";

export const getMascotas = async (req, res) => {
  const userId = req.user.id;
  const mascotas = await Mascota.find({ propietario: userId });
  res.json(mascotas);
};

export const createMascota = async (req, res) => {
  const { nombre, tipo, edad, peso, estadoSalud, descripcion, imagen } = req.body;
  const newMascota = await Mascota.create({
    nombre, tipo, edad, peso, estadoSalud, descripcion, imagen,
    propietario: req.user.id
  });
  res.status(201).json(newMascota);
};

export const updateMascota = async (req, res) => {
  const { id } = req.params;
  const updated = await Mascota.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};

export const deleteMascota = async (req, res) => {
  const { id } = req.params;
  await Mascota.findByIdAndDelete(id);
  res.json({ msg: "Mascota eliminada" });
};