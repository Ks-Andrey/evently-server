import { ERROR_MESSAGES } from '@common/constants/errors';

import { DomainException } from '../../common/exceptions';

export class CategoryNameCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.event.categoryNameCannotBeEmpty);
    }
}

export class CategoryIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.event.categoryIdCannotBeEmpty);
    }
}
