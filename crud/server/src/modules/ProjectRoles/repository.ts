import { Repository } from "types/Repository";
import Role, { ProjectRoleAttributes } from "./model";

export interface ProjectRoleRepository
  extends Repository<ProjectRoleAttributes> {
  save(name: ProjectRoleAttributes["name"]): Promise<void>;
  find(name: Role["name"]): Promise<ProjectRoleAttributes | null>;
  getAll(): Promise<ProjectRoleAttributes[]>;
}

export class ProjectRoleRepository implements ProjectRoleRepository {
  async exists(
    field: keyof ProjectRoleAttributes,
    value: string | number
  ): Promise<boolean> {
    const role = await Role.findOne({ where: { [field]: value } });

    return Boolean(role);
  }

  async save(name: Role["name"]): Promise<void> {
    await Role.create({ name });
  }

  async find(name: Role["name"]): Promise<Role | null> {
    const role = await Role.findOne({ where: { name } });

    return role || null;
  }

  async getAll(): Promise<Role[]> {
    const roles = await Role.findAll();

    return roles;
  }
}
