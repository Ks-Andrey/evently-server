import { UUID } from 'crypto';

import { UserTypeDTO } from '@application/readers/user-type';

export class UserDTO {
    constructor(
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
}
