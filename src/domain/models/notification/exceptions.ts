import { ERROR_MESSAGES } from '../../../common/constants/errors';
import { DomainException } from '../../common/exceptions';

export class NotificationMessageCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.notification.messageCannotBeEmpty);
    }
}

export class NotificationIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.notification.idCannotBeEmpty);
    }
}

export class NotificationEventIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.notification.eventIdCannotBeEmpty);
    }
}

export class NotificationUserIsRequiredException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.notification.userIsRequired);
    }
}

export class NotificationTypeCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.notification.typeCannotBeEmpty);
    }
}

export class NotificationUserIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.notification.userIdCannotBeEmpty);
    }
}

export class NotificationUsernameCannotBeEmptyException extends DomainException {
    constructor() {
        super(ERROR_MESSAGES.domain.notification.usernameCannotBeEmpty);
    }
}

export class InvalidNotificationTypeException extends DomainException {
    constructor(type: string) {
        super(`${ERROR_MESSAGES.domain.notification.invalidType}: ${type}`);
    }
}
