import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
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
    FILE_SIZE_LIMITS,
    ALLOWED_MIME_TYPES,
    allowedExtensions,
    IMAGE_DIMENSIONS,
    GALLERY_MAX_PHOTOS,
} from '@common/constants/file-upload';

import { createErrorResponse } from '../common';

const memoryStorage = multer.memoryStorage();

function checkMimeAndExt(
    file: Express.Multer.File,
    allowedTypes: string[],
    allowedExts: string[],
    cb: FileFilterCallback,
) {
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new InvalidFileTypeException({ fileName: file.originalname, mimeType: file.mimetype }));
    }

    if (!allowedExts.includes(ext)) {
        return cb(new InvalidFileExtensionException({ fileName: file.originalname, extension: ext }));
    }

    return cb(null, true);
}

function avatarFileFilter(_: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    return checkMimeAndExt(file, ALLOWED_MIME_TYPES.AVATAR, allowedExtensions.AVATAR, cb);
}

function galleryFileFilter(_: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    return checkMimeAndExt(file, ALLOWED_MIME_TYPES.GALLERY, allowedExtensions.GALLERY, cb);
}

export const uploadAvatar = multer({
    storage: memoryStorage,
    fileFilter: avatarFileFilter,
    limits: { fileSize: FILE_SIZE_LIMITS.AVATAR_MAX_SIZE },
}).single('file');

export const uploadGalleryImages = multer({
    storage: memoryStorage,
    fileFilter: galleryFileFilter,
    limits: { fileSize: FILE_SIZE_LIMITS.GALLERY_IMAGE_MAX_SIZE },
}).array('files', GALLERY_MAX_PHOTOS);

export async function validateAvatarDimensions(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.file || !req.file.buffer) {
            throw new FileProcessingException();
        }

        const { width, height } = await sharp(req.file.buffer).metadata();

        if (!width || !height) throw new FileProcessingException({ fileName: req.file.originalname });

        if (width > IMAGE_DIMENSIONS.AVATAR_MAX_WIDTH) {
            throw new ImageWidthExceededException({
                width,
                maxWidth: IMAGE_DIMENSIONS.AVATAR_MAX_WIDTH,
            });
        }

        if (height > IMAGE_DIMENSIONS.AVATAR_MAX_HEIGHT) {
            throw new ImageHeightExceededException({
                height,
                maxHeight: IMAGE_DIMENSIONS.AVATAR_MAX_HEIGHT,
            });
        }

        next();
    } catch (err) {
        const error = createErrorResponse(err);
        return res.status(error.status).json(error);
    }
}

export async function validateGalleryDimensions(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw new FileProcessingException();
        }

        for (const file of req.files as Express.Multer.File[]) {
            const { width, height } = await sharp(file.buffer).metadata();

            if (!width || !height) {
                throw new FileProcessingException({ fileName: file.originalname });
            }

            if (width > IMAGE_DIMENSIONS.GALLERY_MAX_WIDTH) {
                throw new ImageWidthExceededException({
                    width,
                    maxWidth: IMAGE_DIMENSIONS.GALLERY_MAX_WIDTH,
                });
            }

            if (height > IMAGE_DIMENSIONS.GALLERY_MAX_HEIGHT) {
                throw new ImageHeightExceededException({
                    height,
                    maxHeight: IMAGE_DIMENSIONS.GALLERY_MAX_HEIGHT,
                });
            }
        }

        next();
    } catch (err) {
        const error = createErrorResponse(err);
        return res.status(error.status).json(error);
    }
}
