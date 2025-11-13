import { UUID } from 'crypto';

import {
    OrganizerIdCannotBeEmptyException,
    OrganizerUsernameCannotBeEmptyException,
    OrganizerPersonalDataCannotBeEmptyException,
} from '../exceptions';

export class EventOrganizer {
    private constructor(
        private readonly _id: UUID,
        private readonly _username: string,
        private readonly _personalData: string,
    ) {}

    static create(id: UUID, username: string, personalData: string) {
        if (!id) {
            throw new OrganizerIdCannotBeEmptyException();
        }
        if (!username || username.trim().length === 0) {
            throw new OrganizerUsernameCannotBeEmptyException();
        }
        if (!personalData || personalData.trim().length === 0) {
            throw new OrganizerPersonalDataCannotBeEmptyException();
        }

        return new EventOrganizer(id, username.trim(), personalData.trim());
    }

    get id(): UUID {
        return this._id;
    }

    get username(): string {
        return this._username;
    }

    get personalData(): string {
        return this._personalData;
    }
}
