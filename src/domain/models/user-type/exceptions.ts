import { errorMessages } from '@common/config/errors';

import { DomainException } from '../../common/exceptions';

export class UserTypeIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.userType.idCannotBeEmpty);
    }
}

export class UserTypeNameCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.userType.nameCannotBeEmpty);
    }
}

export class UserTypeAlreadyExistsException extends DomainException {
    constructor() {
        super(errorMessages.domain.userType.alreadyExists);
    }
}

export class UserTypeInUseException extends DomainException {
    constructor() {
        super(errorMessages.domain.userType.inUse);
    }
}
