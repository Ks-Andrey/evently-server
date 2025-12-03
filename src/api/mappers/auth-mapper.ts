import { UUID } from 'crypto';
import { Request } from 'express';

import { AuthenticateUser, ConfirmUserEmail } from '@application/services/auth';
import { CreateUser } from '@application/services/user';

export class AuthMapper {
    static toRegisterCommand(req: Request): CreateUser {
        const { userTypeId, username, email, password } = req.body;
        return new CreateUser(userTypeId, username, email, password);
    }

    static toLoginCommand(req: Request): AuthenticateUser {
        const { email, password } = req.body;
        return new AuthenticateUser(email, password);
    }

    static toConfirmEmailCommand(req: Request): ConfirmUserEmail {
        const { token } = req.query;
        return new ConfirmUserEmail(token as UUID);
    }
}
