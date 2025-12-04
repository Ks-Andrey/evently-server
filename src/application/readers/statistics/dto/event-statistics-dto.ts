export class EventStatisticsDTO {
    private constructor(
        readonly total: number,
        readonly active: number,
        readonly upcoming: number,
        readonly past: number,
        readonly byCategory: Array<{
            categoryId: string;
            categoryName: string;
            count: number;
        }>,
        readonly totalSubscriptions: number,
        readonly totalComments: number,
    ) {}

    static create(
        total: number,
        active: number,
        upcoming: number,
        past: number,
        byCategory: Array<{ categoryId: string; categoryName: string; count: number }>,
        totalSubscriptions: number,
        totalComments: number,
    ): EventStatisticsDTO {
        return new EventStatisticsDTO(total, active, upcoming, past, byCategory, totalSubscriptions, totalComments);
    }
}
