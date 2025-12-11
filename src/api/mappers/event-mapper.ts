import { UUID } from 'crypto';
import { Request } from 'express';

import { NotAuthenticatedException } from '@application/common';
import {
    AddEventGalleryPhotos,
    CreateEvent,
    DeleteEvent,
    DeleteEventGalleryPhoto,
    EditEventDetails,
    FindEventById,
    FindEventSubscribers,
    FindEvents,
    FindOrganizerEvents,
} from '@application/services/event';
import { NotifyEventSubscribers } from '@application/services/notification';

import { parsePaginationParams } from '../common/utils/pagination';

export class EventMapper {
    static toFindEventsQuery(req: Request): FindEvents {
        const pagination = parsePaginationParams(req);
        const { categoryId, dateFrom, dateTo, keyword } = req.query;
        return new FindEvents(
            pagination,
            categoryId as UUID,
            dateFrom as string,
            dateTo as string,
            keyword as string,
            req.user?.userId,
        );
    }

    static toFindEventByIdQuery(req: Request): FindEventById {
        const { id } = req.params;
        return new FindEventById(id as UUID, req.user?.userId);
    }

    static toFindOrganizerEventsQuery(req: Request): FindOrganizerEvents {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        const pagination = parsePaginationParams(req);
        const { dateFrom, dateTo, keyword } = req.query;
        return new FindOrganizerEvents(
            req.user.userId,
            pagination,
            dateFrom as string,
            dateTo as string,
            keyword as string,
            req.user.userId,
        );
    }

    static toFindEventSubscribersQuery(req: Request): FindEventSubscribers {
        const { id } = req.params;
        const pagination = parsePaginationParams(req);
        const search = req.query.search as string;
        return new FindEventSubscribers(id as UUID, pagination, search);
    }

    static toCreateEventCommand(req: Request): CreateEvent {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        const { categoryId, title, description, date, location, latitude, longitude } = req.body;
        return new CreateEvent(
            req.user.userId,
            categoryId,
            title,
            description,
            new Date(date),
            location,
            latitude,
            longitude,
        );
    }

    static toEditEventCommand(req: Request): EditEventDetails {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        const { id } = req.params;
        const { title, description, date, location, latitude, longitude, categoryId } = req.body;
        return new EditEventDetails(
            req.user.role,
            req.user.userId,
            id as UUID,
            title,
            description,
            date,
            location,
            latitude,
            longitude,
            categoryId,
        );
    }

    static toDeleteEventCommand(req: Request): DeleteEvent {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        const { id } = req.params;
        return new DeleteEvent(req.user.role, req.user.userId, id as UUID);
    }

    static toNotifySubscribersCommand(req: Request): NotifyEventSubscribers {
        const { id } = req.params;
        const { message } = req.body;
        return new NotifyEventSubscribers(id as UUID, message);
    }

    static toAddGalleryPhotosCommand(req: Request): AddEventGalleryPhotos {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        if (!req.fileNames) {
            throw new Error('File names are required');
        }
        const { id } = req.params;
        return new AddEventGalleryPhotos(req.user.role, req.user.userId, id as UUID, req.fileNames);
    }

    static toDeleteGalleryPhotoCommand(req: Request): DeleteEventGalleryPhoto {
        if (!req.user) {
            throw new NotAuthenticatedException();
        }
        const { id } = req.params;
        const { photoUrl } = req.body;
        return new DeleteEventGalleryPhoto(req.user.role, req.user.userId, id as UUID, photoUrl);
    }
}
