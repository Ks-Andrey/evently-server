import { errorMessages } from '../../../common/config/errors';
import { DomainException } from '../../common/exceptions';

export class NotificationMessageCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.notification.messageCannotBeEmpty);
    }
}

export class NotificationIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.notification.idCannotBeEmpty);
    }
}

export class NotificationEventIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.notification.eventIdCannotBeEmpty);
    }
}

export class NotificationUserIsRequiredException extends DomainException {
    constructor() {
        super(errorMessages.domain.notification.userIsRequired);
    }
}

export class NotificationTypeCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.notification.typeCannotBeEmpty);
    }
}

export class NotificationUserIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.notification.userIdCannotBeEmpty);
    }
}

export class NotificationUsernameCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.notification.usernameCannotBeEmpty);
    }
}
