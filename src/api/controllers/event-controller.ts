import { Request, Response } from 'express';

import {
    CreateEventHandler,
    DeleteEventHandler,
    EditEventDetailsHandler,
    FindEventByIdHandler,
    FindEventSubscribersHandler,
    FindEventsHandler,
    FindOrganizerEventsHandler,
    AddEventGalleryPhotosHandler,
    DeleteEventGalleryPhotoHandler,
} from '@application/services/event';
import { NotifyEventSubscribersHandler } from '@application/services/notification';

import { handleResult } from '../common/utils/error-handler';
import { EventMapper } from '../mappers';

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
        private readonly addEventGalleryPhotosHandler: AddEventGalleryPhotosHandler,
        private readonly deleteEventGalleryPhotoHandler: DeleteEventGalleryPhotoHandler,
    ) {}

    async getEvents(req: Request, res: Response): Promise<void> {
        const query = EventMapper.toFindEventsQuery(req);
        const result = await this.findEventsHandler.execute(query);
        handleResult(result, res);
    }

    async getEventById(req: Request, res: Response): Promise<void> {
        const query = EventMapper.toFindEventByIdQuery(req);
        const result = await this.findEventByIdHandler.execute(query);
        handleResult(result, res);
    }

    async getOrganizerEvents(req: Request, res: Response): Promise<void> {
        const query = EventMapper.toFindOrganizerEventsQuery(req);
        const result = await this.findOrganizerEventsHandler.execute(query);
        handleResult(result, res);
    }

    async getEventSubscribers(req: Request, res: Response): Promise<void> {
        const query = EventMapper.toFindEventSubscribersQuery(req);
        const result = await this.findEventSubscribersHandler.execute(query);
        handleResult(result, res);
    }

    async createEvent(req: Request, res: Response): Promise<void> {
        const command = EventMapper.toCreateEventCommand(req);
        const result = await this.createEventHandler.execute(command);
        handleResult(result, res, 201);
    }

    async editEvent(req: Request, res: Response): Promise<void> {
        const command = EventMapper.toEditEventCommand(req);
        const result = await this.editEventDetailsHandler.execute(command);
        handleResult(result, res);
    }

    async deleteEvent(req: Request, res: Response): Promise<void> {
        const command = EventMapper.toDeleteEventCommand(req);
        const result = await this.deleteEventHandler.execute(command);
        handleResult(result, res);
    }

    async notifySubscribers(req: Request, res: Response): Promise<void> {
        const command = EventMapper.toNotifySubscribersCommand(req);
        const result = await this.notifyEventSubscribersHandler.execute(command);
        handleResult(result, res);
    }

    async addGalleryPhotos(req: Request, res: Response): Promise<void> {
        const command = EventMapper.toAddGalleryPhotosCommand(req);
        const result = await this.addEventGalleryPhotosHandler.execute(command);
        handleResult(result, res);
    }

    async deleteGalleryPhoto(req: Request, res: Response): Promise<void> {
        const command = EventMapper.toDeleteGalleryPhotoCommand(req);
        const result = await this.deleteEventGalleryPhotoHandler.execute(command);
        handleResult(result, res);
    }
}
