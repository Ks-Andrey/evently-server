export const ApplicationErrorCodes = {
    INVALID_INPUT: 'INVALID_INPUT',
    RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
    RESOURCE_IN_USE: 'RESOURCE_IN_USE',
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
    ACCESS_DENIED: 'ACCESS_DENIED',
    BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;
export type ApplicationErrorCode = (typeof ApplicationErrorCodes)[keyof typeof ApplicationErrorCodes];
