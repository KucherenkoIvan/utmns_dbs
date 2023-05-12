import { Router } from "express";
import roleRouter from "./role";
import userRouter from "./user";

const rootRouter = Router();

rootRouter.use("/api", roleRouter, userRouter);

export default rootRouter;
