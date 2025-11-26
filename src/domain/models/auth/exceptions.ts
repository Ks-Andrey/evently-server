import { ERROR_MESSAGES } from '@common/constants/errors';

import { DomainException } from '../../common/exceptions';

export class EmailVerificationIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.auth.emailVerificationIdCannotBeEmpty);
    }
}

export class EmailVerificationUserIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.auth.emailVerificationUserIdCannotBeEmpty);
    }
}

export class EmailVerificationTokenCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.auth.emailVerificationTokenCannotBeEmpty);
    }
}

export class EmailVerificationAlreadyUsedException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.auth.emailVerificationAlreadyUsed);
    }
}

export class EmailVerificationExpiredException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.auth.emailVerificationExpired);
    }
}

export class EmailVerificationEmailCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.auth.emailVerificationEmailCannotBeEmpty);
    }
}

export class InvalidTokenPayloadException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.auth.invalidTokenPayload);
    }
}

export class InactiveTokenException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.auth.inactiveToken);
    }
}
