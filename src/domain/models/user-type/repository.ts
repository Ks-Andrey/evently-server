import { IRepository } from '@common/types/repository';

import { UserType } from './aggregate';

export interface IUserTypeRepository extends IRepository<UserType> {
    findByName(name: string): Promise<UserType | null>;
}
