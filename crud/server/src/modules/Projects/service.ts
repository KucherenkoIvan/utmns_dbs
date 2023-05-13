import { ProjectAttributes } from "./model";
import { ProjectRepository } from "./repository";

export interface ProjectsService {
  createProject(name: ProjectAttributes["name"]): void;
  deleteProject(id: ProjectAttributes["id"]): void;
  renameProject(
    id: ProjectAttributes["id"],
    name: ProjectAttributes["name"]
  ): Promise<ProjectAttributes | null>;
  getById(id: ProjectAttributes["id"]): Promise<ProjectAttributes | null>;
  getAll(): Promise<ProjectAttributes[]>;
}

export class ProjectService implements ProjectsService {
  private readonly _projectRepo: ProjectRepository;

  constructor(projectRepo: ProjectRepository) {
    this._projectRepo = projectRepo;
  }

  async renameProject(id: number, name: string) {
    const record = await this._projectRepo.rename(id, name);

    return record;
  }

  async deleteProject(id: number): Promise<void> {
    await this._projectRepo.delete(id);
  }

  async createProject(
    name: ProjectAttributes["name"]
  ): Promise<ProjectAttributes> {
    console.log({ name });
    if (name.length) {
      const t = await this._projectRepo.save(name);
      return t;
    } else throw new Error("project name must be non-empty string");
  }

  async getById(id: ProjectAttributes["id"]): Promise<ProjectAttributes> {
    const project = await this._projectRepo.getById(id);

    return project;
  }

  async getAll(): Promise<ProjectAttributes[]> {
    const allProjects = await this._projectRepo.getAll();

    return allProjects;
  }
}
