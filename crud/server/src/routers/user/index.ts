import { PositionRepository } from "@/modules/Positions/repository";
import { Router } from "express";
import { HttpUserController } from "modules/Users/controller";
import { UserRepository } from "modules/Users/repository";
import { UserService } from "modules/Users/service";

const positionRepo = new PositionRepository();

const repo = new UserRepository();
const service = new UserService(repo, positionRepo);
const controller = new HttpUserController(service);

const router = Router();

router.post("/user/register", (req, res) => controller.register(req, res));
router.post("/user/auth", (req, res) => controller.authenticate(req, res));
router.get("/user/info", (req, res) => controller.getInfo(req, res));
router.get("/users", (req, res) => controller.getAll(req, res));

export default router;
