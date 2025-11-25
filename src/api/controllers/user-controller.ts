import { UUID } from 'crypto';
import { Request, Response } from 'express';

import {
    CreateUserHandler,
    DeleteUser,
    DeleteUserHandler,
    EditUser,
    EditUserHandler,
    EditUserEmail,
    EditUserEmailHandler,
    EditUserPassword,
    EditUserPasswordHandler,
    FindAllUsersHandler,
    FindUserByEmail,
    FindUserByEmailHandler,
    FindUserByName,
    FindUserByNameHandler,
    FindUserSubscriptions,
    FindUserSubscriptionsHandler,
    SubscribeUserToEvent,
    SubscribeUserToEventHandler,
    ToggleBlockUser,
    ToggleBlockUserHandler,
    UnsubscribeUserFromEvent,
    UnsubscribeUserFromEventHandler,
} from '@application/services/user';

import { handleResult } from '../utils/error-handler';

export class UserController {
    constructor(
        private readonly findAllUsersHandler: FindAllUsersHandler,
        private readonly findUserByNameHandler: FindUserByNameHandler,
        private readonly findUserByEmailHandler: FindUserByEmailHandler,
        private readonly findUserSubscriptionsHandler: FindUserSubscriptionsHandler,
        private readonly createUserHandler: CreateUserHandler,
        private readonly editUserHandler: EditUserHandler,
        private readonly editUserEmailHandler: EditUserEmailHandler,
        private readonly editUserPasswordHandler: EditUserPasswordHandler,
        private readonly deleteUserHandler: DeleteUserHandler,
        private readonly toggleBlockUserHandler: ToggleBlockUserHandler,
        private readonly subscribeUserToEventHandler: SubscribeUserToEventHandler,
        private readonly unsubscribeUserFromEventHandler: UnsubscribeUserFromEventHandler,
    ) {}

    async getAllUsers(req: Request, res: Response): Promise<void> {
        const result = await this.findAllUsersHandler.execute();
        handleResult(result, res);
    }

    async getUserById(_req: Request, _res: Response): Promise<void> {}

    async getCurrentUser(_req: Request, _res: Response): Promise<void> {}

    async getUserByName(req: Request, res: Response): Promise<void> {
        const { username } = req.params;
        const query = new FindUserByName(username);
        const result = await this.findUserByNameHandler.execute(query);
        handleResult(result, res);
    }

    async getUserByEmail(req: Request, res: Response): Promise<void> {
        const { email } = req.params;
        const query = new FindUserByEmail(email);
        const result = await this.findUserByEmailHandler.execute(query);
        handleResult(result, res);
    }

    async getUserSubscriptions(req: Request, res: Response): Promise<void> {
        const query = new FindUserSubscriptions(req.user!.userId);
        const result = await this.findUserSubscriptionsHandler.execute(query);
        handleResult(result, res);
    }

    async editUser(req: Request, res: Response): Promise<void> {
        const { username, personalData } = req.body;
        const command = new EditUser(req.user!.role, req.user!.userId, username, personalData);
        const result = await this.editUserHandler.execute(command);
        handleResult(result, res);
    }

    async editEmail(req: Request, res: Response): Promise<void> {
        const { password, newEmail } = req.body;
        const command = new EditUserEmail(req.user!.role, req.user!.userId, password, newEmail);
        const result = await this.editUserEmailHandler.execute(command);
        handleResult(result, res);
    }

    async editPassword(req: Request, res: Response): Promise<void> {
        const { oldPassword, newPassword } = req.body;
        const command = new EditUserPassword(req.user!.role, req.user!.userId, oldPassword, newPassword);
        const result = await this.editUserPasswordHandler.execute(command);
        handleResult(result, res);
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const command = new DeleteUser(req.user!.role, id as UUID);
        const result = await this.deleteUserHandler.execute(command);
        handleResult(result, res);
    }

    async toggleBlockUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const command = new ToggleBlockUser(id as UUID);
        const result = await this.toggleBlockUserHandler.execute(command);
        handleResult(result, res);
    }

    async subscribeToEvent(req: Request, res: Response): Promise<void> {
        const { eventId } = req.body;
        const command = new SubscribeUserToEvent(req.user!.userId, eventId as UUID);
        const result = await this.subscribeUserToEventHandler.execute(command);
        handleResult(result, res);
    }

    async unsubscribeFromEvent(req: Request, res: Response): Promise<void> {
        const { eventId } = req.body;
        const command = new UnsubscribeUserFromEvent(req.user!.userId, eventId as UUID);
        const result = await this.unsubscribeUserFromEventHandler.execute(command);
        handleResult(result, res);
    }
}
