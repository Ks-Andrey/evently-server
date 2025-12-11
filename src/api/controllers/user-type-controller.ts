import { Request, Response } from 'express';

import {
    CreateUserTypeHandler,
    DeleteUserTypeHandler,
    EditUserTypeHandler,
    FindUserTypeByIdHandler,
    FindUserTypesHandler,
} from '@application/services/user-type';

import { handleResult } from '../common/utils/error-handler';
import { UserTypeMapper } from '../mappers';

export class UserTypeController {
    constructor(
        private readonly findUserTypesHandler: FindUserTypesHandler,
        private readonly findUserTypeByIdHandler: FindUserTypeByIdHandler,
        private readonly createUserTypeHandler: CreateUserTypeHandler,
        private readonly editUserTypeHandler: EditUserTypeHandler,
        private readonly deleteUserTypeHandler: DeleteUserTypeHandler,
    ) {}

    async getUserTypes(req: Request, res: Response): Promise<void> {
        const query = UserTypeMapper.toFindUserTypesQuery(req);
        const result = await this.findUserTypesHandler.execute(query);
        handleResult(result, res);
    }

    async getUserTypeById(req: Request, res: Response): Promise<void> {
        const query = UserTypeMapper.toFindUserTypeByIdQuery(req);
        const result = await this.findUserTypeByIdHandler.execute(query);
        handleResult(result, res);
    }

    async createUserType(req: Request, res: Response): Promise<void> {
        const command = UserTypeMapper.toCreateUserTypeCommand(req);
        const result = await this.createUserTypeHandler.execute(command);
        handleResult(result, res, 201);
    }

    async editUserType(req: Request, res: Response): Promise<void> {
        const command = UserTypeMapper.toEditUserTypeCommand(req);
        const result = await this.editUserTypeHandler.execute(command);
        handleResult(result, res);
    }

    async deleteUserType(req: Request, res: Response): Promise<void> {
        const command = UserTypeMapper.toDeleteUserTypeCommand(req);
        const result = await this.deleteUserTypeHandler.execute(command);
        handleResult(result, res);
    }
}
