import { Request, Response } from "express";
import { HttpError } from "types/HttpError";
import { PositionsService } from "./service";

export class HttpRoleController {
  private readonly _roleService: PositionsService;

  constructor(roleService: PositionsService) {
    this._roleService = roleService;
  }

  async getRole(req: Request, res: Response) {
    const { name } = req.params;

    try {
      const role = await this._roleService.findByName(String(name));

      res.json(role);
    } catch (error) {
      new HttpError(res, error.message, 500);
    }
  }
}
