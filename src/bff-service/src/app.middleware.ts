import { Request, Response } from 'express';
import {
  Injectable,
  NestMiddleware,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

@Injectable()
export class ValidateMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    const recipient = req.url.split('/')[1];

    if (!process.env[recipient]) {
      console.log(`There is no recipient url for ${recipient}`);
      throw new HttpException(res, HttpStatus.BAD_GATEWAY);
    }

    next();
  }
}
