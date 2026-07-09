import mongoose from "mongoose";

const AvisoGrupoSchema = new mongoose.Schema(
  {
    grupo: { type: mongoose.Schema.Types.ObjectId, ref: "Grupo", required: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    contenido: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("AvisoGrupo", AvisoGrupoSchema);