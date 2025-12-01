import { ApplicationErrorCodes } from '@application/common/exceptions/error-codes';
import { ApplicationException } from '@application/common/exceptions/exceptions';
import { ERROR_MESSAGES } from '@common/constants/errors';

export class GeocodingNotFoundException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.geocoder.notFound, ApplicationErrorCodes.RESOURCE_NOT_FOUND, context);
    }
}

export class GeocoderApiErrorException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.geocoder.failed, ApplicationErrorCodes.UNKNOWN_ERROR, context);
    }
}

export class GeocoderNetworkErrorException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.geocoder.failed, ApplicationErrorCodes.UNKNOWN_ERROR, context);
    }
}
