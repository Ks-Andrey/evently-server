import { Coordinates } from '@common/types/coordinates';

import {
    EventLocationCannotBeEmptyException,
    InvalidLatitudeException,
    InvalidLongitudeException,
} from '../exceptions';

export class EventLocation {
    private constructor(
        private readonly _location: string,
        private readonly _coordinates: Coordinates,
    ) {}

    static create(location: string, longitude: number, latitude: number): EventLocation {
        EventLocation.ensureValidLocation(location);
        EventLocation.ensureValidCoordinates(longitude, latitude);

        return new EventLocation(location.trim(), { longitude, latitude });
    }

    get location(): string {
        return this._location;
    }

    get coordinates(): Coordinates {
        return { ...this._coordinates };
    }

    get latitude(): number {
        return this._coordinates.latitude;
    }

    get longitude(): number {
        return this._coordinates.longitude;
    }

    private static ensureValidLocation(location: string): void {
        if (!location || location.trim().length === 0) {
            throw new EventLocationCannotBeEmptyException();
        }
    }

    private static ensureValidCoordinates(longitude: number, latitude: number): void {
        if (latitude < -90 || latitude > 90) {
            throw new InvalidLatitudeException();
        }
        if (longitude < -180 || longitude > 180) {
            throw new InvalidLongitudeException();
        }
    }
}
