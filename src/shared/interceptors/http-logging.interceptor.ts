import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request & { requestId?: string; user?: any }>();
    const res = http.getResponse<Response>();

    const start = Date.now();

    const method = req.method;
    const path = req.originalUrl || req.url;

    const requestId =
      req.requestId ||
      (req.headers['x-request-id'] as string | undefined) ||
      (res.getHeader('x-request-id') as string | undefined);

    const user = this.safeUser(req.user);

    console.log(
      JSON.stringify({
        level: 'info',
        event: 'http_request_start',
        requestId,
        method,
        path,
        user,
        timestamp: new Date().toISOString(),
      }),
    );

    return next.handle().pipe(
      tap(() => {
        const durationMs = Date.now() - start;
        const statusCode = res.statusCode;

        console.log(
          JSON.stringify({
            level: 'info',
            event: 'http_request_end',
            requestId,
            method,
            path,
            statusCode,
            durationMs,
            user,
            timestamp: new Date().toISOString(),
          }),
        );
      }),
      catchError((err) => {
        const durationMs = Date.now() - start;
        const statusCode = res.statusCode || 500;

        const payload: any = {
          level: statusCode >= 500 ? 'error' : 'warn',
          event: 'http_request_error',
          requestId,
          method,
          path,
          statusCode,
          durationMs,
          user,
          errorName: err?.name,
          errorMessage: err?.message,
          timestamp: new Date().toISOString(),
        };

        if (statusCode >= 500 && err?.stack) {
          payload.stack = err.stack;
        }

        console.log(JSON.stringify(payload));

        throw err;
      }),
    );
  }

  private safeUser(user: any) {
    if (!user) return undefined;
    return {
      sub: user.sub ?? user.id ?? undefined,
      username: user.username ?? user.email ?? undefined,
    };
  }
}
