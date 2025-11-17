import { UUID } from 'crypto';

export interface UserJwtPayload {
    userId: UUID;
    roles: string[];
}
