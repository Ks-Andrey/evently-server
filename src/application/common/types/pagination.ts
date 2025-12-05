export interface PaginationParams {
    page: number;
    pageSize: number;
}

export interface PaginationResult<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

export function createPaginationResult<T>(
    data: T[],
    total: number,
    page: number,
    pageSize: number,
): PaginationResult<T> {
    return {
        data,
        pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        },
    };
}
