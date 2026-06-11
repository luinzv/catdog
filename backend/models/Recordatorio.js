import mongoose from "mongoose";

const recordatorioSchema = new mongoose.Schema(
  {
    mascota: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mascota",
      required: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },

    titulo: {
      type: String,
      required: true,
      trim: true,
    },

    descripcion: {
      type: String,
      default: "",
    },

    fecha: {
      type: Date,
      required: true,
    },

    estado: {
      type: String,
      enum: ["Pendiente", "Completado"],
      default: "Pendiente",
    },

    tipo: {
      type: String,
      enum: ["Vacuna", "Control", "Medicacion", "Otro"],
      default: "Otro",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Recordatorio", recordatorioSchema);