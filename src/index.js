import express from "express"; // Importa Express para crear la API
import bodyParser from "body-parser"; // Middleware para parsear JSON en requests
import bcrypt from "bcrypt"; // Para hashear y comparar contraseñas
import jwt from "jsonwebtoken"; // Para generar y verificar tokens JWT
import { Op } from "sequelize"; // Operadores lógicos de Sequelize
import { z } from "zod"; // Para validar esquemas de datos
import { User } from "./schema.js"; // Modelo de usuario con Sequelize

const app = express(); // Crea la aplicación de Express

app.use(bodyParser.json()); // Aplica middleware para JSON

// Ruta de prueba en GET /
app.get("/", (req, res) => {
  res.send("Hello world!"); // Responde con un saludo
});

// Esquema de validación para login
const loginSchema = z.object({
  mail: z.email(),
  password: z.string(),
});

// Ruta POST /login para autenticar usuarios
app.post("/login", async (req, res) => {
  const body = loginSchema.safeParse(req.body); // Valida el cuerpo

  if (!body.success) {
    res.sendStatus(400); // Bad Request si falla validación
    return;
  }

  const [user] = await User.findAll({ // Busca usuario por correo
    where: { mail: body.data.mail },
  });

  if (!user) {
    res.sendStatus(404); // No encontrado
    return;
  }

  const passwordMatch = await bcrypt.compare(
    body.data.password,
    user.password
  ); // Compara contraseñas

  if (!passwordMatch) {
    res.sendStatus(401); // No autorizado si no coinciden
    return;
  }

  const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  }); // Genera un JWT por 1 hora

  res.json({ token }); // Devuelve el token
});

// Middleware para proteger rutas siguientes
app.use((req, res, next) => {
  const authHeader = req.headers.authorization; // Lee header Authorization

  if (!authHeader) {
    res.sendStatus(403); // Prohibido si no hay token
    return;
  }

  try {
    jwt.verify(authHeader.substring(7), process.env.JWT_SECRET); // Verifica JWT
    next(); // Pasa al siguiente handler si es válido
  } catch {
    res.sendStatus(401); // No autorizado si falla verificación
    return;
  }
});

// Ruta GET /users con filtros opcionales de nombre o correo
app.get("/users", async (req, res) => {
  const filters = []; // Array de condiciones

  if (req.query.name) {
    filters.push({ name: { [Op.iLike]: `%${req.query.name}%` } }); // Filtro por nombre
  }
  if (req.query.mail) {
    filters.push({ mail: { [Op.iLike]: `%${req.query.mail}%` } }); // Filtro por correo
  }

  const where = filters.length > 0 ? { [Op.or]: filters } : {}; // Combina filtros con OR

  const users = await User.findAll({ limit: 10, where }); // Consulta hasta 10 usuarios

  res.json(users); // Devuelve lista de usuarios
});

// Esquema de validación para crear usuario
const createUserSchema = z.object({
  name: z.string(),
  mail: z.email(),
  password: z.string(),
});

// Ruta POST /users para crear nuevo usuario
app.post("/users", async (req, res) => {
  const body = createUserSchema.safeParse(req.body); // Valida cuerpo

  if (!body.success) {
    res.sendStatus(400); // Bad Request
    return;
  }

  const hashedPassword = await bcrypt.hash(body.data.password, 10); // Hashea contraseña

  const user = await User.create({ ...body.data, password: hashedPassword }); // Crea usuario
  res.status(201);
  res.json(user); // Devuelve usuario creado
});

// Ruta GET /users/:id para obtener un usuario por ID
app.get("/users/:id", async (req, res) => {
  const { id } = req.params; // Obtiene ID de parámetros

  const [user] = await User.findAll({ where: { id } }); // Busca usuario

  if (!user) {
    res.sendStatus(404); // No encontrado
    return;
  }

  res.json(user); // Devuelve usuario
});

// Esquema para actualizar usuario (parcial)
const patchUserSchema = createUserSchema.partial().extend({
  active: z.boolean().optional(), // Permite campo active opcional
});

// Ruta PATCH /users/:id para actualizar datos de usuario
app.patch("/users/:id", async (req, res) => {
  const body = patchUserSchema.safeParse(req.body); // Valida cuerpo

  if (!body.success) {
    res.sendStatus(400); // Bad Request
    return;
  }

  const { id } = req.params;

  const [user] = await User.findAll({ where: { id } }); // Busca usuario

  if (!user) {
    res.sendStatus(404); // No encontrado
    return;
  }

  await user.update(body.data); // Actualiza campos

  res.json(user); // Devuelve usuario actualizado
});

// Ruta DELETE /users/:id para eliminar un usuario
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  const [user] = await User.findAll({ where: { id } }); // Busca usuario

  if (!user) {
    res.sendStatus(404); // No encontrado
    return;
  }

  await user.destroy(); // Elimina usuario

  res.json(user); // Devuelve usuario eliminado
});

// Inicia servidor en el puerto 3000
app.listen(3000, () => {
  console.log("app listening on port 3000"); // Mensaje de arranque
});
