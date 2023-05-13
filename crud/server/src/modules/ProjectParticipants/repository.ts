import { Repository } from "types/Repository";
import ProjectParticipant, { ProjectParticipantsAttributes } from "./model";

export interface ProjectsPadticipantsRepository
  extends Repository<ProjectParticipantsAttributes> {
  save(
    projectId: ProjectParticipantsAttributes["projectId"],
    roleId: ProjectParticipantsAttributes["roleId"],
    userId: ProjectParticipantsAttributes["userId"]
  ): Promise<void>;
  findByProject(
    projectId: ProjectParticipantsAttributes["projectId"]
  ): Promise<ProjectParticipantsAttributes[] | null>;
  findByUser(
    projectId: ProjectParticipantsAttributes["userId"]
  ): Promise<ProjectParticipantsAttributes[] | null>;
  getAll(): Promise<ProjectParticipantsAttributes[]>;
}

export class ProjectParticipantRepository
  implements ProjectsPadticipantsRepository
{
  async exists(
    field: keyof ProjectParticipantsAttributes,
    value: string | number
  ): Promise<boolean> {
    const project = await ProjectParticipant.findOne({
      where: { [field]: value },
    });

    return Boolean(project);
  }

  async save(
    projectId: ProjectParticipantsAttributes["projectId"],
    roleId: ProjectParticipantsAttributes["roleId"],
    userId: ProjectParticipantsAttributes["userId"]
  ): Promise<void> {
    await ProjectParticipant.create({ projectId, userId, roleId });
  }

  async delete(
    projectId: ProjectParticipantsAttributes["projectId"],
    roleId: ProjectParticipantsAttributes["roleId"],
    userId: ProjectParticipantsAttributes["userId"]
  ): Promise<void> {
    await ProjectParticipant.destroy({ where: { projectId, userId, roleId } });
  }

  async update(
    projectId: ProjectParticipantsAttributes["projectId"],
    roleId: ProjectParticipantsAttributes["roleId"],
    newRoleId: ProjectParticipantsAttributes["roleId"],
    userId: ProjectParticipantsAttributes["userId"]
  ): Promise<void> {
    const candidate = await ProjectParticipant.update(
      { roleId: newRoleId },
      {
        where: { roleId, projectId, userId },
      }
    );

    console.log(candidate, roleId, newRoleId);
  }

  async findByProject(
    projectId: ProjectParticipantsAttributes["projectId"]
  ): Promise<ProjectParticipant[] | null> {
    const project = await ProjectParticipant.findAll({
      where: { projectId: projectId },
    });

    return project || null;
  }

  async findByUser(
    userId: ProjectParticipantsAttributes["userId"]
  ): Promise<ProjectParticipant[] | null> {
    const project = await ProjectParticipant.findAll({
      where: { userId: userId },
    });

    return project || null;
  }

  async getAll(): Promise<ProjectParticipant[]> {
    const projects = await ProjectParticipant.findAll();

    return projects;
  }
}
