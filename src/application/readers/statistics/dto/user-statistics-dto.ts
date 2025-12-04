export class UserStatisticsDTO {
    private constructor(
        readonly total: number,
        readonly byRole: {
            admin: number;
            organizer: number;
            user: number;
        },
        readonly active: number,
        readonly blocked: number,
        readonly withTelegram: number,
        readonly emailVerified: number,
    ) {}

    static create(
        total: number,
        byRole: { admin: number; organizer: number; user: number },
        active: number,
        blocked: number,
        withTelegram: number,
        emailVerified: number,
    ): UserStatisticsDTO {
        return new UserStatisticsDTO(total, byRole, active, blocked, withTelegram, emailVerified);
    }
}
