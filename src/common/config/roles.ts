export const Roles = {
    ADMIN: 'admin',
    ORGANIZER: 'organizer',
    USER: 'user',
} as const;
export type Roles = (typeof Roles)[keyof typeof Roles];
