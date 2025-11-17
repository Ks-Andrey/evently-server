export const ROLES = {
    ADMIN: 'admin',
    ORGANIZER: 'organizer',
    USER: 'user',
} as const;
export type ROLES = keyof typeof ROLES;
