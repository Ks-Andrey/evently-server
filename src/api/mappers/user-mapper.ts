import { UUID } from 'crypto';
import { Request } from 'express';

import { InvalidInputException, NotAuthenticatedException } from '@application/common';
import {
    CreateUser,
    DeleteUser,
    DeleteUserAvatar,
    EditUser,
    EditUserEmail,
    EditUserPassword,
    FindAllUsers,
    FindUserByEmail,
    FindUserById,
    FindUserByName,
    FindUserSubscriptions,
    SubscribeUserToEvent,
    ToggleBlockUser,
    UnsubscribeUserFromEvent,
    UploadUserAvatar,
} from '@application/services/user';

import { parsePaginationParams } from '../common/utils/pagination';

export class UserMapper {
    static toFindUserByIdQuery(req: Request): FindUserById {
        const { id } = req.params;
        return new FindUserById(id as UUID);
    }

    static toFindCurrentUserQuery(req: Request): FindUserById {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        return new FindUserById(req.user.userId);
    }

    static toFindUserByNameQuery(req: Request): FindUserByName {
        const { username } = req.params;
        return new FindUserByName(username);
    }

    static toFindUserByEmailQuery(req: Request): FindUserByEmail {
        const { email } = req.params;
        return new FindUserByEmail(email);
    }

    static toFindAllUsersQuery(req: Request): FindAllUsers {
        const pagination = parsePaginationParams(req);
        const search = req.query.search as string;
        return new FindAllUsers(pagination, search);
    }

    static toFindMySubscriptionsQuery(req: Request): FindUserSubscriptions {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        const pagination = parsePaginationParams(req);
        const search = req.query.search as string;
        return new FindUserSubscriptions(req.user.userId, pagination, search);
    }

    static toFindUserSubscriptionsQuery(req: Request): FindUserSubscriptions {
        const { id } = req.params;
        const pagination = parsePaginationParams(req);
        const search = req.query.search as string;
        return new FindUserSubscriptions(id as UUID, pagination, search);
    }

    static toEditMeCommand(req: Request): EditUser {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        const { username, personalData } = req.body;
        return new EditUser(req.user.role, req.user.userId, username, personalData);
    }

    static toEditUserCommand(req: Request): EditUser {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        const { username, personalData } = req.body;
        const { id } = req.params;
        return new EditUser(req.user.role, id as UUID, username, personalData);
    }

    static toEditUserEmailCommand(req: Request): EditUserEmail {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        const { password, newEmail } = req.body;
        return new EditUserEmail(req.user.role, req.user.userId, password, newEmail);
    }

    static toEditUserPasswordCommand(req: Request): EditUserPassword {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        const { oldPassword, newPassword } = req.body;
        return new EditUserPassword(req.user.role, req.user.userId, oldPassword, newPassword);
    }

    static toDeleteUserCommand(req: Request): DeleteUser {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        const { id } = req.params;
        return new DeleteUser(req.user.role, id as UUID);
    }

    static toToggleBlockUserCommand(req: Request): ToggleBlockUser {
        const { id } = req.params;
        return new ToggleBlockUser(id as UUID);
    }

    static toSubscribeToEventCommand(req: Request): SubscribeUserToEvent {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        const { eventId } = req.body;
        return new SubscribeUserToEvent(req.user.userId, eventId as UUID);
    }

    static toUnsubscribeFromEventCommand(req: Request): UnsubscribeUserFromEvent {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        const { eventId } = req.body;
        return new UnsubscribeUserFromEvent(req.user.userId, eventId as UUID);
    }

    static toUploadAvatarCommand(req: Request): UploadUserAvatar {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        if (!req.fileName) {
            throw new InvalidInputException();
        }
        return new UploadUserAvatar(req.user.role, req.user.userId, req.fileName);
    }

    static toDeleteAvatarCommand(req: Request): DeleteUserAvatar {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        return new DeleteUserAvatar(req.user.role, req.user.userId);
    }

    static toCreateUserCommand(req: Request): CreateUser {
        const { userTypeId, username, email, password } = req.body;
        return new CreateUser(userTypeId, username, email, password);
    }
}
