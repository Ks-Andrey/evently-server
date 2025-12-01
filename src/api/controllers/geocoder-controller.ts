import { Request, Response } from 'express';

import { FindCoordinatesByLocation, FindCoordinatesByLocationHandler } from '@application/services/geocoder';

import { handleResult } from '../common/utils/error-handler';

export class GeocoderController {
    constructor(private readonly findCoordinatesByLocationHandler: FindCoordinatesByLocationHandler) {}

    async getCoordinatesByLocation(req: Request, res: Response): Promise<void> {
        const { location } = req.query;
        const query = new FindCoordinatesByLocation(location as string);
        const result = await this.findCoordinatesByLocationHandler.execute(query);
        handleResult(result, res);
    }
}
