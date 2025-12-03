import { UUID } from 'crypto';

export class DeleteUserTypeResult {
    private constructor(
        readonly userTypeId: UUID,
        readonly message: string,
    ) {}

    static create(userTypeId: UUID): DeleteUserTypeResult {
        return new DeleteUserTypeResult(userTypeId, 'User type deleted successfully');
    }
}
