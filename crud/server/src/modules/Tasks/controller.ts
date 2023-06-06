import { Request, Response } from "express";
import { HttpError } from "types/HttpError";
import { ProjectParticipantsService } from "./service";

export class HttpProjectParticipantController {
  private readonly _ProjectService: ProjectParticipantsService;

  constructor(projectService: ProjectParticipantsService) {
    this._ProjectService = projectService;
  }

  async getProjectParticipants(req: Request, res: Response) {
    const { projectId } = req.query;

    try {
      const participants = await this._ProjectService.find(
        Number(projectId),
        null
      );

      res.json(participants);
    } catch (error) {
      new HttpError(res, error.message, 500);
    }
  }

  async getProjectsByParticipant(req: Request, res: Response) {
    const { userId } = req.query;

    console.log({ userId });

    try {
      const participants = await this._ProjectService.find(
        null,
        userId as string
      );

      res.json(participants);
    } catch (error) {
      new HttpError(res, error.message, 500);
    }
  }

  async addProjectParticipant(req: Request, res: Response) {
    const { projectId, userId, roleId } = req.body;

    try {
      const participant = await this._ProjectService.createProjectParticipants(
        Number(projectId),
        Number(roleId),
        String(userId)
      );

      res.json(participant);
    } catch (error) {
      console.error(error);
      new HttpError(res, error.message, 500);
    }
  }

  async removeProjectParticipants(req: Request, res: Response) {
    const { projectId, userId, roleId } = req.query;

    try {
      const participant = await this._ProjectService.deleteProjectParticipants(
        Number(projectId),
        Number(roleId),
        String(userId)
      );

      res.json(participant);
    } catch (error) {
      new HttpError(res, error.message, 500);
    }
  }

  async updateProjectParticipant(req: Request, res: Response) {
    const { projectId, userId, roleId, newRoleId } = req.body;

    try {
      const participant = await this._ProjectService.updateProjectParticipant(
        Number(projectId),
        Number(roleId),
        Number(newRoleId),
        String(userId)
      );

      res.json(participant);
    } catch (error) {
      new HttpError(res, error.message, 500);
    }
  }
}
