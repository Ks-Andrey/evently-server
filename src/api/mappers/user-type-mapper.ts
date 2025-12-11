import { UUID } from 'crypto';
import { Request } from 'express';

import {
    CreateUserType,
    DeleteUserType,
    EditUserType,
    FindUserTypeById,
    FindUserTypesQuery,
} from '@application/services/user-type';
import { Roles } from '@common/constants/roles';

export class UserTypeMapper {
    static toFindUserTypesQuery(req: Request): FindUserTypesQuery {
        return new FindUserTypesQuery(req.user?.role);
    }

    static toFindUserTypeByIdQuery(req: Request): FindUserTypeById {
        const { id } = req.params;
        return new FindUserTypeById(id as UUID);
    }

    static toCreateUserTypeCommand(req: Request): CreateUserType {
        const { typeName, role } = req.body;
        return new CreateUserType(typeName, role || Roles.USER);
    }

    static toEditUserTypeCommand(req: Request): EditUserType {
        const { id } = req.params;
        const { typeName, role } = req.body;
        return new EditUserType(id as UUID, typeName, role);
    }

    static toDeleteUserTypeCommand(req: Request): DeleteUserType {
        const { id } = req.params;
        return new DeleteUserType(id as UUID);
    }
}
