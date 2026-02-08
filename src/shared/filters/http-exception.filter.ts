import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

type ErrorResponse = {
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  method: string;
  timestamp: string;
  requestId?: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request & { requestId?: string }>();
    const res = ctx.getResponse<Response>();

    const timestamp = new Date().toISOString();
    const path = req.originalUrl || req.url;
    const method = req.method;
    const requestId = req.requestId;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let message: string | string[] = 'Unexpected error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const responseBody = exception.getResponse();
      if (typeof responseBody === 'string') {
        message = responseBody;
        error = exception.name;
      } else {
        const anyBody = responseBody as any;
        message = anyBody.message ?? exception.message;
        error = anyBody.error ?? exception.name;
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }

    const payload: ErrorResponse = {
      statusCode: status,
      error,
      message,
      path,
      method,
      timestamp,
      requestId,
    };

    const level = status >= 500 ? 'error' : 'warn';
    const log = {
      level,
      ...payload,
      stack:
        status >= 500 && exception instanceof Error ? exception.stack : undefined,
    };

    if (level === 'error') {
      console.error(JSON.stringify(log));
    } else {
      console.warn(JSON.stringify(log));
    }

    res.status(status).json(payload);
  }
}
