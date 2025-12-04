import { EventStatisticsDTO } from './event-statistics-dto';
import { UserStatisticsDTO } from './user-statistics-dto';

export class SystemStatisticsDTO {
    private constructor(
        readonly users: UserStatisticsDTO,
        readonly events: EventStatisticsDTO,
        readonly categories: number,
        readonly comments: number,
        readonly notifications: number,
    ) {}

    static create(
        users: UserStatisticsDTO,
        events: EventStatisticsDTO,
        categories: number,
        comments: number,
        notifications: number,
    ): SystemStatisticsDTO {
        return new SystemStatisticsDTO(users, events, categories, comments, notifications);
    }
}
