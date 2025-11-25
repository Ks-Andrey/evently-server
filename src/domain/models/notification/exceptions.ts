import { domainErrorMessages } from '../../../common/config/errors';
import { DomainException } from '../../common/exceptions';

export class NotificationMessageCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.notification.messageCannotBeEmpty);
    }
}

export class NotificationIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.notification.idCannotBeEmpty);
    }
}

export class NotificationEventIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.notification.eventIdCannotBeEmpty);
    }
}

export class NotificationUserIsRequiredException extends DomainException {
    constructor() {
        super(domainErrorMessages.notification.userIsRequired);
    }
}

export class NotificationTypeCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.notification.typeCannotBeEmpty);
    }
}

export class NotificationUserIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.notification.userIdCannotBeEmpty);
    }
}

export class NotificationUsernameCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.notification.usernameCannotBeEmpty);
    }
}
