import { ApplicationErrorCodes, ApplicationException } from '@application/common';
import { ERROR_MESSAGES } from '@common/constants/errors';

export class InvalidFileTypeException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.file.invalidFileType, ApplicationErrorCodes.INVALID_INPUT, context);
    }
}

export class InvalidFileExtensionException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.file.invalidFileExtension, ApplicationErrorCodes.INVALID_INPUT, context);
    }
}

export class ImageWidthExceededException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.file.imageWidthExceeded, ApplicationErrorCodes.INVALID_INPUT, context);
    }
}

export class ImageHeightExceededException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.file.imageHeightExceeded, ApplicationErrorCodes.INVALID_INPUT, context);
    }
}

export class NoFileUploadedException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.file.noFileUploaded, ApplicationErrorCodes.INVALID_INPUT, context);
    }
}

export class FileProcessingException extends ApplicationException {
    constructor(context?: Record<string, unknown>) {
        super(ERROR_MESSAGES.application.file.fileProcessingError, ApplicationErrorCodes.INVALID_INPUT, context);
    }
}
