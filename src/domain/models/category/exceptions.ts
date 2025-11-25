import { domainErrorMessages } from '@common/config/errors';

import { DomainException } from '../../common/exceptions';

export class CategoryNameCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.categoryNameCannotBeEmpty);
    }
}

export class CategoryIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.categoryIdCannotBeEmpty);
    }
}

export class CategoryInUseException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.categoryInUse);
    }
}

export class CategoryAlreadyExistsException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.categoryAlreadyExists);
    }
}
