import { UUID } from 'crypto';

import {
    EmailVerificationAlreadyUsedException,
    EmailVerificationEmailCannotBeEmptyException,
    EmailVerificationExpiredException,
    EmailVerificationIdCannotBeEmptyException,
} from '../exceptions';

export enum EmailVerificationPurpose {
    REGISTRATION = 'REGISTRATION',
    EMAIL_CHANGE = 'EMAIL_CHANGE',
}

export class EmailVerification {
    private constructor(
        private readonly _id: UUID,
        private readonly _userId: UUID,
        private readonly _email: string,
        private readonly _purpose: EmailVerificationPurpose,
        private readonly _expiresAt: Date,
        private _used: boolean = false,
    ) {}

    static create(
        id: UUID,
        userId: UUID,
        email: string,
        purpose: EmailVerificationPurpose,
        expiresAt: Date,
    ): EmailVerification {
        if (!id) {
            throw new EmailVerificationIdCannotBeEmptyException();
        }
        if (!email || email.trim().length === 0) {
            throw new EmailVerificationEmailCannotBeEmptyException();
        }

        return new EmailVerification(id, userId, email.trim(), purpose, new Date(expiresAt));
    }

    get id(): UUID {
        return this._id;
    }

    get userId(): UUID {
        return this._userId;
    }

    get email(): string {
        return this._email;
    }

    get purpose(): EmailVerificationPurpose {
        return this._purpose;
    }

    get expiresAt(): Date {
        return this._expiresAt;
    }

    get isUsed(): boolean {
        return this._used;
    }

    isExpired(referenceDate: Date = new Date()): boolean {
        return new Date(referenceDate) > this._expiresAt;
    }

    ensureIsActive(referenceDate: Date = new Date()): void {
        if (this._used) {
            throw new EmailVerificationAlreadyUsedException();
        }
        if (this.isExpired(referenceDate)) {
            throw new EmailVerificationExpiredException();
        }
    }

    markUsed(): void {
        if (this._used) {
            throw new EmailVerificationAlreadyUsedException();
        }
        this._used = true;
    }
}
