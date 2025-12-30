import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(
        _context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        return next.handle().pipe(
            map((data) => ({
                success: true,
                message: 'success',
                data: instanceToPlain(data), // 🔥 INI KUNCINYA
            })),
        );
    }
}
