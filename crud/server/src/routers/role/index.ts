import { Router } from "express";
import { HttpRoleController } from "modules/ProjectRoles/controller";
import { RoleRepository } from "modules/ProjectRoles/repository";
import { ProjectRoleService } from "modules/ProjectRoles/service";

const repo = new RoleRepository();
const service = new ProjectRoleService(repo);
const controller = new HttpRoleController(service);

const router = Router();

router.get("/role/:name", async (req, res) => controller.getRole(req, res));

export default router;
