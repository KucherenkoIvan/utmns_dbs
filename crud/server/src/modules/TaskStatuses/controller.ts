import { Request, Response } from "express";
import { HttpError } from "types/HttpError";
import { TaskStatussService } from "./service";

export class HttpTaskStatusController {
  private readonly _taskstatusService: TaskStatussService;

  constructor(taskstatusService: TaskStatussService) {
    this._taskstatusService = taskstatusService;
  }

  async getTaskStatus(req: Request, res: Response) {
    const { name } = req.params;

    try {
      const taskstatus = await this._taskstatusService.findByName(String(name));

      res.json(taskstatus);
    } catch (error) {
      new HttpError(res, error.message, 500);
    }
  }
}
