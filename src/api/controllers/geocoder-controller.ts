import { Request, Response } from 'express';

import { FindCoordinatesByLocationHandler } from '@application/services/geocoder';

import { handleResult } from '../common/utils/error-handler';
import { GeocoderMapper } from '../mappers';

export class GeocoderController {
    constructor(private readonly findCoordinatesByLocationHandler: FindCoordinatesByLocationHandler) {}

    async getCoordinatesByLocation(req: Request, res: Response): Promise<void> {
        const query = GeocoderMapper.toFindCoordinatesByLocationQuery(req);
        const result = await this.findCoordinatesByLocationHandler.execute(query);
        handleResult(result, res);
    }
}
