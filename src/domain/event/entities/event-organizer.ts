import { UUID } from 'crypto';

import {
    OrganizerIdCannotBeEmptyException,
    OrganizerUsernameCannotBeEmptyException,
    OrganizerPersonalDataCannotBeEmptyException,
} from '../exceptions';

export class EventOrganizer {
    private readonly _id: UUID;
    private readonly _username: string;
    private readonly _personalData: string;

    constructor(id: UUID, username: string, personalData: string) {
        if (!id) {
            throw new OrganizerIdCannotBeEmptyException();
        }
        if (!username || username.trim().length === 0) {
            throw new OrganizerUsernameCannotBeEmptyException();
        }
        if (!personalData || personalData.trim().length === 0) {
            throw new OrganizerPersonalDataCannotBeEmptyException();
        }

        this._id = id;
        this._username = username.trim();
        this._personalData = personalData.trim();
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
