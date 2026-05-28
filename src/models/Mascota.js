import mongoose from "mongoose";

const mascotaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    tipo: {
      type: String,
      required: true,
      enum: ["Perro", "Gato"],
    },

    edad: {
      type: Number,
      required: true,
    },

    peso: {
      type: Number,
      required: true,
    },

    estadoSalud: {
      type: String,
      enum: ["Excelente", "En tratamiento", "Pendiente"],
      default: "Excelente",
    },

    descripcion: {
      type: String,
      default: "",
    },

    imagen: {
      type: String,
      default: "",
    },

    propietario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Mascota = mongoose.model("Mascota", mascotaSchema);

export default Mascota;