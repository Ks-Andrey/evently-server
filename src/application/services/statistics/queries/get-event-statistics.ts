import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { EventStatisticsDTO, IStatisticsReader } from '@application/readers/statistics';

export class GetEventStatisticsHandler {
    constructor(private readonly statisticsReader: IStatisticsReader) {}

    async execute(): Promise<Result<EventStatisticsDTO, ApplicationException>> {
        return safeAsync(async () => {
            return await this.statisticsReader.getEventStatistics();
        });
    }
}
