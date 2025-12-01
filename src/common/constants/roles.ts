import { Enum } from '../types/enum';

export const Roles = {
    ADMIN: 'ADMIN',
    ORGANIZER: 'ORGANIZER',
    USER: 'USER',
} as const;
export type Roles = Enum<typeof Roles>;
