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
import intervencionRoutes from "./routes/intervencionRoutes.js";
import cors from "cors";
import { limpiarMascotasEncontradas } from "./utils/limpiarEncontradas.js";

dotenv.config();

const app = express();

app.use(express.json());

const corsOptions = {
  origin: true,
  credentials: false,
};
app.use(cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/mascotas", mascotasRoutes);
app.use("/api/historial", historialRoutes);
app.use("/api/recordatorios", recordatorioRoutes);
app.use("/api/vacunas", vacunasRoutes);
app.use("/api/alergias", alergiasRoutes);
app.use("/api/intervenciones", intervencionRoutes);
app.use("/api/mascotas-perdidas", mascotaPerdidaRoutes);

app.get("/", (req, res) => {
  res.send("catdog API funcionando");
});

const iniciarServidor = async () => {
  await connectDB(); // Espera a que la conexión esté lista

  // Solo después de conectar ejecutamos la limpieza
  limpiarMascotasEncontradas();
  setInterval(limpiarMascotasEncontradas, 24 * 60 * 60 * 1000);

  app.listen(process.env.PORT, () =>
    console.log("Servidor en puerto", process.env.PORT)
  );
};

iniciarServidor();