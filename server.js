import express from "express";
import UserAuthRoute from "./routes/Auth.js";
import { db } from "./db-config.js";
const app = express();
app.use(express.json());

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("db connected");
});
app.use("/api/auth", UserAuthRoute);

app.listen(4000, () => {
  console.log("server running");
});
