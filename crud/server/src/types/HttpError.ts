import { Response } from 'express';

export class HttpError extends Error {
  constructor (res: Response, message = 'Error: HttpError', code = 500) {
    res.status(code).json({ error: message, code });

    super(message);
  }

  get message() {
    return this.message;
  }
}
