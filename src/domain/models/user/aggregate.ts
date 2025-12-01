import { hash, compare } from 'bcrypt';
import { UUID } from 'crypto';

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
    AvatarUrlCannotBeEmptyException,
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
        private _imageUrl?: string,
    ) {}

    static createSync(
        id: UUID,
        userType: UserType,
        username: string,
        email: string,
        passwordHash: string,
        personalData?: string,
        isBlocked: boolean = false,
        subscriptionCount: number = 0,
        emailVerified: boolean = false,
        pendingEmail?: string,
        imageUrl?: string,
    ): User {
        User.ensureValidId(id);
        User.ensureValidUserType(userType);
        User.ensureValidUsername(username);
        User.ensureValidEmail(email);
        User.ensureValidPassword(passwordHash);
        User.ensureValidSubscriptionCount(subscriptionCount);

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
            pendingEmail?.trim(),
            imageUrl?.trim(),
        );
    }

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
        User.ensureValidId(id);
        User.ensureValidUserType(userType);
        User.ensureValidUsername(username);
        User.ensureValidEmail(email);
        User.ensureValidPassword(password);
        User.ensureValidSubscriptionCount(subscriptionCount);

        const passwordHash = await hash(password, 10);

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
            undefined,
        );
    }

    private static ensureValidId(id: UUID): void {
        if (!id || id.trim().length === 0) {
            throw new UserIdCannotBeEmptyException();
        }
    }

    private static ensureValidUserType(userType: UserType): void {
        if (!userType) {
            throw new UserTypeIsRequiredException();
        }
    }

    private static ensureValidUsername(username: string): void {
        if (!username || username.trim().length === 0) {
            throw new UsernameCannotBeEmptyException();
        }
    }

    private static ensureValidEmail(email: string): void {
        if (!email || !email.includes('@')) {
            throw new InvalidEmailFormatException();
        }
    }

    private static ensureValidPassword(password: string): void {
        if (!password || password.trim().length === 0) {
            throw new PasswordHashCannotBeEmptyException();
        }
    }

    private static ensureValidSubscriptionCount(count: number): void {
        if (count < 0) {
            throw new SubscriptionCountCannotBeNegativeException();
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

    get passwordHash(): string | undefined {
        return this._passwordHash;
    }

    get imageUrl(): string | undefined {
        return this._imageUrl;
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
        if (this._emailVerified) throw new EmailAlreadyVerifiedException();
        this._emailVerified = true;
    }

    requestEmailChange(newEmail: string): void {
        User.ensureValidEmail(newEmail);
        const normalized = newEmail.trim();
        if (normalized.toLowerCase() === this._email.toLowerCase()) {
            throw new PendingEmailMatchesCurrentException();
        }
        if (this._pendingEmail?.toLowerCase() === normalized.toLowerCase()) {
            throw new PendingEmailAlreadyRequestedException();
        }
        this._pendingEmail = normalized;
        this._emailVerified = false;
    }

    confirmPendingEmail(expectedEmail: string): void {
        if (!this._pendingEmail) throw new PendingEmailNotFoundException();
        if (this._pendingEmail.toLowerCase() !== expectedEmail.trim().toLowerCase()) {
            throw new PendingEmailMismatchException();
        }
        this.changeEmail(this._pendingEmail);
    }

    cancelPendingEmail(): void {
        if (!this._pendingEmail) throw new PendingEmailNotFoundException();
        this._pendingEmail = undefined;
        this._emailVerified = true;
    }

    changeUsername(newName: string): void {
        User.ensureValidUsername(newName);
        this._username = newName.trim();
    }

    changeUserData(newUserData: string | undefined): void {
        this._personalData = newUserData?.trim();
    }

    canEditedBy(userId: UUID): boolean {
        return this._id === userId;
    }

    async changePassword(newPassword: string): Promise<void> {
        User.ensureValidPassword(newPassword);
        this._passwordHash = await hash(newPassword, 10);
    }

    async ensureValidPassword(password: string): Promise<void> {
        if (!(await compare(password, this._passwordHash))) {
            throw new PasswordNotVerified();
        }
    }

    changeAvatar(imageUrl: string | undefined): void {
        if (imageUrl !== undefined && (!imageUrl || imageUrl.trim().length === 0)) {
            throw new AvatarUrlCannotBeEmptyException();
        }
        this._imageUrl = imageUrl?.trim();
    }
}
