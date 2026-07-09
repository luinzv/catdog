import mongoose from "mongoose";
const AmistadSchema = new mongoose.Schema({
  solicitante: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  receptor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  estado: { type: String, enum: ["pendiente", "aceptada", "rechazada"], default: "pendiente" },
}, { timestamps: true });
export default mongoose.model("Amistad", AmistadSchema);