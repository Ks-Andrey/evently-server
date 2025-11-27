import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback, Multer } from 'multer';
import path from 'path';
import sharp from 'sharp';

import {
    InvalidFileTypeException,
    InvalidFileExtensionException,
    ImageWidthExceededException,
    ImageHeightExceededException,
    FileProcessingException,
} from '@application/services/file';

import {
    STORAGE_PATHS,
    FILE_SIZE_LIMITS,
    ALLOWED_MIME_TYPES,
    ALLOWED_EXTENSIONS,
    IMAGE_DIMENSIONS,
    GALLERY_MAX_PHOTOS,
} from '@common/constants/file-upload';

import { createErrorResponse } from '../common';

const tempStoragePath = path.join(process.cwd(), STORAGE_PATHS.TEMP_DIR_NAME);

function createStorage() {
    return multer.diskStorage({
        destination: (_req, _file, cb) => cb(null, tempStoragePath),
        filename: (req: Request, file: Express.Multer.File, cb) => {
            const fileId = randomUUID();
            const ext = path.extname(file.originalname).toLowerCase();
            const fileName = `${fileId}${ext}`;
            req.fileName = fileName;
            cb(null, fileName);
        },
    });
}

async function validateImageDimensions(
    file: Express.Multer.File,
    maxWidth: number,
    maxHeight: number,
    cb: FileFilterCallback,
) {
    try {
        const metadata = await sharp(file.buffer).metadata();
        const { width, height } = metadata;

        if (width && width > maxWidth) {
            return cb(new ImageWidthExceededException({ width, maxWidth }));
        }
        if (height && height > maxHeight) {
            return cb(new ImageHeightExceededException({ height, maxHeight }));
        }

        cb(null, true);
    } catch (_) {
        cb(new FileProcessingException({ fileName: file.originalname }));
    }
}

function avatarFileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    const ext = path.extname(file.originalname).toLowerCase();

    const allowedMimeTypes = ALLOWED_MIME_TYPES.AVATAR as readonly string[];
    const allowedExtensions = ALLOWED_EXTENSIONS.AVATAR as readonly string[];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new InvalidFileTypeException({ fileName: file.originalname, mimeType: file.mimetype }));
    }
    if (!allowedExtensions.includes(ext)) {
        return cb(new InvalidFileExtensionException({ fileName: file.originalname, extension: ext }));
    }

    validateImageDimensions(file, IMAGE_DIMENSIONS.AVATAR_MAX_WIDTH, IMAGE_DIMENSIONS.AVATAR_MAX_HEIGHT, cb);
}

function galleryFileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    const ext = path.extname(file.originalname).toLowerCase();

    const allowedMimeTypes = ALLOWED_MIME_TYPES.GALLERY as readonly string[];
    const allowedExtensions = ALLOWED_EXTENSIONS.GALLERY as readonly string[];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new InvalidFileTypeException({ fileName: file.originalname, mimeType: file.mimetype }));
    }
    if (!allowedExtensions.includes(ext)) {
        return cb(new InvalidFileExtensionException({ fileName: file.originalname, extension: ext }));
    }

    validateImageDimensions(file, IMAGE_DIMENSIONS.GALLERY_MAX_WIDTH, IMAGE_DIMENSIONS.GALLERY_MAX_HEIGHT, cb);
}

function createMulterMiddleware(multerInstance: ReturnType<Multer['single']>) {
    return (req: Request, res: Response, next: NextFunction) => {
        multerInstance(req, res, (err: unknown) => {
            if (err) {
                const errorResponse = createErrorResponse(err);
                return res.status(errorResponse.status).json(errorResponse);
            }
            if (!req.file) {
                const errorResponse = createErrorResponse(new FileProcessingException());
                return res.status(errorResponse.status).json(errorResponse);
            }
            next();
        });
    };
}

function createMulterArrayMiddleware(multerInstance: ReturnType<Multer['array']>) {
    return (req: Request, res: Response, next: NextFunction) => {
        multerInstance(req, res, (err: unknown) => {
            if (err) {
                const errorResponse = createErrorResponse(err);
                return res.status(errorResponse.status).json(errorResponse);
            }
            if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
                const errorResponse = createErrorResponse(new FileProcessingException());
                return res.status(errorResponse.status).json(errorResponse);
            }
            if (Array.isArray(req.files)) {
                req.fileNames = req.files.map((file) => file.filename);
            }
            next();
        });
    };
}

export const uploadAvatar = createMulterMiddleware(
    multer({
        storage: createStorage(),
        fileFilter: avatarFileFilter,
        limits: { fileSize: FILE_SIZE_LIMITS.AVATAR_MAX_SIZE },
    }).single('file'),
);

export const uploadGalleryImages = createMulterArrayMiddleware(
    multer({
        storage: createStorage(),
        fileFilter: galleryFileFilter,
        limits: { fileSize: FILE_SIZE_LIMITS.GALLERY_IMAGE_MAX_SIZE },
    }).array('files', GALLERY_MAX_PHOTOS),
);
