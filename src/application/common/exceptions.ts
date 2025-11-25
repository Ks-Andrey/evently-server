import { domainErrorMessages } from '@common/config/errors';

export abstract class ServiceException extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, ServiceException.prototype);
    }
}

export class NotFoundException extends ServiceException {
    constructor() {
        super(domainErrorMessages.common.notFound);
    }
}

export class AccessDeniedException extends ServiceException {
    constructor() {
        super(domainErrorMessages.common.accessDenied);
    }
}

export class UnknownException extends ServiceException {
    constructor(errorText: string) {
        super(errorText);
    }
}
