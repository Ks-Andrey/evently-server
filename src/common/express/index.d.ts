import { UserJwtPayload } from '../types/auth';

declare global {
    namespace Express {
        interface Request {
            user?: UserJwtPayload;
        }
    }
}
