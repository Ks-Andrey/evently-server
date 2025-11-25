import { domainErrorMessages } from '@common/config/errors';

import { DomainException } from '../../common/exceptions';

export class UserTypeIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.userType.idCannotBeEmpty);
    }
}

export class UserTypeNameCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.userType.nameCannotBeEmpty);
    }
}

export class UserTypeAlreadyExistsException extends DomainException {
    constructor() {
        super(domainErrorMessages.userType.alreadyExists);
    }
}

export class UserTypeInUseException extends DomainException {
    constructor() {
        super(domainErrorMessages.userType.inUse);
    }
}
