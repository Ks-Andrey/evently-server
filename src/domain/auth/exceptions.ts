import { domainErrorMessages } from '@common/config/errors';

import { DomainException } from '../common/exceptions';

export class EmailVerificationIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.auth.emailVerificationIdCannotBeEmpty);
    }
}

export class EmailVerificationTokenCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.auth.emailVerificationTokenCannotBeEmpty);
    }
}

export class EmailVerificationAlreadyUsedException extends DomainException {
    constructor() {
        super(domainErrorMessages.auth.emailVerificationAlreadyUsed);
    }
}

export class EmailVerificationExpiredException extends DomainException {
    constructor() {
        super(domainErrorMessages.auth.emailVerificationExpired);
    }
}

export class EmailVerificationEmailCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.auth.emailVerificationEmailCannotBeEmpty);
    }
}

export class InvalidCredentialsException extends DomainException {
    constructor() {
        super(domainErrorMessages.auth.invalidCredentials);
    }
}

export class InvalidTokenPayloadException extends DomainException {
    constructor() {
        super(domainErrorMessages.auth.invalidTokenPayload);
    }
}

export class InactiveTokenException extends DomainException {
    constructor() {
        super(domainErrorMessages.auth.inactiveToken);
    }
}
