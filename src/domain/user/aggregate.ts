import { UUID } from 'crypto';

import { hash, compare } from '@common/utils/password-hash';

import { UserType } from './entities/user-type';
import {
    UserAlreadyBlockedException,
    UserNotBlockedException,
    InvalidEmailFormatException,
    UsernameCannotBeEmptyException,
    PasswordHashCannotBeEmptyException,
    UserIdCannotBeEmptyException,
    UserTypeIsRequiredException,
    SubscriptionCountCannotBeNegativeException,
    CannotDecrementSubscriptionCountBelowZeroException,
    EmailAlreadyVerifiedException,
    PendingEmailMatchesCurrentException,
    PendingEmailAlreadyRequestedException,
    PendingEmailNotFoundException,
    PendingEmailMismatchException,
    PasswordNotVerified,
} from './exceptions';

export class User {
    private constructor(
        private readonly _id: UUID,
        private _userType: UserType,
        private _username: string,
        private _email: string,
        private _emailVerified: boolean,
        private _passwordHash: string,
        private _subscriptionCount: number,
        private _personalData?: string,
        private _isBlocked: boolean = false,
        private _pendingEmail?: string,
    ) {}

    static async create(
        id: UUID,
        userType: UserType,
        username: string,
        email: string,
        password: string,
        personalData?: string,
        isBlocked: boolean = false,
        subscriptionCount: number = 0,
        emailVerified: boolean = false,
    ): Promise<User> {
        if (!id || id.trim().length === 0) {
            throw new UserIdCannotBeEmptyException();
        }
        if (!userType) {
            throw new UserTypeIsRequiredException();
        }
        if (!username || username.trim().length === 0) {
            throw new UsernameCannotBeEmptyException();
        }
        User.ensureValidEmail(email);
        if (!password || password.trim().length === 0) {
            throw new PasswordHashCannotBeEmptyException();
        }
        if (subscriptionCount < 0) {
            throw new SubscriptionCountCannotBeNegativeException();
        }

        const passwordHash = await hash(password);

        return new User(
            id,
            userType,
            username.trim(),
            email.trim(),
            emailVerified,
            passwordHash,
            subscriptionCount,
            personalData?.trim(),
            isBlocked,
            undefined,
        );
    }

    private static ensureValidEmail(email: string): void {
        if (!email || !email.includes('@')) {
            throw new InvalidEmailFormatException();
        }
    }

    get id(): UUID {
        return this._id;
    }

    get userType(): UserType {
        return this._userType;
    }

    get username(): string {
        return this._username;
    }

    get email(): string {
        return this._email;
    }

    get isEmailVerified(): boolean {
        return this._emailVerified;
    }

    get passwordHash(): string {
        return this._passwordHash;
    }

    get personalData(): string | undefined {
        return this._personalData;
    }

    get isBlocked(): boolean {
        return this._isBlocked;
    }

    get subscriptionCount(): number {
        return this._subscriptionCount;
    }

    get pendingEmail(): string | undefined {
        return this._pendingEmail;
    }

    incrementSubscriptionCount(): void {
        this._subscriptionCount += 1;
    }

    decrementSubscriptionCount(): void {
        if (this._subscriptionCount === 0) {
            throw new CannotDecrementSubscriptionCountBelowZeroException();
        }
        this._subscriptionCount -= 1;
    }

    block(): void {
        if (this._isBlocked) throw new UserAlreadyBlockedException();
        this._isBlocked = true;
    }

    unblock(): void {
        if (!this._isBlocked) throw new UserNotBlockedException();
        this._isBlocked = false;
    }

    changeEmail(newEmail: string): void {
        User.ensureValidEmail(newEmail);
        this._email = newEmail.trim();
        this._pendingEmail = undefined;
        this._emailVerified = true;
    }

    markEmailVerified(): void {
        if (this._emailVerified) {
            throw new EmailAlreadyVerifiedException();
        }
        this._emailVerified = true;
    }

    requestEmailChange(newEmail: string): void {
        User.ensureValidEmail(newEmail);
        const normalized = newEmail.trim();
        if (normalized.toLowerCase() === this._email.toLowerCase()) {
            throw new PendingEmailMatchesCurrentException();
        }
        if (this._pendingEmail && this._pendingEmail.toLowerCase() === normalized.toLowerCase()) {
            throw new PendingEmailAlreadyRequestedException();
        }
        this._pendingEmail = normalized;
        this._emailVerified = false;
    }

    confirmPendingEmail(expectedEmail: string): void {
        if (!this._pendingEmail) {
            throw new PendingEmailNotFoundException();
        }
        if (this._pendingEmail.toLowerCase() !== expectedEmail.trim().toLowerCase()) {
            throw new PendingEmailMismatchException();
        }
        this.changeEmail(this._pendingEmail);
    }

    cancelPendingEmail(): void {
        if (!this._pendingEmail) {
            throw new PendingEmailNotFoundException();
        }
        this._pendingEmail = undefined;
        this._emailVerified = true;
    }

    changeUsername(newName: string): void {
        if (!newName || newName.trim().length === 0) {
            throw new UsernameCannotBeEmptyException();
        }
        this._username = newName.trim();
    }

    changeUserData(newUserData: string | undefined): void {
        this._personalData = newUserData;
    }

    canEditedBy(userId: UUID): boolean {
        return this._id === userId;
    }

    async changePassword(newPassword: string): Promise<void> {
        if (!newPassword || newPassword.trim().length === 0) {
            throw new PasswordHashCannotBeEmptyException();
        }
        this._passwordHash = await hash(newPassword);
    }

    async validPassword(password: string): Promise<void> {
        if (!compare(password, this._passwordHash)) {
            throw new PasswordNotVerified();
        }
    }
}
