import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import db from "./db";
import { seed } from "./db/seed";
import rootRouter from "./routers";

function startServer() {
  const app = express();

  app.use(cors());
  app.options("*", cors);

  app.use(express.json());
  app.use(cookieParser());
  app.use(rootRouter);

  const port = 5000;

  app.listen(port, () => {
    console.log("Server started on port", port);
  });
}

setTimeout(() => db.sync({ force: true }).then(seed).then(startServer), 10000);
