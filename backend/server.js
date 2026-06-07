import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/bs.js";
import authRoutes from "./routes/authRoutes.js";
import mascotasRoutes from "./routes/mascotasRoutes.js";
import historialRoutes from "./routes/historialRoutes.js";
import vacunasRoutes from "./routes/vacunasRoutes.js";
import alergiasRoutes from "./routes/alergiasRoutes.js";
import recordatorioRoutes from "./routes/recordatorioRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.use("/api/auth", authRoutes);
app.use("/api/mascotas", mascotasRoutes);
app.use("/api/historial", historialRoutes);
app.get("/", (req, res) => {
  res.send("catdog API funcionando");
});
app.use("/api/recordatorios", recordatorioRoutes);
app.use("/api/vacunas", vacunasRoutes);
app.use("/api/alergias", alergiasRoutes);

app.listen(process.env.PORT, () =>
  console.log("Servidor en puerto", process.env.PORT)
);
