import { UUID } from 'crypto';
import { Request } from 'express';

import { CreateCategory, DeleteCategory, EditCategory } from '@application/services/category';

export class CategoryMapper {
    static toCreateCategoryCommand(req: Request): CreateCategory {
        const { name } = req.body;
        return new CreateCategory(name);
    }

    static toEditCategoryCommand(req: Request): EditCategory {
        const { id } = req.params;
        const { name } = req.body;
        return new EditCategory(id as UUID, name);
    }

    static toDeleteCategoryCommand(req: Request): DeleteCategory {
        const { id } = req.params;
        return new DeleteCategory(id as UUID);
    }
}
