import { Request, Response } from 'express';

import { AuthenticateUserHandler, ConfirmUserEmailHandler } from '@application/services/auth';
import { CreateUserHandler } from '@application/services/user';

import { handleResult } from '../common/utils/error-handler';
import { AuthMapper } from '../mappers';

export class AuthController {
    constructor(
        private readonly createUserHandler: CreateUserHandler,
        private readonly authenticateUserHandler: AuthenticateUserHandler,
        private readonly confirmUserEmailHandler: ConfirmUserEmailHandler,
    ) {}

    async register(req: Request, res: Response): Promise<void> {
        const command = AuthMapper.toRegisterCommand(req);
        const result = await this.createUserHandler.execute(command);
        handleResult(result, res, 201);
    }

    async login(req: Request, res: Response): Promise<void> {
        const command = AuthMapper.toLoginCommand(req);
        const result = await this.authenticateUserHandler.execute(command);
        handleResult(result, res);
    }

    async confirmEmail(req: Request, res: Response): Promise<void> {
        const command = AuthMapper.toConfirmEmailCommand(req);
        const result = await this.confirmUserEmailHandler.execute(command);
        handleResult(result, res);
    }
}
