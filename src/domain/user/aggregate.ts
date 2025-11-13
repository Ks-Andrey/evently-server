import { hash, compare } from '@common/utils/password-hash';

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
} from './exceptions';

export class User {
    private constructor(
        private readonly _id: UUID,
        private _userType: UserType,
        private _username: string,
        private _email: string,
        private _passwordHash: string,
        private _personalData?: string,
        private _isBlocked: boolean = false,
        private _subscriptionCount: number = 0,
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
        if (!email || !email.includes('@')) {
            throw new InvalidEmailFormatException();
        }
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
            passwordHash,
            personalData?.trim(),
            isBlocked,
            subscriptionCount,
        );
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
        if (!newEmail || !newEmail.includes('@')) {
            throw new InvalidEmailFormatException();
        }
        this._email = newEmail.trim();
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

    async changePassword(newPassword: string): Promise<void> {
        if (!newPassword || newPassword.trim().length === 0) {
            throw new PasswordHashCannotBeEmptyException();
        }
        this._passwordHash = await hash(newPassword);
    }

    async validPassword(password: string): Promise<boolean> {
        return await compare(password, this._passwordHash);
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
}
