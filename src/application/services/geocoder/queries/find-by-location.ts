import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { Coordinates } from '@common/types/coordinates';

import { GeocodingNotFoundException } from '../exceptions';
import { IGeocoderManager } from '../interfaces/geocoder-manager';

export class FindCoordinatesByLocation {
    constructor(readonly location: string) {}
}

export class FindCoordinatesByLocationHandler {
    constructor(private readonly geocoderManager: IGeocoderManager) {}

    async execute(query: FindCoordinatesByLocation): Promise<Result<Coordinates, ApplicationException>> {
        return safeAsync(async () => {
            const coordinates = await this.geocoderManager.findCoordinatesByLocation(query.location);
            if (!coordinates) throw new GeocodingNotFoundException();

            return coordinates;
        });
    }
}
