import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { IMessage, MSG_MASTER } from '@/message/msg-master';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const origin = request.headers.origin;
    if (origin) {
      response.header('Access-Control-Allow-Origin', origin);
      response.header('Access-Control-Allow-Credentials', 'true');
      response.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Accept',
      );
      response.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      );
    }

    let messageCode: number;
    let message: string;
    let error: string;

    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'code' in exceptionResponse &&
      'description' in exceptionResponse
    ) {
      const msgObj = exceptionResponse as IMessage;
      messageCode = msgObj.code;
      message = msgObj.description;
      error = msgObj.msg;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const res = exceptionResponse as { message: string[] | string };
      message = Array.isArray(res.message)
        ? res.message.join(', ')
        : res.message;
      messageCode = MSG_MASTER.NOT_FOUND.code;
      error = MSG_MASTER.NOT_FOUND.msg;
    } else {
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exception.message;
      messageCode = MSG_MASTER.GENERIC_SERVER_ERROR.code;
      error = MSG_MASTER.GENERIC_SERVER_ERROR.msg;
    }

    const errorResponsePayload = {
      statusCode: status,
      messageCode,
      error,
      message,
    };

    this.logger.warn(
      `HTTP Exception: ${status} - ${JSON.stringify(errorResponsePayload)}`,
    );
    response.status(status).send(errorResponsePayload);
  }
}
