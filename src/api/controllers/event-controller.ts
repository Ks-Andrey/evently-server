import { UUID } from 'crypto';
import { Request, Response } from 'express';

import {
    CreateEvent,
    CreateEventHandler,
    DeleteEvent,
    DeleteEventHandler,
    EditEventDetails,
    EditEventDetailsHandler,
    FindEventById,
    FindEventByIdHandler,
    FindEventSubscribers,
    FindEventSubscribersHandler,
    FindEvents,
    FindEventsHandler,
    FindOrganizerEvents,
    FindOrganizerEventsHandler,
} from '@application/services/event';
import { NotifyEventSubscribers, NotifyEventSubscribersHandler } from '@application/services/notification';

import { handleResult } from '../common/utils/error-handler';

export class EventController {
    constructor(
        private readonly findEventsHandler: FindEventsHandler,
        private readonly findEventByIdHandler: FindEventByIdHandler,
        private readonly findOrganizerEventsHandler: FindOrganizerEventsHandler,
        private readonly findEventSubscribersHandler: FindEventSubscribersHandler,
        private readonly createEventHandler: CreateEventHandler,
        private readonly editEventDetailsHandler: EditEventDetailsHandler,
        private readonly deleteEventHandler: DeleteEventHandler,
        private readonly notifyEventSubscribersHandler: NotifyEventSubscribersHandler,
    ) {}

    async getEvents(req: Request, res: Response): Promise<void> {
        const { categoryId, dateFrom, dateTo, keyword } = req.query;
        const query = new FindEvents(
            categoryId as UUID,
            dateFrom ? new Date(dateFrom as string) : undefined,
            dateTo ? new Date(dateTo as string) : undefined,
            keyword as string | undefined,
        );
        const result = await this.findEventsHandler.execute(query);
        handleResult(result, res);
    }

    async getEventById(req: Request, res: Response): Promise<void> {
        const { eventId } = req.params;
        const query = new FindEventById(eventId as UUID);
        const result = await this.findEventByIdHandler.execute(query);
        handleResult(result, res);
    }

    async getOrganizerEvents(req: Request, res: Response): Promise<void> {
        const query = new FindOrganizerEvents(req.user!.userId);
        const result = await this.findOrganizerEventsHandler.execute(query);
        handleResult(result, res);
    }

    async getEventSubscribers(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const query = new FindEventSubscribers(id as UUID);
        const result = await this.findEventSubscribersHandler.execute(query);
        handleResult(result, res);
    }

    async createEvent(req: Request, res: Response): Promise<void> {
        const { categoryId, title, description, date, location } = req.body;
        const command = new CreateEvent(req.user!.userId, categoryId, title, description, new Date(date), location);
        const result = await this.createEventHandler.execute(command);
        handleResult(result, res, 201);
    }

    async editEvent(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { title, description, date, location, categoryId } = req.body;
        const command = new EditEventDetails(
            req.user!.role,
            req.user!.userId,
            id as UUID,
            title,
            description,
            date ? new Date(date) : undefined,
            location,
            categoryId,
        );
        const result = await this.editEventDetailsHandler.execute(command);
        handleResult(result, res);
    }

    async deleteEvent(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const command = new DeleteEvent(req.user!.role, req.user!.userId, id as UUID);
        const result = await this.deleteEventHandler.execute(command);
        handleResult(result, res);
    }

    async notifySubscribers(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { message } = req.body;
        const command = new NotifyEventSubscribers(id as UUID, message);
        const result = await this.notifyEventSubscribersHandler.execute(command);
        handleResult(result, res);
    }
}
