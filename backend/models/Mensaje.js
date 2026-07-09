import mongoose from "mongoose";

const MensajeSchema = new mongoose.Schema(
  {
    emisor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    receptor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    contenido: { type: String, required: true, trim: true },
    leido: { type: Boolean, default: false },
    tipo: { type: String, enum: ["texto", "ubicacion"], default: "texto" },
    ubicacion: {
      lat: { type: Number },
      lng: { type: Number },
      direccion: { type: String, trim: true, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Mensaje", MensajeSchema);