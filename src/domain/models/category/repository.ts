import { IRepository } from '@common/types/repository';

import { Category } from './aggregate';

export interface ICategoryRepository extends IRepository<Category> {}
