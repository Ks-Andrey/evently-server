import { errorMessages } from '@common/config/errors';

import { DomainException } from '../../common/exceptions';

export class InvalidEventDateException extends DomainException {
    constructor() {
        super(errorMessages.domain.event.invalidDate);
    }
}

export class EventIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.event.idCannotBeEmpty);
    }
}

export class EventOrganizerIsRequiredException extends DomainException {
    constructor() {
        super(errorMessages.domain.event.organizerIsRequired);
    }
}

export class EventCategoryIsRequiredException extends DomainException {
    constructor() {
        super(errorMessages.domain.event.categoryIsRequired);
    }
}

export class EventTitleCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.event.titleCannotBeEmpty);
    }
}

export class EventDescriptionCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.event.descriptionCannotBeEmpty);
    }
}

export class EventLocationCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.event.locationCannotBeEmpty);
    }
}

export class UserAlreadySubscribedException extends DomainException {
    constructor() {
        super(errorMessages.domain.event.userAlreadySubscribed);
    }
}

export class CategoryIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.event.categoryIdCannotBeEmpty);
    }
}

export class CategoryNameCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.event.categoryNameCannotBeEmpty);
    }
}

export class SubscriberCountCannotBeNegativeException extends DomainException {
    constructor() {
        super(errorMessages.domain.event.subscriberCountCannotBeNegative);
    }
}

export class CommentCountCannotBeNegativeException extends DomainException {
    constructor() {
        super(errorMessages.domain.event.commentCountCannotBeNegative);
    }
}

export class CannotDecrementSubscriberCountBelowZeroException extends DomainException {
    constructor() {
        super(errorMessages.domain.event.cannotDecrementSubscriberBelowZero);
    }
}

export class CannotDecrementCommentCountBelowZeroException extends DomainException {
    constructor() {
        super(errorMessages.domain.event.cannotDecrementCommentBelowZero);
    }
}

export class OrganizerIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.event.organizerIdCannotBeEmpty);
    }
}

export class OrganizerUsernameCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.event.organizerUsernameCannotBeEmpty);
    }
}

export class OrganizerPersonalDataCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.event.organizerPersonalDataCannotBeEmpty);
    }
}

export class EventAlreadyStartedException extends DomainException {
    constructor() {
        super(errorMessages.domain.event.eventAlreadyStarted);
    }
}

export class EventSubscriberIdCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.event.eventSubscriberIdCannotBeEmpty);
    }
}

export class EventSubscriberNameCannotBeEmptyException extends DomainException {
    constructor() {
        super(errorMessages.domain.event.eventSubscriberNameCannotBeEmpty);
    }
}
