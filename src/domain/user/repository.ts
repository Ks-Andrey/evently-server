import { User, UserType } from '@domain/user';
import { IRepository } from 'src/common/types/repository';

export interface IUserRepository extends IRepository<User> {
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findAll(): Promise<User[]>;
}

export interface IUserTypeRepository extends IRepository<UserType> {}
