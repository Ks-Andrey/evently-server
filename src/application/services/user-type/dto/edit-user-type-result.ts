import { UUID } from 'crypto';

export class EditUserTypeResult {
    private constructor(
        readonly userTypeId: UUID,
        readonly message: string,
    ) {}

    static create(userTypeId: UUID): EditUserTypeResult {
        return new EditUserTypeResult(userTypeId, 'User type updated successfully');
    }
}
