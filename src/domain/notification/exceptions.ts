import { DomainException } from '../../shared/exception/domain-exception';

export class NotificationMessageCannotBeEmptyException extends DomainException {
    constructor() {
        super('Notification message cannot be empty');
    }
}

export class NotificationAlreadySentException extends DomainException {
    constructor() {
        super('Notification already sent');
    }
}
