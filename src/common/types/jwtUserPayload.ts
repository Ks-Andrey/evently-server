import { UUID } from 'crypto';

import { Roles } from '../config/roles';

export interface UserJwtPayload {
    userId: UUID;
    role: Roles;
}
