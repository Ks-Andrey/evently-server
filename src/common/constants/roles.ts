import { Enum } from '../types/enum';

export const Roles = {
    ADMIN: 'admin',
    ORGANIZER: 'organizer',
    USER: 'user',
} as const;
export type Roles = Enum<typeof Roles>;
