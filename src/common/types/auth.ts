import { UUID } from 'crypto';

import { Roles } from '../config/roles';

export interface UserJwtPayload {
    userId: UUID;
    role: Roles;
}

export type TokenType = 'access' | 'refresh';

export type Tokens = { accessToken: string; refreshToken: string };
