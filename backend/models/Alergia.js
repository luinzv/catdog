import mongoose from "mongoose";

const alergiaSchema = new mongoose.Schema(
  {
    mascota: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mascota",
      required: true,
    },
    tipo: {
      type: String,
      required: true,
      trim: true,
    },
    gravedad: {
      type: String,
      enum: ["Leve", "Moderada", "Alta"],
      default: "Leve",
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

const Alergia = mongoose.model("Alergia", alergiaSchema);

export default Alergia;