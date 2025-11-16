import { IRepository } from '@common/types/repository';

import { Category } from './aggregate';

export interface ICategoryRepository extends IRepository<Category> {
    findByName(name: string): Promise<Category>;
    findAll(): Promise<Category[]>;
}
