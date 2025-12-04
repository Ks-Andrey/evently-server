import { Request, Response } from 'express';

import {
    GetUserStatisticsHandler,
    GetEventStatisticsHandler,
    GetSystemStatisticsHandler,
} from '@application/services/statistics';

import { handleResult } from '../common/utils/error-handler';

export class StatisticsController {
    constructor(
        private readonly getUserStatisticsHandler: GetUserStatisticsHandler,
        private readonly getEventStatisticsHandler: GetEventStatisticsHandler,
        private readonly getSystemStatisticsHandler: GetSystemStatisticsHandler,
    ) {}

    async getUserStatistics(_req: Request, res: Response): Promise<void> {
        const result = await this.getUserStatisticsHandler.execute();
        handleResult(result, res);
    }

    async getEventStatistics(_req: Request, res: Response): Promise<void> {
        const result = await this.getEventStatisticsHandler.execute();
        handleResult(result, res);
    }

    async getSystemStatistics(_req: Request, res: Response): Promise<void> {
        const result = await this.getSystemStatisticsHandler.execute();
        handleResult(result, res);
    }
}
