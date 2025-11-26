import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';

import { ApplicationException, InvalidInputException, UnknownException } from '@application/common';

import { createErrorResponse } from '../common';

const upload = multer({ storage: multer.memoryStorage() });

export const fileUploadMiddleware = (fieldName: string) => {
    return upload.single(fieldName);
};

export const processImageFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const file = req.file;
    if (!file) {
        const error = new InvalidInputException();
        const errorResponse = createErrorResponse(error, 400);
        res.status(400).json(errorResponse);
        return;
    }

    try {
        const metadata = await sharp(Buffer.from(file.buffer)).metadata();
        req.fileData = {
            buffer: Buffer.from(file.buffer),
            mimeType: file.mimetype,
            fileName: file.originalname,
            dimensions: {
                width: metadata.width,
                height: metadata.height,
            },
        };
        next();
    } catch (error) {
        if (error instanceof ApplicationException) {
            const errorResponse = createErrorResponse(error);
            res.status(errorResponse.status).json(errorResponse);
            return;
        }
        const errorResponse = createErrorResponse(new UnknownException(), 500);
        res.status(500).json(errorResponse);
    }
};
