import { Positions } from "@/constants/positions";
import { ProjectRoles } from "@/constants/projectRoles";
import { ProjectParticipantRepository } from "@/modules/ProjectParticipants/repository";
import { ProjectParticipantService } from "@/modules/ProjectParticipants/service";
import { ProjectRoleRepository } from "@/modules/ProjectRoles/repository";
import { ProjectRoleService } from "@/modules/ProjectRoles/service";
import { ProjectRepository } from "@/modules/Projects/repository";
import { ProjectService } from "@/modules/Projects/service";
import { TaskStatusRepository } from "@/modules/TaskStatuses/repository";
import { TaskStatusService } from "@/modules/TaskStatuses/service";
import { PositionRepository } from "modules/Positions/repository";
import { PositionService } from "modules/Positions/service";
import { UserRepository } from "../modules/Users/repository";
import { UserService } from "../modules/Users/service";

export async function seed() {
  const positionRepo = new PositionRepository();
  const positionService = new PositionService(positionRepo);

  await positionService.createPosition("CEO");
  await positionService.createPosition("CTO");
  await positionService.createPosition("Team Lead");
  await positionService.createPosition("Dev");
  await positionService.createPosition("QA");
  await positionService.createPosition("DevOps");

  const projectRoleRepo = new ProjectRoleRepository();
  const projectRoleService = new ProjectRoleService(projectRoleRepo);

  await projectRoleService.createRole("Owner");
  await projectRoleService.createRole("Maintainer");
  await projectRoleService.createRole("Collaborator");

  const userRepo = new UserRepository();
  const userService = new UserService(userRepo, positionRepo);

  const admin = await userService.register(
    "admin@email.com",
    "admin",
    "123456",
    Positions.CEO
  );
  const ceo = await userService.register(
    "ceo@email.com",
    "ima_ceo",
    "123456",
    Positions.CEO
  );
  const cto = await userService.register(
    "cto@email.com",
    "ima_cto",
    "123456",
    Positions.CTO
  );
  const tl = await userService.register(
    "team_lead@email.com",
    "team_lead",
    "123456",
    Positions.TEAM_LEAD
  );
  const d1 = await userService.register(
    "dev1@email.com",
    "dev_dev_1",
    "123456",
    Positions.DEV
  );
  const d2 = await userService.register(
    "dev2@email.com",
    "dev_dev_2",
    "123456",
    Positions.DEV
  );
  const d3 = await userService.register(
    "dev3@email.com",
    "dev_dev_3",
    "123456",
    Positions.DEV
  );
  const qa = await userService.register(
    "qa@email.com",
    "qqq_qa",
    "123456",
    Positions.QA
  );
  const devops = await userService.register(
    "devops@email.com",
    "devops",
    "123456",
    Positions.DEVOPS
  );

  const projRepo = new ProjectRepository();
  const projSrv = new ProjectService(projRepo);

  const projPtRepo = new ProjectParticipantRepository();
  const projPtSrv = new ProjectParticipantService(projPtRepo);

  const admProj = await projSrv.createProject("Administration");
  projPtSrv.createProjectParticipants(admProj.id, ProjectRoles.OWNER, ceo.id);
  projPtSrv.createProjectParticipants(
    admProj.id,
    ProjectRoles.COLLABORATOR,
    tl.id
  );
  projPtSrv.createProjectParticipants(
    admProj.id,
    ProjectRoles.COLLABORATOR,
    cto.id
  );

  const mainProj = await projSrv.createProject("Main");
  projPtSrv.createProjectParticipants(mainProj.id, ProjectRoles.OWNER, ceo.id);
  projPtSrv.createProjectParticipants(
    mainProj.id,
    ProjectRoles.OWNER,
    admin.id
  );
  projPtSrv.createProjectParticipants(
    mainProj.id,
    ProjectRoles.MAINTAINER,
    tl.id
  );
  projPtSrv.createProjectParticipants(
    mainProj.id,
    ProjectRoles.MAINTAINER,
    cto.id
  );
  projPtSrv.createProjectParticipants(
    mainProj.id,
    ProjectRoles.COLLABORATOR,
    d1.id
  );
  projPtSrv.createProjectParticipants(
    mainProj.id,
    ProjectRoles.COLLABORATOR,
    d2.id
  );
  projPtSrv.createProjectParticipants(
    mainProj.id,
    ProjectRoles.COLLABORATOR,
    d3.id
  );
  projPtSrv.createProjectParticipants(
    mainProj.id,
    ProjectRoles.COLLABORATOR,
    qa.id
  );
  projPtSrv.createProjectParticipants(
    mainProj.id,
    ProjectRoles.COLLABORATOR,
    devops.id
  );

  const devopsProj = await projSrv.createProject("Devops+QA");
  projPtSrv.createProjectParticipants(
    devopsProj.id,
    ProjectRoles.OWNER,
    ceo.id
  );
  projPtSrv.createProjectParticipants(
    devopsProj.id,
    ProjectRoles.OWNER,
    admin.id
  );
  projPtSrv.createProjectParticipants(
    devopsProj.id,
    ProjectRoles.MAINTAINER,
    tl.id
  );
  projPtSrv.createProjectParticipants(
    devopsProj.id,
    ProjectRoles.COLLABORATOR,
    cto.id
  );
  projPtSrv.createProjectParticipants(
    devopsProj.id,
    ProjectRoles.COLLABORATOR,
    devops.id
  );
  projPtSrv.createProjectParticipants(
    devopsProj.id,
    ProjectRoles.COLLABORATOR,
    qa.id
  );

  const taskStatusRepo = new TaskStatusRepository();
  const taskStatusService = new TaskStatusService(taskStatusRepo);

  await taskStatusService.createTaskStatus("backlog");
  await taskStatusService.createTaskStatus("todo");
  await taskStatusService.createTaskStatus("in progress");
  await taskStatusService.createTaskStatus("review");
  await taskStatusService.createTaskStatus("testing");
  await taskStatusService.createTaskStatus("done");

  const taskRepo = null;

  console.log("Seeding finished");
}
