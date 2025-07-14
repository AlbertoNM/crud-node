import express from "express";
import bodyParser from "body-parser";
import { z } from "zod";
import { User } from "./schema.js";

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello Chichard");
});

app.get("/users", async (req, res) => {
  res.json(await User.findAll());
});

const createUserSchema = z.object({
  name: z.string(),
  mail: z.email(),
  password: z.string(),
});

app.post("/users", async (req, res) => {
  
  const body = createUserSchema.safeParse(req.body)
  
  if (! body.success) {
    res.sendStatus(400);
    return;
  }

  const user = await User.create(body.data);
  res.status(201);
  res.json(user)

});

app.get("/users/:id", async (req, res) => {

  const {id} = req.params

  const [user] = await User.findAll({
    where: {
      id
    }
  })

  if (! user) {
    res.sendStatus(404);
    return;
  }

  res.json(user)

});

app.listen(3000, () => {
  console.log("app listening on port 3000");
});
