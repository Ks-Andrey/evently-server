import { Request, Response } from 'express';

import {
    DeleteUserHandler,
    EditUserHandler,
    EditUserEmailHandler,
    EditUserPasswordHandler,
    FindAllUsersHandler,
    FindUserByEmailHandler,
    FindUserByNameHandler,
    FindUserSubscriptionsHandler,
    SubscribeUserToEventHandler,
    ToggleBlockUserHandler,
    UnsubscribeUserFromEventHandler,
    FindUserByIdHandler,
    UploadUserAvatarHandler,
    DeleteUserAvatarHandler,
} from '@application/services/user';

import { handleResult } from '../common/utils/error-handler';
import { UserMapper } from '../mappers';

export class UserController {
    constructor(
        private readonly findAllUsersHandler: FindAllUsersHandler,
        private readonly findUserByIdHandler: FindUserByIdHandler,
        private readonly findUserByNameHandler: FindUserByNameHandler,
        private readonly findUserByEmailHandler: FindUserByEmailHandler,
        private readonly findUserSubscriptionsHandler: FindUserSubscriptionsHandler,
        private readonly editUserHandler: EditUserHandler,
        private readonly editUserEmailHandler: EditUserEmailHandler,
        private readonly editUserPasswordHandler: EditUserPasswordHandler,
        private readonly deleteUserHandler: DeleteUserHandler,
        private readonly toggleBlockUserHandler: ToggleBlockUserHandler,
        private readonly subscribeUserToEventHandler: SubscribeUserToEventHandler,
        private readonly unsubscribeUserFromEventHandler: UnsubscribeUserFromEventHandler,
        private readonly uploadUserAvatarHandler: UploadUserAvatarHandler,
        private readonly deleteUserAvatarHandler: DeleteUserAvatarHandler,
    ) {}

    async getAllUsers(_req: Request, res: Response): Promise<void> {
        const result = await this.findAllUsersHandler.execute();
        handleResult(result, res);
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        const query = UserMapper.toFindUserByIdQuery(req);
        const result = await this.findUserByIdHandler.execute(query);
        handleResult(result, res);
    }

    async getCurrentUser(req: Request, res: Response): Promise<void> {
        const query = UserMapper.toFindCurrentUserQuery(req);
        const result = await this.findUserByIdHandler.execute(query);
        handleResult(result, res);
    }

    async getUserByName(req: Request, res: Response): Promise<void> {
        const query = UserMapper.toFindUserByNameQuery(req);
        const result = await this.findUserByNameHandler.execute(query);
        handleResult(result, res);
    }

    async getUserByEmail(req: Request, res: Response): Promise<void> {
        const query = UserMapper.toFindUserByEmailQuery(req);
        const result = await this.findUserByEmailHandler.execute(query);
        handleResult(result, res);
    }

    async getUserSubscriptions(req: Request, res: Response): Promise<void> {
        const query = UserMapper.toFindUserSubscriptionsQuery(req);
        const result = await this.findUserSubscriptionsHandler.execute(query);
        handleResult(result, res);
    }

    async editUser(req: Request, res: Response): Promise<void> {
        const command = UserMapper.toEditUserCommand(req);
        const result = await this.editUserHandler.execute(command);
        handleResult(result, res);
    }

    async editEmail(req: Request, res: Response): Promise<void> {
        const command = UserMapper.toEditUserEmailCommand(req);
        const result = await this.editUserEmailHandler.execute(command);
        handleResult(result, res);
    }

    async editPassword(req: Request, res: Response): Promise<void> {
        const command = UserMapper.toEditUserPasswordCommand(req);
        const result = await this.editUserPasswordHandler.execute(command);
        handleResult(result, res);
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        const command = UserMapper.toDeleteUserCommand(req);
        const result = await this.deleteUserHandler.execute(command);
        handleResult(result, res);
    }

    async toggleBlockUser(req: Request, res: Response): Promise<void> {
        const command = UserMapper.toToggleBlockUserCommand(req);
        const result = await this.toggleBlockUserHandler.execute(command);
        handleResult(result, res);
    }

    async subscribeToEvent(req: Request, res: Response): Promise<void> {
        const command = UserMapper.toSubscribeToEventCommand(req);
        const result = await this.subscribeUserToEventHandler.execute(command);
        handleResult(result, res);
    }

    async unsubscribeFromEvent(req: Request, res: Response): Promise<void> {
        const command = UserMapper.toUnsubscribeFromEventCommand(req);
        const result = await this.unsubscribeUserFromEventHandler.execute(command);
        handleResult(result, res);
    }

    async uploadAvatar(req: Request, res: Response): Promise<void> {
        const command = UserMapper.toUploadAvatarCommand(req);
        const result = await this.uploadUserAvatarHandler.execute(command);
        handleResult(result, res);
    }

    async deleteAvatar(req: Request, res: Response): Promise<void> {
        const command = UserMapper.toDeleteAvatarCommand(req);
        const result = await this.deleteUserAvatarHandler.execute(command);
        handleResult(result, res);
    }
}
