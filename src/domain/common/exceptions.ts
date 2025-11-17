import { domainErrorMessages } from '@common/config/errors';

export abstract class DomainException extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, DomainException.prototype);
    }
}

export class NotFoundException extends DomainException {
    constructor() {
        super(domainErrorMessages.common.notFound);
    }
}

export class NotRightsException extends DomainException {
    constructor() {
        super(domainErrorMessages.common.notRights);
    }
}

export class UnknownException extends DomainException {
    constructor(errorText: string) {
        super(errorText);
    }
}
