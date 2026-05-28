import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../config/bs.js";
import authRoutes from "../routes/authRoutes.js";
import mascotasRoutes from "../routes/mascotasRoutes.js";
dotenv.config();
connectDB();

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.use("/api/auth", authRoutes);
app.use("/api/mascotas", mascotasRoutes);
app.get("/", (req, res) => {
  res.send("catdog API funcionando");
});

app.listen(process.env.PORT, () =>
  console.log("Servidor en puerto", process.env.PORT)
);
