import mongoose from "mongoose";

const AvisoGrupoSchema = new mongoose.Schema(
  {
    grupo: { type: mongoose.Schema.Types.ObjectId, ref: "Grupo", required: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    contenido: { type: String, required: true, trim: true },
    tipo: { type: String, enum: ["texto", "ubicacion"], default: "texto" },
    ubicacion: {
      lat: { type: Number },
      lng: { type: Number },
      direccion: { type: String, trim: true, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("AvisoGrupo", AvisoGrupoSchema);