import { Repository } from "types/Repository";
import Project, { ProjectAttributes } from "./model";

export interface ProjectsRepository extends Repository<ProjectAttributes> {
  save(name: ProjectAttributes["name"]): Promise<ProjectAttributes>;
  find(name: Project["name"]): Promise<ProjectAttributes | null>;
  delete(id: Project["id"]);
  getAll(): Promise<ProjectAttributes[]>;
}

export class ProjectRepository implements ProjectsRepository {
  find(name: string): Promise<ProjectAttributes> {
    throw new Error("Method not implemented.");
  }

  async delete(id: Project["id"]) {
    await Project.destroy({ where: { id } });
  }

  async exists(
    field: keyof ProjectAttributes,
    value: string | number
  ): Promise<boolean> {
    const project = await Project.findOne({ where: { [field]: value } });

    return Boolean(project);
  }

  async save(name: Project["name"]): Promise<ProjectAttributes> {
    const t = await Project.create({ name });
    return t;
  }

  async getAll(): Promise<Project[]> {
    const projects = await Project.findAll();

    return projects;
  }

  async rename(id: Project["id"], name: Project["name"]): Promise<Project> {
    const candidate = await Project.findByPk(id);

    if (!candidate) {
      throw new Error("record not found");
    }

    candidate.name = name;

    candidate.save();

    return candidate;
  }

  async getById(
    id: ProjectAttributes["id"]
  ): Promise<ProjectAttributes | null> {
    const project = await Project.findOne({ where: { id } });

    return project || null;
  }
}
