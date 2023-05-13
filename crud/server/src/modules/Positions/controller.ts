import { Request, Response } from "express";
import { HttpError } from "types/HttpError";
import { PositionsService } from "./service";

export class HttpPositionController {
  private readonly _positionService: PositionsService;

  constructor(positionService: PositionsService) {
    this._positionService = positionService;
  }

  async getPosition(req: Request, res: Response) {
    const { name } = req.params;

    try {
      const position = await this._positionService.findByName(String(name));

      res.json(position);
    } catch (error) {
      new HttpError(res, error.message, 500);
    }
  }
}
