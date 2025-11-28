import { UUID } from 'crypto';

import { CategoryDTO } from './dto/category-dto';

export interface ICategoryReader {
    findAll(): Promise<CategoryDTO[]>;
    findById(categoryId: UUID): Promise<CategoryDTO | null>;
    findByName(name: string): Promise<CategoryDTO | null>;
}
