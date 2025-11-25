import { UUID } from 'crypto';
import { Request, Response } from 'express';

import {
    CreateCategory,
    CreateCategoryHandler,
    DeleteCategory,
    DeleteCategoryHandler,
    EditCategory,
    EditCategoryHandler,
    FindCategoriesHandler,
} from '@application/services/category';

import { handleResult } from '../utils/error-handler';

export class CategoryController {
    constructor(
        private readonly findCategoriesHandler: FindCategoriesHandler,
        private readonly createCategoryHandler: CreateCategoryHandler,
        private readonly editCategoryHandler: EditCategoryHandler,
        private readonly deleteCategoryHandler: DeleteCategoryHandler,
    ) {}

    async getCategories(req: Request, res: Response): Promise<void> {
        const result = await this.findCategoriesHandler.execute();
        handleResult(result, res);
    }

    async createCategory(req: Request, res: Response): Promise<void> {
        const { name } = req.body;
        const command = new CreateCategory(name);
        const result = await this.createCategoryHandler.execute(command);
        handleResult(result, res, 201);
    }

    async editCategory(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { name } = req.body;
        const command = new EditCategory(id as UUID, name);
        const result = await this.editCategoryHandler.execute(command);
        handleResult(result, res);
    }

    async deleteCategory(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const command = new DeleteCategory(id as UUID);
        const result = await this.deleteCategoryHandler.execute(command);
        handleResult(result, res);
    }
}
