import { UUID } from 'crypto';

export class ConfirmEmailResult {
    private constructor(
        readonly userId: UUID,
        readonly message: string,
    ) {}

    static create(userId: UUID): ConfirmEmailResult {
        return new ConfirmEmailResult(userId, 'Email confirmed successfully');
    }
}
