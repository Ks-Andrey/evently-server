import { Request } from 'express';

import { FindCoordinatesByLocation } from '@application/services/geocoder';

export class GeocoderMapper {
    static toFindCoordinatesByLocationQuery(req: Request): FindCoordinatesByLocation {
        const queryParams = req.query as { location: string };
        return new FindCoordinatesByLocation(queryParams.location);
    }
}
