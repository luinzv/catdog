const mongoose = require('mongoose');

const IntervencionSchema = new mongoose.Schema(
  {
    mascota: { type: mongoose.Schema.Types.ObjectId, ref: 'Mascota', required: true },
    fecha: { type: Date, required: true },
    tipo: { type: String, required: true },
    veterinario: { type: String, required: true },
    notas: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Intervencion || mongoose.model('Intervencion', IntervencionSchema);
