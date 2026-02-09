import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request & { requestId?: string }, res: Response, next: NextFunction) {
    const incoming = req.header('x-request-id');
    const id = incoming && incoming.trim().length > 0 ? incoming : randomUUID();

    req.requestId = id;
    res.setHeader('x-request-id', id);

    next();
  }
}
