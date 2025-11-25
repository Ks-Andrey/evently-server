import { UUID } from 'crypto';
import { Request, Response } from 'express';

import {
    CreateUserType,
    CreateUserTypeHandler,
    DeleteUserType,
    DeleteUserTypeHandler,
    EditUserType,
    EditUserTypeHandler,
    FindUserTypeById,
    FindUserTypeByIdHandler,
    FindUserTypesHandler,
} from '@application/services/user-type';
import { Roles } from '@common/config/roles';

import { handleResult } from '../utils/error-handler';

export class UserTypeController {
    constructor(
        private readonly findUserTypesHandler: FindUserTypesHandler,
        private readonly findUserTypeByIdHandler: FindUserTypeByIdHandler,
        private readonly createUserTypeHandler: CreateUserTypeHandler,
        private readonly editUserTypeHandler: EditUserTypeHandler,
        private readonly deleteUserTypeHandler: DeleteUserTypeHandler,
    ) {}

    async getUserTypes(req: Request, res: Response): Promise<void> {
        const result = await this.findUserTypesHandler.execute();
        handleResult(result, res);
    }

    async getUserTypeById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const query = new FindUserTypeById(id as UUID);
        const result = await this.findUserTypeByIdHandler.execute(query);
        handleResult(result, res);
    }

    async createUserType(req: Request, res: Response): Promise<void> {
        const { typeName, role } = req.body;
        const command = new CreateUserType(typeName, role || Roles.USER);
        const result = await this.createUserTypeHandler.execute(command);
        handleResult(result, res, 201);
    }

    async editUserType(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { typeName, role } = req.body;
        const command = new EditUserType(id as UUID, typeName, role);
        const result = await this.editUserTypeHandler.execute(command);
        handleResult(result, res);
    }

    async deleteUserType(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const command = new DeleteUserType(id as UUID);
        const result = await this.deleteUserTypeHandler.execute(command);
        handleResult(result, res);
    }
}
