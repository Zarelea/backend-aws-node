const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Usuario de demostración
const demoUser = {
  id: 1,
  name: "Hazel",
  email: "hazel.perez79@unach.mx",
  role: "admin",
  passwordHash: bcrypt.hashSync("Hazel01", 10),
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Correo y contraseña son obligatorios",
      });
    }

    if (email !== demoUser.email) {
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      demoUser.passwordHash
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas",
      });
    }

    const token = jwt.sign(
      {
        id: demoUser.id,
        email: demoUser.email,
        role: demoUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Autenticación exitosa",
      token,
      user: {
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
      },
    });
  } catch (error) {
    console.error("Error en autenticación:", error);

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

module.exports = {
  login,
};
