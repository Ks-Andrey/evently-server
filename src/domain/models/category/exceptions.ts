import { errorMessages } from '@common/config/errors';

import { DomainException } from '../../common/exceptions';

export class CategoryNameCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.event.categoryNameCannotBeEmpty);
    }
}

export class CategoryIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.event.categoryIdCannotBeEmpty);
    }
}
