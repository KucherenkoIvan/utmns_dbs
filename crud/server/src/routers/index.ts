import { Router } from "express";
import projectsRouter from "./projects";
import roleRouter from "./role";
import userRouter from "./user";

const rootRouter = Router();

rootRouter.use("/api", roleRouter, userRouter, projectsRouter);

export default rootRouter;
