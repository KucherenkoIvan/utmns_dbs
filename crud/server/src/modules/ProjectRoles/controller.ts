import { Request, Response } from "express";
import { HttpError } from "types/HttpError";
import { ProjectRolesService } from "./service";

export class HttpRoleController {
  private readonly _roleService: ProjectRolesService;

  constructor(roleService: ProjectRolesService) {
    this._roleService = roleService;
  }

  async getRole(req: Request, res: Response) {
    const { name } = req.params;

    try {
      const role = await this._roleService.findRoleByName(String(name));

      res.json(role);
    } catch (error) {
      new HttpError(res, error.message, 500);
    }
  }
}
