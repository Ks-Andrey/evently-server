import { Request } from 'express';

import { PaginationParams } from '@application/common';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

function parseInt(value: string | undefined, fallback: number): number {
    if (!value) {
        return fallback;
    }
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
}

export function parsePaginationParams(req: Request): PaginationParams {
    const page = parseInt(req.query.page as string, DEFAULT_PAGE);
    const pageSize = parseInt(req.query.pageSize as string, DEFAULT_PAGE_SIZE);

    return {
        page: Math.max(1, page),
        pageSize: Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE),
    };
}
