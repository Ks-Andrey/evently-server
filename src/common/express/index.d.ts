import { UserJwtPayload } from '../types/jwtUserPayload';

declare global {
    namespace Express {
        interface Request {
            user?: UserJwtPayload;
        }
    }
}
