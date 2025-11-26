import { Response } from 'express';
import { Result } from 'true-myth';

import { ErrorResponse } from '@api/common/types/error';
import { ApplicationErrorCodes, ApplicationException } from '@application/common';

export function getHttpStatusFromErrorCode(errorCode: string): number {
    switch (errorCode) {
        case ApplicationErrorCodes.INVALID_INPUT:
            return 400;
        case ApplicationErrorCodes.RESOURCE_NOT_FOUND:
            return 404;
        case ApplicationErrorCodes.RESOURCE_ALREADY_EXISTS:
            return 409;
        case ApplicationErrorCodes.ACCESS_DENIED:
            return 403;
        case ApplicationErrorCodes.RESOURCE_IN_USE:
        case ApplicationErrorCodes.BUSINESS_RULE_VIOLATION:
            return 422;
        case ApplicationErrorCodes.UNKNOWN_ERROR:
        default:
            return 500;
    }
}

export function getErrorTitle(errorCode: string): string {
    switch (errorCode) {
        case ApplicationErrorCodes.INVALID_INPUT:
            return 'Validation Error';
        case ApplicationErrorCodes.RESOURCE_NOT_FOUND:
            return 'Resource Not Found';
        case ApplicationErrorCodes.RESOURCE_ALREADY_EXISTS:
            return 'Resource Already Exists';
        case ApplicationErrorCodes.ACCESS_DENIED:
            return 'Access Denied';
        case ApplicationErrorCodes.RESOURCE_IN_USE:
            return 'Resource In Use';
        case ApplicationErrorCodes.BUSINESS_RULE_VIOLATION:
            return 'Business Rule Violation';
        case ApplicationErrorCodes.UNKNOWN_ERROR:
        default:
            return 'Internal Server Error';
    }
}

export function createErrorResponse(error: ApplicationException, status?: number): ErrorResponse {
    const httpStatus = status ?? getHttpStatusFromErrorCode(error.errorCode);
    return {
        type: `https://api.example.com/errors/${error.errorCode}`,
        title: getErrorTitle(error.errorCode),
        status: httpStatus,
        detail: error.message,
        errorCode: error.errorCode,
        context: error.context,
    };
}

export function handleResult<T>(
    result: Result<T, ApplicationException>,
    res: Response,
    successStatus: number = 200,
): void {
    if (result.isErr) {
        const errorResponse = createErrorResponse(result.error);
        res.status(errorResponse.status).json(errorResponse);
        return;
    }

    res.status(successStatus).json(result.value);
}
