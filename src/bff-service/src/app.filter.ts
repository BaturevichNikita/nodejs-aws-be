import { HttpStatus } from '@nestjs/common';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException, Error)
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exceprtion: HttpException, host: ArgumentsHost) {
    host
      .switchToHttp()
      .getResponse()
      .status(HttpStatus.BAD_GATEWAY)
      .send('Cannot process request');
  }
}
