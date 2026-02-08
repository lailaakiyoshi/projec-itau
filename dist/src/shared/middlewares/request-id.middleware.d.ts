import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class RequestIdMiddleware implements NestMiddleware {
    use(req: Request & {
        requestId?: string;
    }, res: Response, next: NextFunction): void;
}
