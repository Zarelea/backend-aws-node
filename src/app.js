require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const { verifyToken, requireRole } = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CloudControl API funcionando correctamente",
  });
});

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Ruta exclusiva para administradores
app.get("/api/admin", verifyToken, requireRole("admin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Acceso autorizado: usuario administrador",
    user: req.user,
  });
});

// Ruta protegida mediante JWT
app.get("/api/protected", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Acceso autorizado al recurso protegido",
    user: req.user,
  });
});

// Ruta para comprobar el estado de la API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "online",
    service: "CloudControl Backend",
  });
});

// Manejo de rutas inexistentes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor Backend ejecutándose en el puerto ${PORT}`);
});
