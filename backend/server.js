import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/bs.js";
import authRoutes from "./routes/authRoutes.js";
import mascotasRoutes from "./routes/mascotasRoutes.js";
import historialRoutes from "./routes/historialRoutes.js";
import vacunasRoutes from "./routes/vacunasRoutes.js";
import alergiasRoutes from "./routes/alergiasRoutes.js";
import recordatorioRoutes from "./routes/recordatorioRoutes.js";
import mascotaPerdidaRoutes from "./routes/mascotaPerdidaRoutes.js";
import cors from "cors";
import { limpiarMascotasEncontradas } from "./utils/limpiarEncontradas.js";
import intervencionRoutes from "./routes/intervencionRoutes.js";


const app = express();

limpiarMascotasEncontradas();
setInterval(limpiarMascotasEncontradas, 24 * 60 * 60 * 1000); 
app.use(express.json()); 
const corsOptions = {
  origin: true,
  credentials: false
};

app.use(cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/mascotas", mascotasRoutes);
app.use("/api/historial", historialRoutes);
app.get("/", (req, res) => {
  res.send("catdog API funcionando");
});
app.use("/api/recordatorios", recordatorioRoutes);
app.use("/api/vacunas", vacunasRoutes);
app.use("/api/alergias", alergiasRoutes);
app.use('/api/intervenciones', intervencionRoutes);

app.listen(process.env.PORT, () =>
  console.log("Servidor en puerto", process.env.PORT)
);

app.use("/api/mascotas-perdidas", mascotaPerdidaRoutes);