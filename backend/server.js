import express from "express";
import cors from "cors";
import dns from "dns";
import "dotenv/config.js";
import path from "path"; // NEU: Wichtig für Pfad-Berechnungen
import { fileURLToPath } from "url"; // NEU: Wichtig bei ES-Modulen ("type": "module")
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

// DNS-Fix für SRV-Lookup-Probleme unter Windows
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// app config
const app = express();
const port = process.env.PORT || 10000; // Render nutzt standardmäßig Port 10000
connectDB();
connectCloudinary();

// Konfiguration für ES-Module, um absolute Pfade zu ermitteln
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

// --- NEU: FRONTEND INTEGRATION ---
// 1. Statische Dateien aus dem gebauten Frontend-Ordner bereitstellen
app.use(express.static(path.join(__dirname, "frontend", "dist")));

// 2. Alle Anfragen, die KEINE API-Routen sind, an die index.html von React leiten
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Wichtig: '0.0.0.0' hinzufügen, damit Render den Service von außen erreicht
app.listen(port, "0.0.0.0", () => {
  console.log(`Server Started on port: ${port}`);
});
