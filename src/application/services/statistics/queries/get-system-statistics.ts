import { Result } from 'true-myth';

import { ApplicationException, safeAsync } from '@application/common';
import { SystemStatisticsDTO, IStatisticsReader } from '@application/readers/statistics';

export class GetSystemStatisticsHandler {
    constructor(private readonly statisticsReader: IStatisticsReader) {}

    async execute(): Promise<Result<SystemStatisticsDTO, ApplicationException>> {
        return safeAsync(async () => {
            return await this.statisticsReader.getSystemStatistics();
        });
    }
}
