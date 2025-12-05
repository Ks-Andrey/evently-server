import { UUID } from 'crypto';

export class UserListView {
    private constructor(
        readonly id: UUID,
        readonly username: string,
        readonly email: string,
        readonly userType: string,
        readonly subscriptionCount: number,
        readonly isBlocked: boolean = false,
        readonly avatarUrl?: string,
    ) {}

    static create(
        id: UUID,
        username: string,
        email: string,
        userType: string,
        subscriptionCount: number,
        isBlocked: boolean = false,
        avatarUrl: string | undefined,
    ): UserListView {
        return new UserListView(id, username, email, userType, subscriptionCount, isBlocked, avatarUrl);
    }
}
