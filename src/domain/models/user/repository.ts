import { IRepository } from '@common/types/repository';

import { User } from './aggregate';

export interface IUserRepository extends IRepository<User> {
    findByEmail(email: string): Promise<User | null>;
}
