import mongoose from "mongoose";

const vacunaSchema = new mongoose.Schema(
  {
    mascota: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mascota",
      required: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    fecha: {
      type: Date,
    },
    observaciones: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Vacuna = mongoose.model("Vacuna", vacunaSchema);

export default Vacuna;