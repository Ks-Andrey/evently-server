import { UUID } from 'crypto';

export class CreateUserResult {
    private constructor(
        readonly userId: UUID,
        readonly message: string,
    ) {}

    static create(userId: UUID): CreateUserResult {
        return new CreateUserResult(userId, 'User created successfully');
    }
}
