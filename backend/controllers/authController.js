import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ msg: "El email ya está registrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: passwordHash,
    });

    const token = jwt.sign(
      { id: nuevoUsuario._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      msg: "Usuario registrado correctamente",
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email y password son obligatorios" });
    }

    const usuario = await Usuario.findOne({ email }).select("+password");
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    if (!usuario.password) {
      return res.status(500).json({ msg: "Usuario no tiene password guardado" });
    }

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Credenciales inválidas" });
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

    const { password: _, ...usuarioSinPassword } = usuario.toObject();

    return res.json({ usuario: usuarioSinPassword, token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};
