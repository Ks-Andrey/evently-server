import { domainErrorMessages } from '../../common/config/errors';
import { DomainException } from '../common/exceptions';

export class InvalidEventDateException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.invalidDate);
    }
}

export class EventIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.idCannotBeEmpty);
    }
}

export class EventOrganizerIsRequiredException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.organizerIsRequired);
    }
}

export class EventCategoryIsRequiredException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.categoryIsRequired);
    }
}

export class EventTitleCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.titleCannotBeEmpty);
    }
}

export class EventDescriptionCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.descriptionCannotBeEmpty);
    }
}

export class EventLocationCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.locationCannotBeEmpty);
    }
}

export class UserAlreadySubscribedException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.userAlreadySubscribed);
    }
}

export class UserNotSubscribedException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.userNotSubscribed);
    }
}

export class CategoryIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.categoryIdCannotBeEmpty);
    }
}

export class CategoryNameCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.categoryNameCannotBeEmpty);
    }
}

export class SubscriberCountCannotBeNegativeException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.subscriberCountCannotBeNegative);
    }
}

export class CommentCountCannotBeNegativeException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.commentCountCannotBeNegative);
    }
}

export class CannotDecrementSubscriberCountBelowZeroException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.cannotDecrementSubscriberBelowZero);
    }
}

export class CannotDecrementCommentCountBelowZeroException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.cannotDecrementCommentBelowZero);
    }
}

export class OrganizerIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.organizerIdCannotBeEmpty);
    }
}

export class OrganizerUsernameCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.organizerUsernameCannotBeEmpty);
    }
}

export class OrganizerPersonalDataCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.organizerPersonalDataCannotBeEmpty);
    }
}

export class EventAlreadyStartedException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.eventAlreadyStarted);
    }
}

export class EventSubscriberIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.eventSubscriberIdCannotBeEmpty);
    }
}

export class EventSubscriberNameCannotBeEmptyException extends DomainException {
    constructor() {
        super(domainErrorMessages.event.eventSubscriberNameCannotBeEmpty);
    }
}
