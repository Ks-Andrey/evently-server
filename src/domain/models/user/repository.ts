import { IRepository } from '@common/types/repository';
import { User, UserType } from '@domain/models/user';

export interface IUserRepository extends IRepository<User> {
    findByEmail(email: string): Promise<User | null>;
}

export interface IUserTypeRepository extends IRepository<UserType> {}
