import { UUID } from 'crypto';
import { Request } from 'express';

import { NotAuthenticatedException } from '@application/common';
import {
    CreateUser,
    DeleteUser,
    DeleteUserAvatar,
    EditUser,
    EditUserEmail,
    EditUserPassword,
    FindUserByEmail,
    FindUserById,
    FindUserByName,
    FindUserSubscriptions,
    SubscribeUserToEvent,
    ToggleBlockUser,
    UnsubscribeUserFromEvent,
    UploadUserAvatar,
} from '@application/services/user';

export class UserMapper {
    static toFindUserByIdQuery(req: Request): FindUserById {
        const { userId } = req.params;
        return new FindUserById(userId as UUID);
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

    static toFindUserSubscriptionsQuery(req: Request): FindUserSubscriptions {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        return new FindUserSubscriptions(req.user.userId);
    }

    static toEditUserCommand(req: Request): EditUser {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        const { username, personalData, userId } = req.body;
        const targetUserId = userId ?? req.user.userId;
        return new EditUser(req.user.role, targetUserId, username, personalData);
    }

    static toEditUserEmailCommand(req: Request): EditUserEmail {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        const { password, newEmail, userId } = req.body;
        const targetUserId = userId ?? req.user.userId;
        return new EditUserEmail(req.user.role, targetUserId, password, newEmail);
    }

    static toEditUserPasswordCommand(req: Request): EditUserPassword {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        const { oldPassword, newPassword, userId } = req.body;
        const targetUserId = userId ?? req.user.userId;
        return new EditUserPassword(req.user.role, targetUserId, oldPassword, newPassword);
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
            throw new Error('File name is required');
        }
        const { userId } = req.body;
        const targetUserId = userId ?? req.user.userId;
        return new UploadUserAvatar(req.user.role, targetUserId, req.fileName);
    }

    static toDeleteAvatarCommand(req: Request): DeleteUserAvatar {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        const { userId } = req.body;
        const targetUserId = userId ?? req.user.userId;
        return new DeleteUserAvatar(req.user.role, targetUserId);
    }

    static toCreateUserCommand(req: Request): CreateUser {
        const { userTypeId, username, email, password } = req.body;
        return new CreateUser(userTypeId, username, email, password);
    }
}
