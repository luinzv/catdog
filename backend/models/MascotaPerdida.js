import mongoose from "mongoose";

const mascotaPerdidaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    tipo: { type: String, required: true },
    descripcion: { type: String, required: true },
    imagen: { type: String, default: "" },
    fechaPerdida: { type: Date, required: true },
    ubicacion: { type: String, required: true },
    contacto: { type: String, required: true },
    estado: { type: String, enum: ["Perdida", "Encontrada"], default: "Perdida" },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
  },
  { timestamps: true }
);

const MascotaPerdida = mongoose.model("MascotaPerdida", mascotaPerdidaSchema);
export default MascotaPerdida;