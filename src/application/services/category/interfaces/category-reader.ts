import { CategoryDTO } from '../dto/category-dto';

export interface ICategoryReader {
    findAll(): Promise<CategoryDTO[]>;
    findByName(name: string): Promise<CategoryDTO>;
}
