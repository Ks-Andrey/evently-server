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

import { TEMP_UPLOADS_DIR } from '@common/config/app';
import {
    fileSizeLimits,
    allowedMimeTypes,
    allowedExtensions,
    imageDimensions,
    galleryMaxPhotos,
} from '@common/constants/file-upload';

import { createErrorResponse } from '../common';

const tempStoragePath = path.join(process.cwd(), TEMP_UPLOADS_DIR);

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
        const metadata = await sharp(file.path).metadata();
        const { width, height } = metadata;

        if (width && width > maxWidth) {
            return cb(new ImageWidthExceededException({ width, maxWidth }));
        }
        if (height && height > maxHeight) {
            return cb(new ImageHeightExceededException({ height, maxHeight }));
        }

        cb(null, true);
    } catch {
        cb(new FileProcessingException({ fileName: file.originalname }));
    }
}

function avatarFileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedMimeTypes.AVATAR.some((type) => type === file.mimetype)) {
        return cb(new InvalidFileTypeException({ fileName: file.originalname, mimeType: file.mimetype }));
    }
    if (!allowedExtensions.AVATAR.some((extension) => extension === ext)) {
        return cb(new InvalidFileExtensionException({ fileName: file.originalname, extension: ext }));
    }

    validateImageDimensions(file, imageDimensions.AVATAR_MAX_WIDTH, imageDimensions.AVATAR_MAX_HEIGHT, cb);
}

function galleryFileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedMimeTypes.GALLERY.some((type) => type === file.mimetype)) {
        return cb(new InvalidFileTypeException({ fileName: file.originalname, mimeType: file.mimetype }));
    }
    if (!allowedExtensions.GALLERY.some((extension) => extension === ext)) {
        return cb(new InvalidFileExtensionException({ fileName: file.originalname, extension: ext }));
    }

    validateImageDimensions(file, imageDimensions.GALLERY_MAX_WIDTH, imageDimensions.GALLERY_MAX_HEIGHT, cb);
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
        limits: { fileSize: fileSizeLimits.AVATAR_MAX_SIZE },
    }).single('file'),
);

export const uploadGalleryImages = createMulterArrayMiddleware(
    multer({
        storage: createStorage(),
        fileFilter: galleryFileFilter,
        limits: { fileSize: fileSizeLimits.GALLERY_IMAGE_MAX_SIZE },
    }).array('files', galleryMaxPhotos),
);
