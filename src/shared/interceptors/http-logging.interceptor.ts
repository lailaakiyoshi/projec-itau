import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request & { requestId?: string; user?: any }>();
    const res = http.getResponse<any>();

    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const durationMs = Date.now() - start;

          const log = {
            level: 'info',
            msg: 'HTTP request',
            requestId: req.requestId,
            method: (req as any).method,
            path: (req as any).originalUrl || (req as any).url,
            statusCode: res.statusCode,
            durationMs,
            user: req.user?.sub ?? req.user?.id ?? undefined,
          };

          console.log(JSON.stringify(log));
        },
      }),
    );
  }
}
