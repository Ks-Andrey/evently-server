import { UserJwtPayload } from '@common/types/auth';

declare global {
    namespace Express {
        interface Request {
            user?: UserJwtPayload;
        }
    }
}
