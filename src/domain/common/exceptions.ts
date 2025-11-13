import { domainErrorMessages } from '@common/config/domain-error-messages';

export abstract class DomainException extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, DomainException.prototype);
    }
}

export class NotFoundError extends DomainException {
    constructor() {
        super(domainErrorMessages.common.notFound);
    }
}

export class UnknownError extends DomainException {
    constructor(errorText: string) {
        super(errorText);
    }
}
