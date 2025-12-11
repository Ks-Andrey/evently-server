import { Router } from 'express';

import { ITokenManager } from '@application/services/auth';
import { Roles } from '@common/constants/roles';

import { EventController } from '../controllers/event-controller';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth-middleware';
import { uploadGalleryImages, validateGalleryDimensions } from '../middlewares/file-upload-middleware';
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
    const optionalAuth = optionalAuthMiddleware(tokenManager);
    const organizerOrAdmin = roleMiddleware([Roles.ORGANIZER, Roles.ADMIN]);

    router.get('/', optionalAuth, validate(getEventsSchema), (req, res) => eventController.getEvents(req, res));

    router.get('/organizer/my', auth, organizerOrAdmin, validate(getOrganizerEventsSchema), (req, res) =>
        eventController.getOrganizerEvents(req, res),
    );

    router.get('/:id', optionalAuth, validate(getEventByIdSchema), (req, res) =>
        eventController.getEventById(req, res),
    );
    router.get('/:id/subscribers', validate(getEventSubscribersSchema), (req, res) =>
        eventController.getEventSubscribers(req, res),
    );
    router.post('/', auth, organizerOrAdmin, validate(createEventSchema), (req, res) =>
        eventController.createEvent(req, res),
    );
    router.put('/:id', auth, organizerOrAdmin, validate(editEventSchema), (req, res) =>
        eventController.editEvent(req, res),
    );
    router.delete('/:id', auth, organizerOrAdmin, validate(deleteEventSchema), (req, res) =>
        eventController.deleteEvent(req, res),
    );
    router.post('/:id/notify', auth, organizerOrAdmin, validate(notifySubscribersSchema), (req, res) =>
        eventController.notifySubscribers(req, res),
    );
    router.post(
        '/:id/gallery',
        auth,
        organizerOrAdmin,
        uploadGalleryImages,
        validateGalleryDimensions,
        validate(addGalleryPhotosSchema),
        (req, res) => eventController.addGalleryPhotos(req, res),
    );
    router.delete('/:id/gallery', auth, organizerOrAdmin, validate(deleteGalleryPhotoSchema), (req, res) =>
        eventController.deleteGalleryPhoto(req, res),
    );

    return router;
}
