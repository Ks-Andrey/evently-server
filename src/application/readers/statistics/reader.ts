import { EventStatisticsDTO } from './dto/event-statistics-dto';
import { SystemStatisticsDTO } from './dto/system-statistics-dto';
import { UserStatisticsDTO } from './dto/user-statistics-dto';

export interface IStatisticsReader {
    getUserStatistics(): Promise<UserStatisticsDTO>;
    getEventStatistics(): Promise<EventStatisticsDTO>;
    getSystemStatistics(): Promise<SystemStatisticsDTO>;
}
