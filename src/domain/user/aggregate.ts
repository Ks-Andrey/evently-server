import { UserType } from './entities/user-type';
import {
    UserAlreadyBlockedException,
    UserNotBlockedException,
    InvalidEmailFormatException,
    UsernameCannotBeEmptyException,
    PasswordHashCannotBeEmptyException,
} from './exceptions';

export class User {
    constructor(
        public readonly id: string,
        public readonly userType: UserType,
        public username: string,
        public email: string,
        public passwordHash: string,
        public personalData?: string,
        public isBlocked: boolean = false,
    ) {}

    block(): void {
        if (this.isBlocked) throw new UserAlreadyBlockedException();
        this.isBlocked = true;
    }

    unblock(): void {
        if (!this.isBlocked) throw new UserNotBlockedException();
        this.isBlocked = false;
    }

    changeEmail(newEmail: string): void {
        if (!newEmail || !newEmail.includes('@')) {
            throw new InvalidEmailFormatException();
        }
        this.email = newEmail;
    }

    changeUsername(newName: string): void {
        if (!newName || newName.trim().length === 0) {
            throw new UsernameCannotBeEmptyException();
        }
        this.username = newName;
    }

    changeUserData(newUserData: string): void {
        this.personalData = newUserData;
    }

    changePassword(newPasswordHash: string): void {
        if (!newPasswordHash || newPasswordHash.length === 0) {
            throw new PasswordHashCannotBeEmptyException();
        }
        this.passwordHash = newPasswordHash;
    }

    isAdmin(): boolean {
        return (
            this.userType.typeName.toLowerCase() === 'administrator' || this.userType.typeName.toLowerCase() === 'admin'
        );
    }

    isOrganizer(): boolean {
        return (
            this.userType.typeName.toLowerCase() === 'organizer' ||
            this.userType.typeName.toLowerCase() === 'организатор'
        );
    }

    isRegularUser(): boolean {
        return (
            this.userType.typeName.toLowerCase() === 'user' || this.userType.typeName.toLowerCase() === 'пользователь'
        );
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
        return this.isAdmin() || (this.isOrganizer() && this.id === eventOrganizerId);
    }

    canDeleteEvent(eventOrganizerId: string): boolean {
        return this.isAdmin() || (this.isOrganizer() && this.id === eventOrganizerId);
    }
}
