import { ProjectParticipantsAttributes } from "./model";
import { ProjectParticipantRepository } from "./repository";

export interface ProjectParticipantsService {
  updateProjectParticipant(
    projectId: ProjectParticipantsAttributes["projectId"],
    roleId: ProjectParticipantsAttributes["roleId"],
    newRoleId: ProjectParticipantsAttributes["roleId"],
    userId: ProjectParticipantsAttributes["userId"]
  ): void;
  createProjectParticipants(
    projectId: ProjectParticipantsAttributes["projectId"],
    roleId: ProjectParticipantsAttributes["roleId"],
    userId: ProjectParticipantsAttributes["userId"]
  ): void;
  deleteProjectParticipants(
    projectId: ProjectParticipantsAttributes["projectId"],
    roleId: ProjectParticipantsAttributes["roleId"],
    userId: ProjectParticipantsAttributes["userId"]
  ): void;
  find(
    projectId: ProjectParticipantsAttributes["projectId"],
    userId: ProjectParticipantsAttributes["userId"]
  ): Promise<ProjectParticipantsAttributes[] | null>;
  getAll(): Promise<ProjectParticipantsAttributes[]>;
}

export class ProjectParticipantService implements ProjectParticipantsService {
  private readonly _projectParticipantsRepo: ProjectParticipantRepository;

  constructor(projectRepo: ProjectParticipantRepository) {
    this._projectParticipantsRepo = projectRepo;
  }
  async updateProjectParticipant(
    projectId: number,
    roleId: number,
    newRoleId: number,
    userId: string
  ): Promise<void> {
    await this._projectParticipantsRepo.update(
      projectId,
      roleId,
      newRoleId,
      userId
    );
  }
  async deleteProjectParticipants(
    projectId: number,
    roleId: number,
    userId: string
  ): Promise<void> {
    await this._projectParticipantsRepo.delete(projectId, roleId, userId);
  }

  async createProjectParticipants(
    projectId: ProjectParticipantsAttributes["projectId"],
    roleId: ProjectParticipantsAttributes["roleId"],
    userId: ProjectParticipantsAttributes["userId"]
  ): Promise<void> {
    await this._projectParticipantsRepo.save(projectId, roleId, userId);
  }

  async find(
    projectId: ProjectParticipantsAttributes["projectId"],
    userId: ProjectParticipantsAttributes["userId"]
  ): Promise<ProjectParticipantsAttributes[]> {
    const p1 = projectId
      ? await this._projectParticipantsRepo.findByProject(projectId)
      : [];
    const p2 = userId
      ? await this._projectParticipantsRepo.findByUser(userId)
      : [];

    return [...p1, ...p2];
  }

  async getAll(): Promise<ProjectParticipantsAttributes[]> {
    const allProjects = await this._projectParticipantsRepo.getAll();

    return allProjects;
  }
}
