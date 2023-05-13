import { HttpProjectParticipantController } from "@/modules/ProjectParticipants/controller";
import { ProjectParticipantRepository } from "@/modules/ProjectParticipants/repository";
import { ProjectParticipantService } from "@/modules/ProjectParticipants/service";
import { HttpProjectController } from "@/modules/Projects/controller";
import { ProjectRepository } from "@/modules/Projects/repository";
import { ProjectService } from "@/modules/Projects/service";
import { Router } from "express";

const repo = new ProjectRepository();
const service = new ProjectService(repo);
const controller = new HttpProjectController(service);

const rp = new ProjectParticipantRepository();
const srv = new ProjectParticipantService(rp);
const crt = new HttpProjectParticipantController(srv);

const router = Router();

router.get("/project", async (req, res) => controller.getProject(req, res));

router.get("/project/participants", async (req, res) =>
  crt.getProjectParticipants(req, res)
);

router.post("/project/participants", async (req, res) =>
  crt.addProjectParticipant(req, res)
);

router.put("/project/participants", async (req, res) =>
  crt.updateProjectParticipant(req, res)
);

router.get("/projects", async (req, res) =>
  crt.getProjectsByParticipant(req, res)
);

router.post("/project", async (req, res) => controller.createProject(req, res));

router.put("/project", async (req, res) => controller.renameProject(req, res));

router.delete("/project", async (req, res) =>
  controller.deleteProject(req, res)
);

router.delete("/project/participants", async (req, res) =>
  crt.removeProjectParticipants(req, res)
);

export default router;
