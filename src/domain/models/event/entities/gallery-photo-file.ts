import { ALLOWED_MIME_TYPES, FILE_SIZE_LIMITS, IMAGE_DIMENSIONS } from '@common/constants/file-upload';

import {
    InvalidGalleryFileSizeException,
    InvalidGalleryFileTypeException,
    InvalidGalleryDimensionsException,
} from '../exceptions';

export interface ImageDimensions {
    width: number;
    height: number;
}

export class GalleryPhotoFile {
    private constructor(
        private readonly _buffer: Buffer,
        private readonly _mimeType: string,
        private readonly _fileName: string,
        private readonly _dimensions: ImageDimensions,
    ) {}

    static create(buffer: Buffer, mimeType: string, fileName: string, dimensions: ImageDimensions): GalleryPhotoFile {
        GalleryPhotoFile.ensureValidSize(buffer);
        GalleryPhotoFile.ensureValidMimeType(mimeType);
        GalleryPhotoFile.ensureValidDimensions(dimensions);

        return new GalleryPhotoFile(buffer, mimeType, fileName, dimensions);
    }

    private static ensureValidSize(buffer: Buffer): void {
        if (buffer.length > FILE_SIZE_LIMITS.GALLERY_IMAGE_MAX_SIZE) {
            throw new InvalidGalleryFileSizeException();
        }
    }

    private static ensureValidMimeType(mimeType: string): void {
        if (!ALLOWED_MIME_TYPES.GALLERY.includes(mimeType as (typeof ALLOWED_MIME_TYPES.GALLERY)[number])) {
            throw new InvalidGalleryFileTypeException();
        }
    }

    private static ensureValidDimensions(dimensions: ImageDimensions): void {
        if (
            dimensions.width > IMAGE_DIMENSIONS.GALLERY_MAX_WIDTH ||
            dimensions.height > IMAGE_DIMENSIONS.GALLERY_MAX_HEIGHT
        ) {
            throw new InvalidGalleryDimensionsException();
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
