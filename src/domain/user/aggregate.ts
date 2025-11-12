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
} from './exceptions';

export class User {
    private readonly _id: string;
    private _userType: UserType;
    private _username: string;
    private _email: string;
    private _passwordHash: string;
    private _personalData?: string;
    private _isBlocked: boolean;
    private _subscriptionCount: number;

    constructor(
        id: string,
        userType: UserType,
        username: string,
        email: string,
        passwordHash: string,
        personalData?: string,
        isBlocked: boolean = false,
        subscriptionCount: number = 0,
    ) {
        if (!id || id.trim().length === 0) {
            throw new UserIdCannotBeEmptyException();
        }
        if (!userType) {
            throw new UserTypeIsRequiredException();
        }
        this.ensureValidUsername(username);
        this.ensureValidEmail(email);
        this.ensureValidPasswordHash(passwordHash);
        if (subscriptionCount < 0) {
            throw new SubscriptionCountCannotBeNegativeException();
        }

        this._id = id;
        this._userType = userType;
        this._username = username.trim();
        this._email = email.trim();
        this._passwordHash = passwordHash;
        this._personalData = personalData;
        this._isBlocked = isBlocked;
        this._subscriptionCount = subscriptionCount;
    }

    get id(): string {
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
        this.ensureValidEmail(newEmail);
        this._email = newEmail.trim();
    }

    changeUsername(newName: string): void {
        this.ensureValidUsername(newName);
        this._username = newName.trim();
    }

    changeUserData(newUserData: string | undefined): void {
        this._personalData = newUserData;
    }

    changePassword(newPasswordHash: string): void {
        this.ensureValidPasswordHash(newPasswordHash);
        this._passwordHash = newPasswordHash;
    }

    isAdmin(): boolean {
        const typeName = this._userType.typeName.toLowerCase();
        return typeName === 'administrator' || typeName === 'admin';
    }

    isOrganizer(): boolean {
        const typeName = this._userType.typeName.toLowerCase();
        return typeName === 'organizer' || typeName === 'организатор';
    }

    isRegularUser(): boolean {
        const typeName = this._userType.typeName.toLowerCase();
        return typeName === 'user' || typeName === 'пользователь';
    }

    canManageUsers(): boolean {
        return this.isAdmin();
    }

    canManageEvents(): boolean {
        return this.isAdmin() || this.isOrganizer();
    }

    canManageCategories(): boolean {
        return this.isAdmin();
    }

    canManageComments(): boolean {
        return this.isAdmin();
    }

    canCreateEvents(): boolean {
        return this.isOrganizer();
    }

    canEditEvent(eventOrganizerId: string): boolean {
        return this.isAdmin() || (this.isOrganizer() && this._id === eventOrganizerId);
    }

    canDeleteEvent(eventOrganizerId: string): boolean {
        return this.isAdmin() || (this.isOrganizer() && this._id === eventOrganizerId);
    }

    private ensureValidEmail(email: string): void {
        if (!email || !email.includes('@')) {
            throw new InvalidEmailFormatException();
        }
    }

    private ensureValidUsername(username: string): void {
        if (!username || username.trim().length === 0) {
            throw new UsernameCannotBeEmptyException();
        }
    }

    private ensureValidPasswordHash(passwordHash: string): void {
        if (!passwordHash || passwordHash.length === 0) {
            throw new PasswordHashCannotBeEmptyException();
        }
    }
}
