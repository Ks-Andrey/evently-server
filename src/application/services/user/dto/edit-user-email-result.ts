import { UUID } from 'crypto';

export class EditUserEmailResult {
    private constructor(
        readonly userId: UUID,
        readonly message: string,
    ) {}

    static create(userId: UUID): EditUserEmailResult {
        return new EditUserEmailResult(userId, 'Email change requested. Please check your new email for verification');
    }
}
