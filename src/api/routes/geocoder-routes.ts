import { Router } from 'express';

import { GeocoderController } from '../controllers/geocoder-controller';
import { validate } from '../middlewares/validation-middleware';
import { getCoordinatesByLocationSchema } from '../validations';

export function createGeocoderRoutes(geocoderController: GeocoderController): Router {
    const router = Router();

    // Публичные маршруты
    router.get('/coordinates', validate(getCoordinatesByLocationSchema), (req, res) =>
        geocoderController.getCoordinatesByLocation(req, res),
    );

    return router;
}
