import { UUID } from 'crypto';

export class CreateUserTypeResult {
    private constructor(
        readonly userTypeId: UUID,
        readonly message: string,
    ) {}

    static create(userTypeId: UUID): CreateUserTypeResult {
        return new CreateUserTypeResult(userTypeId, 'User type created successfully');
    }
}
