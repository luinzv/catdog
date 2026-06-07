import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/bs.js";
import authRoutes from "./routes/authRoutes.js";
import mascotasRoutes from "./routes/mascotasRoutes.js";
import historialRoutes from "./routes/historialRoutes.js";
import vacunasRoutes from "./routes/vacunasRoutes.js";
import alergiasRoutes from "./routes/alergiasRoutes.js";
import recordatorioRoutes from "./routes/recordatorioRoutes.js";
import cors from "cors";


dotenv.config();
connectDB();

const app = express();

app.use(express.json()); 
const corsOptions = {
  origin: "https://catdog-tau-wine.vercel.app", // tu frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.options("/*", cors(corsOptions));


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

app.listen(process.env.PORT, () =>
  console.log("Servidor en puerto", process.env.PORT)
);
