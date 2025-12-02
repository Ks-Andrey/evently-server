import { ERROR_MESSAGES } from '@common/constants/errors';

import { DomainException } from '../../common/exceptions';

export class UserTypeIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.userType.idCannotBeEmpty);
    }
}

export class UserTypeNameCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.userType.nameCannotBeEmpty);
    }
}

export class UserTypeAlreadyExistsException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.userType.alreadyExists);
    }
}

export class UserTypeInUseException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.userType.inUse);
    }
}

export class InvalidRoleException extends DomainException {
    constructor(role: string) {
        super(`${ERROR_MESSAGES.domain.userType.invalidRole}: ${role}`);
    }
}
