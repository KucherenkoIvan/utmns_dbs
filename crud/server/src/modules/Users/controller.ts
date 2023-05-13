import config from "config";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "types/HttpError";
import { UsersService } from "./service";

export class HttpUserController {
  private readonly _userService: UsersService;

  constructor(userService: UsersService) {
    this._userService = userService;
  }

  private async createauthToken(
    id: string,
    nickname: string,
    positionId: string
  ) {
    const authToken = await jwt.sign(
      { id, nickname, positionId },
      config.JWT_SECRET,
      {
        expiresIn: "4h",
      }
    );

    return authToken;
  }

  async register(req: Request, res: Response) {
    const { email, nickname, password, positionId } = req.body;

    try {
      const { id } = await this._userService.register(
        email,
        nickname,
        password,
        positionId
      );

      const authToken = await this.createauthToken(
        id.toString(),
        nickname,
        positionId.toString()
      );

      res
        .cookie("auth", authToken, { maxAge: 4 * 60 * 60 })
        .json({ id, nickname, positionId, authToken });
    } catch (error) {
      new HttpError(res, error.message, 500);
    }
  }

  async authenticate(req: Request, res: Response) {
    const { nickname, password } = req.body;

    try {
      const { id, positionId } = await this._userService.authenticate(
        nickname,
        password
      );

      const authToken = await this.createauthToken(
        id.toString(),
        nickname,
        positionId.toString()
      );

      res
        .cookie("auth", authToken, { maxAge: 4 * 60 * 60 })
        .json({ id, nickname, positionId, authToken });
    } catch (error) {
      new HttpError(res, error.message, 500);
    }
  }

  async getInfo(req: Request, res: Response) {
    const { userId } = req.query;

    try {
      const data = await this._userService.getInfo(userId as string);

      res.json(data);
    } catch (error) {
      new HttpError(res, error.message, 500);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const data = await this._userService.getAll();

      res.json(data);
    } catch (error) {
      new HttpError(res, error.message, 500);
    }
  }
}
