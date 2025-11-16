import { IRepository } from '@common/types/repository';
import { User } from '@domain/user';

export interface IUserRepository extends IRepository<User> {
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findAll(): Promise<User[]>;
}
