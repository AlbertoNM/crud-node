import express from "express";
import { User } from "./schema.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Chichard");
});

app.get("/users", async(req, res) => {
  res.json(await User.findAll());
});

app.listen(3000, () => {
  console.log("app listening on port 3000");
});
