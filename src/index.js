import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { z } from "zod";
import { User } from "./schema.js";

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

const loginSchema = z.object({
  mail: z.email(),
  password: z.string(),
});

app.post("/login", async (req, res) => {
  const body = loginSchema.safeParse(req.body);

  if (!body.success) {
    res.sendStatus(400);
    return;
  }

  const [user] = await User.findAll({
    where: {
      mail: body.data.mail,
    },
  });

  if (!user) {
    res.sendStatus(404);
    return;
  }

  const passwordMatch = await bcrypt.compare(body.data.password, user.password);

  if (!passwordMatch) {
    res.sendStatus(401);
    return;
  }

  const token = jwt.sign({...user}, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ token });
});

app.use((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.sendStatus(403);
    return;
  }

  try {
    const decoded = jwt.verify(authHeader.substring(7), process.env.JWT_SECRET);
    next()
  } catch {
    res.sendStatus(401);
    return;
  }

});

app.get("/users", async (req, res) => {
  const filters = [];

  if (req.query.name) {
    filters.push({ name: { [Op.iLike]: `%${req.query.name}%` } });
  }
  if (req.query.mail) {
    filters.push({ mail: { [Op.iLike]: `%${req.query.mail}%` } });
  }

  const where = filters.length > 0 ? { [Op.or]: filters } : {};

  const users = await User.findAll({
    limit: 10,
    where,
  });

  res.json(users);
});

const createUserSchema = z.object({
  name: z.string(),
  mail: z.email(),
  password: z.string(),
});

app.post("/users", async (req, res) => {
  const body = createUserSchema.safeParse(req.body);

  if (!body.success) {
    res.sendStatus(400);
    return;
  }

  const hashedPassword = await bcrypt.hash(body.data.password, 10);

  const user = await User.create({ ...body.data, password: hashedPassword });
  res.status(201);
  res.json(user);
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  const [user] = await User.findAll({
    where: {
      id,
    },
  });

  if (!user) {
    res.sendStatus(404);
    return;
  }

  res.json(user);
});

const patchUserSchema = createUserSchema
  .partial()
  .extend({ active: z.boolean().optional() });

app.patch("/users/:id", async (req, res) => {
  const body = patchUserSchema.safeParse(req.body);

  if (!body.success) {
    res.sendStatus(400);
    return;
  }

  const { id } = req.params;

  const [user] = await User.findAll({
    where: {
      id,
    },
  });

  if (!user) {
    res.sendStatus(404);
    return;
  }

  await user.update(body.data);

  res.json(user);
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  const [user] = await User.findAll({
    where: {
      id,
    },
  });

  if (!user) {
    res.sendStatus(404);
    return;
  }

  await user.destroy();

  res.json(user);
});

app.listen(3000, () => {
  console.log("app listening on port 3000");
});
