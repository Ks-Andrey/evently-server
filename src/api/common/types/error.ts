export interface ErrorResponse {
    type?: string;
    title: string;
    status: number;
    detail: string;
    errorCode: string;
    instance?: string;
    context?: Record<string, unknown>;
}
