import { Router } from 'express';

import { ITokenManager } from '@application/services/auth';
import { Roles } from '@common/constants/roles';

import { EventController } from '../controllers/event-controller';
import { authMiddleware } from '../middlewares/auth-middleware';
import { uploadGalleryImages } from '../middlewares/file-upload-middleware';
import { roleMiddleware } from '../middlewares/role-middleware';
import { validate } from '../middlewares/validation-middleware';
import {
    getEventsSchema,
    getEventByIdSchema,
    getEventSubscribersSchema,
    getOrganizerEventsSchema,
    createEventSchema,
    editEventSchema,
    deleteEventSchema,
    notifySubscribersSchema,
    addGalleryPhotosSchema,
    deleteGalleryPhotoSchema,
} from '../validations';

export function createEventRoutes(eventController: EventController, tokenManager: ITokenManager): Router {
    const router = Router();
    const auth = authMiddleware(tokenManager);
    const organizerOnly = roleMiddleware([Roles.ORGANIZER]);
    const organizerOrAdmin = roleMiddleware([Roles.ORGANIZER, Roles.ADMIN]);

    // Публичные маршруты
    router.get('/', validate(getEventsSchema), (req, res) => eventController.getEvents(req, res));
    router.get('/:id', validate(getEventByIdSchema), (req, res) => eventController.getEventById(req, res));
    router.get('/:id/subscribers', validate(getEventSubscribersSchema), (req, res) =>
        eventController.getEventSubscribers(req, res),
    );

    // Защищенные маршруты для организаторов
    router.get('/organizer/my', auth, organizerOnly, validate(getOrganizerEventsSchema), (req, res) =>
        eventController.getOrganizerEvents(req, res),
    );
    router.post('/', auth, organizerOnly, validate(createEventSchema), (req, res) =>
        eventController.createEvent(req, res),
    );
    router.put('/:id', auth, organizerOrAdmin, validate(editEventSchema), (req, res) =>
        eventController.editEvent(req, res),
    );
    router.delete('/:id', auth, organizerOrAdmin, validate(deleteEventSchema), (req, res) =>
        eventController.deleteEvent(req, res),
    );
    router.post('/:id/notify', auth, organizerOnly, validate(notifySubscribersSchema), (req, res) =>
        eventController.notifySubscribers(req, res),
    );
    router.post(
        '/:id/gallery',
        auth,
        organizerOrAdmin,
        uploadGalleryImages,
        validate(addGalleryPhotosSchema),
        (req, res) => eventController.addGalleryPhotos(req, res),
    );
    router.delete('/:id/gallery', auth, organizerOrAdmin, validate(deleteGalleryPhotoSchema), (req, res) =>
        eventController.deleteGalleryPhoto(req, res),
    );

    return router;
}
