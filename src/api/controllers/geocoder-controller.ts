import { Request, Response } from 'express';

import { FindCoordinatesByLocation, FindCoordinatesByLocationHandler } from '@application/services/geocoder';

import { handleResult } from '../common/utils/error-handler';

export class GeocoderController {
    constructor(private readonly findCoordinatesByLocationHandler: FindCoordinatesByLocationHandler) {}

    async getCoordinatesByLocation(req: Request, res: Response): Promise<void> {
        const queryParams = req.query as { location: string };
        const query = new FindCoordinatesByLocation(queryParams.location);
        const result = await this.findCoordinatesByLocationHandler.execute(query);
        handleResult(result, res);
    }
}
