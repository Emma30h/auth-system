import express, { json } from "express";
import path from "path";
import { config } from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "./routes/auth.routes.js";
import cors from "cors";

config();

// Express
const app = express();
const _dirname = path.resolve();

// 🛡️ Middleware para evitar rutas malformadas como /api/: o /api/:/123
app.use((req, res, next) => {
  const invalidParamPattern = /\/:[^a-zA-Z]/;
  if (invalidParamPattern.test(req.originalUrl)) {
    console.error("❌ Ruta malformada detectada:", req.originalUrl);
    return res.status(400).json({ error: "Invalid route" });
  }
  next();
});

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(json());
app.use(morgan("dev"));
app.use(cookieParser());

// Rutas del backend
app.use("/api/auth", routes);

// 🔥 Producción: servir el frontend desde el build
if (process.env.NODE_ENV === "production") {
  // Servir archivos estáticos (JS, CSS, imágenes, etc.)
  app.use(express.static(path.join(_dirname, "frontend", "dist")));

  // Fallback para rutas de React (SPA)
   app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
  });
}

export default app;