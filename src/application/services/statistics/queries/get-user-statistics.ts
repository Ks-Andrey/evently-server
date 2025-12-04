import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { UserStatisticsDTO, IStatisticsReader } from '@application/readers/statistics';

export class GetUserStatisticsHandler {
    constructor(private readonly statisticsReader: IStatisticsReader) {}

    async execute(): Promise<Result<UserStatisticsDTO, ApplicationException>> {
        return safeAsync(async () => {
            return await this.statisticsReader.getUserStatistics();
        });
    }
}
