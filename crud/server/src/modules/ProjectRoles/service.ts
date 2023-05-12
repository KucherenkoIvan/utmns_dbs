import { ProjectRoleAttributes } from "./model";
import { ProjectRoleRepository } from "./repository";

export interface ProjectRolesService {
  createRole(name: ProjectRoleAttributes["name"]): void;
  findRoleByName(
    name: ProjectRoleAttributes["name"]
  ): Promise<ProjectRoleAttributes | null>;
  getAllRoles(): Promise<ProjectRoleAttributes[]>;
}

export class ProjectRoleService implements ProjectRolesService {
  private readonly _roleRepo: ProjectRoleRepository;

  constructor(roleRepo: ProjectRoleRepository) {
    this._roleRepo = roleRepo;
  }

  async createRole(name: ProjectRoleAttributes["name"]): Promise<void> {
    if (name.length) {
      await this._roleRepo.save(name);
    } else throw new Error("Role name must be non-empty string");
  }

  async findRoleByName(
    name: ProjectRoleAttributes["name"]
  ): Promise<ProjectRoleAttributes> {
    const role = await this._roleRepo.find(name);

    return role;
  }

  async getAllRoles(): Promise<ProjectRoleAttributes[]> {
    const allRoles = await this._roleRepo.getAll();

    return allRoles;
  }
}
