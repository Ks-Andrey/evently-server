import { Router } from 'express';

import { ITokenManager } from '@application/services/auth';
import { Roles } from '@common/constants/roles';

import { EventController } from '../controllers/event-controller';
import { authMiddleware } from '../middlewares/auth-middleware';
import { roleMiddleware } from '../middlewares/role-middleware';

export function createEventRoutes(eventController: EventController, tokenManager: ITokenManager): Router {
    const router = Router();
    const auth = authMiddleware(tokenManager);
    const organizerOnly = roleMiddleware([Roles.ORGANIZER]);
    const organizerOrAdmin = roleMiddleware([Roles.ORGANIZER, Roles.ADMIN]);

    // Публичные маршруты
    router.get('/', (req, res) => eventController.getEvents(req, res));
    router.get('/:id', (req, res) => eventController.getEventById(req, res));
    router.get('/:id/subscribers', (req, res) => eventController.getEventSubscribers(req, res));

    // Защищенные маршруты для организаторов
    router.get('/organizer/my', auth, organizerOnly, (req, res) => eventController.getOrganizerEvents(req, res));
    router.post('/', auth, organizerOnly, (req, res) => eventController.createEvent(req, res));
    router.put('/:id', auth, organizerOrAdmin, (req, res) => eventController.editEvent(req, res));
    router.delete('/:id', auth, organizerOrAdmin, (req, res) => eventController.deleteEvent(req, res));
    router.post('/:id/notify', auth, organizerOnly, (req, res) => eventController.notifySubscribers(req, res));
    return router;
}
