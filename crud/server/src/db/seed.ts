import { Positions } from "@/constants/positions";
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

  const userRepo = new UserRepository();
  const userService = new UserService(userRepo, positionRepo);

  await userService.register(
    "admin@email.com",
    "admin",
    "123456",
    Positions.CEO
  );
  await userService.register(
    "ceo@email.com",
    "ima_ceo",
    "123456",
    Positions.CEO
  );
  await userService.register(
    "cto@email.com",
    "ima_cto",
    "123456",
    Positions.CTO
  );
  await userService.register(
    "team_lead@email.com",
    "team_lead",
    "123456",
    Positions.TEAM_LEAD
  );
  await userService.register(
    "dev1@email.com",
    "dev_dev_1",
    "123456",
    Positions.DEV
  );
  await userService.register(
    "dev2@email.com",
    "dev_dev_2",
    "123456",
    Positions.DEV
  );
  await userService.register(
    "dev3@email.com",
    "dev_dev_3",
    "123456",
    Positions.DEV
  );
  await userService.register("qa@email.com", "qqq_qa", "123456", Positions.QA);
  await userService.register(
    "devops@email.com",
    "devops",
    "123456",
    Positions.DEVOPS
  );

  console.log("Seeding finished");
}
