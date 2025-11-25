import { UUID } from 'crypto';

import { UserTypeDTO } from './dto/user-type-dto';

export interface IUserTypeReader {
    findAll(): Promise<UserTypeDTO[]>;
    findById(userTypeId: UUID): Promise<UserTypeDTO | null>;
    findByName(name: string): Promise<UserTypeDTO | null>;
}
