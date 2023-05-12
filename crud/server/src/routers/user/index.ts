import { Router } from "express";
import { RoleRepository } from "modules/ProjectRoles/repository";
import { HttpUserController } from "modules/Users/controller";
import { UserRepository } from "modules/Users/repository";
import { UserService } from "modules/Users/service";

const roleRepo = new RoleRepository();

const repo = new UserRepository();
const service = new UserService(repo, roleRepo);
const controller = new HttpUserController(service);

const router = Router();

router.post("/user/register", (req, res) => controller.register(req, res));
router.post("/user/auth", (req, res) => controller.authenticate(req, res));

export default router;
