import { UUID } from 'crypto';

import { UserTypeDTO } from '@application/readers/user-type';

export class UserDTO {
    private constructor(
        readonly id: UUID,
        readonly userType: UserTypeDTO,
        readonly username: string,
        readonly email: string,
        readonly emailVerified: boolean,
        readonly passwordHash: string,
        readonly subscriptionCount: number,
        readonly personalData?: string,
        readonly isBlocked: boolean = false,
        readonly pendingEmail?: string,
        readonly avatarUrl?: string,
    ) {}

    static create(
        id: UUID,
        userType: UserTypeDTO,
        username: string,
        email: string,
        emailVerified: boolean,
        passwordHash: string,
        subscriptionCount: number,
        personalData?: string,
        isBlocked: boolean = false,
        pendingEmail?: string,
        avatarUrl?: string,
    ): UserDTO {
        return new UserDTO(
            id,
            userType,
            username,
            email,
            emailVerified,
            passwordHash,
            subscriptionCount,
            personalData,
            isBlocked,
            pendingEmail,
            avatarUrl,
        );
    }
}
