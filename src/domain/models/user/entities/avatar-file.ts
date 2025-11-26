import { ALLOWED_MIME_TYPES, FILE_SIZE_LIMITS, IMAGE_DIMENSIONS } from '@common/constants/file-upload';

import {
    InvalidAvatarFileSizeException,
    InvalidAvatarFileTypeException,
    InvalidAvatarDimensionsException,
} from '../exceptions';

export interface ImageDimensions {
    width: number;
    height: number;
}

export class AvatarFile {
    private constructor(
        private readonly _buffer: Buffer,
        private readonly _mimeType: string,
        private readonly _fileName: string,
        private readonly _dimensions: ImageDimensions,
    ) {}

    static create(buffer: Buffer, mimeType: string, fileName: string, dimensions: ImageDimensions): AvatarFile {
        AvatarFile.ensureValidSize(buffer);
        AvatarFile.ensureValidMimeType(mimeType);
        AvatarFile.ensureValidDimensions(dimensions);

        return new AvatarFile(buffer, mimeType, fileName, dimensions);
    }

    private static ensureValidSize(buffer: Buffer): void {
        if (buffer.length > FILE_SIZE_LIMITS.AVATAR_MAX_SIZE) {
            throw new InvalidAvatarFileSizeException();
        }
    }

    private static ensureValidMimeType(mimeType: string): void {
        if (!ALLOWED_MIME_TYPES.AVATAR.includes(mimeType as (typeof ALLOWED_MIME_TYPES.AVATAR)[number])) {
            throw new InvalidAvatarFileTypeException();
        }
    }

    private static ensureValidDimensions(dimensions: ImageDimensions): void {
        if (
            dimensions.width > IMAGE_DIMENSIONS.AVATAR_MAX_WIDTH ||
            dimensions.height > IMAGE_DIMENSIONS.AVATAR_MAX_HEIGHT
        ) {
            throw new InvalidAvatarDimensionsException();
        }
    }

    get buffer(): Buffer {
        return this._buffer;
    }

    get mimeType(): string {
        return this._mimeType;
    }

    get fileName(): string {
        return this._fileName;
    }

    get dimensions(): ImageDimensions {
        return this._dimensions;
    }
}
