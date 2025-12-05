import { Request, Response } from 'express';

import {
    CreateCategoryHandler,
    DeleteCategoryHandler,
    EditCategoryHandler,
    FindCategoriesHandler,
    FindCategoryByIdHandler,
} from '@application/services/category';

import { handleResult } from '../common/utils/error-handler';
import { CategoryMapper } from '../mappers';

export class CategoryController {
    constructor(
        private readonly findCategoriesHandler: FindCategoriesHandler,
        private readonly findCategoryByIdHandler: FindCategoryByIdHandler,
        private readonly createCategoryHandler: CreateCategoryHandler,
        private readonly editCategoryHandler: EditCategoryHandler,
        private readonly deleteCategoryHandler: DeleteCategoryHandler,
    ) {}

    async getCategories(req: Request, res: Response): Promise<void> {
        const result = await this.findCategoriesHandler.execute();
        handleResult(result, res);
    }

    async getCategoryById(req: Request, res: Response): Promise<void> {
        const query = CategoryMapper.toFindCategoryByIdQuery(req);
        const result = await this.findCategoryByIdHandler.execute(query);
        handleResult(result, res);
    }

    async createCategory(req: Request, res: Response): Promise<void> {
        const command = CategoryMapper.toCreateCategoryCommand(req);
        const result = await this.createCategoryHandler.execute(command);
        handleResult(result, res, 201);
    }

    async editCategory(req: Request, res: Response): Promise<void> {
        const command = CategoryMapper.toEditCategoryCommand(req);
        const result = await this.editCategoryHandler.execute(command);
        handleResult(result, res);
    }

    async deleteCategory(req: Request, res: Response): Promise<void> {
        const command = CategoryMapper.toDeleteCategoryCommand(req);
        const result = await this.deleteCategoryHandler.execute(command);
        handleResult(result, res);
    }
}
