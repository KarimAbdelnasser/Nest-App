import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  user?: any;
}

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  use(req: CustomRequest, _res: Response, next: NextFunction) {
    if (!req.user || !req.user.isAdmin) {
      throw new UnauthorizedException('Unauthorized - Admin access required');
    }

    next();
  }
}
