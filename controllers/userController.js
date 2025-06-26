const UserService = require('../services/userService');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const process = require('process');

dotenv.config();

const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAll();
    console.log('Usuarios obtenidos:', users);
    return res.status(200).json({
      success: true,
      message: 'Usuarios obtenidos correctamente',
      data: users
    });
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los usuarios'
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { correo, clave } = req.body;

    const user = await UserService.findByEmail(correo);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }
    const isMatch = await bcryptjs.compare(clave, user.clave_hash);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciales incorrectas" });
    }

    const tokenPayload = {
      id: user.id_usuario,
      correo: user.correo,
      nombre: user.nombre,
      rol_global: user.rol_global,
    };
    const token = jwt.sign(tokenPayload, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      message: "Login exitoso",
      data: tokenPayload,
      token,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error en el servidor" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { nombre, correo, clave, rol_global } = req.body;

    const clave_hash = await bcryptjs.hash(clave, 10);

    const result = await UserService.registerUser({
      nombre,
      correo,
      clave_hash,
      rol_global,
    });

    return res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: result,
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    if (error.message.includes("El correo ya está registrado")) {
      return res.status(409).json({
        success: false,
        message: "El correo ya está registrado.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error al registrar usuario",
      error: error.message,
    });
  }
};

module.exports = {
  loginUser,
  registerUser,
  getAllUsers
};
