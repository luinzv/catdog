import mongoose from "mongoose";

const mascotaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    tipo: { type: String, enum: ["Perro", "Gato"], required: true },
    edad: { type: Number, required: true },
    peso: { type: Number },
    estadoSalud: { type: String, enum: ["Excelente","En tratamiento","Pendiente"], default: "Excelente" },
    descripcion: { type: String },
    imagen: { type: String }, 
    propietario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Mascota", mascotaSchema);