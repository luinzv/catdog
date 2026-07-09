import mongoose from "mongoose";

const GrupoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, default: "", trim: true },
    creador: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    miembros: [
      {
        usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
        rol: { type: String, enum: ["admin", "miembro"], default: "miembro" },
      },
    ],
    mascotaPerdida: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MascotaPerdida",
      default: null,
    },
    estado: { type: String, enum: ["Activo", "Cerrado"], default: "Activo" },
  },
  { timestamps: true }
);

export default mongoose.model("Grupo", GrupoSchema);