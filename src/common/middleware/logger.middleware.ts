import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const requestId = randomUUID();
        const start = Date.now();

        (req as any).requestId = requestId;

        console.log(
            `[REQ] ${requestId} ${req.method} ${req.originalUrl}`,
        );

        res.on('finish', () => {
            const duration = Date.now() - start;
            console.log(
                `[RES] ${requestId} ${res.statusCode} ${duration}ms`,
            );
        });

        next();
    }
}
