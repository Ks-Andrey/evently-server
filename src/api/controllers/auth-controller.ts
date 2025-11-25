import { Request, Response } from 'express';

import {
    AuthenticateUser,
    AuthenticateUserHandler,
    ConfirmUserEmail,
    ConfirmUserEmailHandler,
} from '@application/services/auth';
import { CreateUser, CreateUserHandler } from '@application/services/user';

import { handleResult } from '../utils/error-handler';

export class AuthController {
    constructor(
        private readonly createUserHandler: CreateUserHandler,
        private readonly authenticateUserHandler: AuthenticateUserHandler,
        private readonly confirmUserEmailHandler: ConfirmUserEmailHandler,
    ) {}

    async register(req: Request, res: Response): Promise<void> {
        const { userTypeId, username, email, password } = req.body;
        const command = new CreateUser(userTypeId, username, email, password);
        const result = await this.createUserHandler.execute(command);
        handleResult(result, res, 201);
    }

    async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        const command = new AuthenticateUser(email, password);
        const result = await this.authenticateUserHandler.execute(command);
        handleResult(result, res);
    }

    async confirmEmail(req: Request, res: Response): Promise<void> {
        const { token } = req.body;
        const command = new ConfirmUserEmail(token);
        const result = await this.confirmUserEmailHandler.execute(command);
        handleResult(result, res);
    }
}
