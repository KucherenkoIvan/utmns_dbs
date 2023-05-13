import { Request, Response } from "express";
import { HttpError } from "types/HttpError";
import { ProjectsService } from "./service";

export class HttpProjectController {
  private readonly _ProjectService: ProjectsService;

  constructor(projectService: ProjectsService) {
    this._ProjectService = projectService;
  }

  async getProject(req: Request, res: Response) {
    const { id } = req.query;

    try {
      const Project = await this._ProjectService.getById(Number(id));

      res.json(Project);
    } catch (error) {
      new HttpError(res, error.message, 500);
    }
  }

  async renameProject(req: Request, res: Response) {
    const { id, name } = req.body;

    try {
      const Project = await this._ProjectService.renameProject(
        Number(id),
        name
      );

      res.json(Project);
    } catch (error) {
      new HttpError(res, error.message, 500);
    }
  }

  async createProject(req: Request, res: Response) {
    const { name } = req.body;

    try {
      const project = await this._ProjectService.createProject(name);

      res.json(project);
    } catch (error) {
      new HttpError(res, error.message, 500);
    }
  }

  async deleteProject(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const project = await this._ProjectService.deleteProject(Number(id));

      res.json(project);
    } catch (error) {
      new HttpError(res, error.message, 500);
    }
  }
}
