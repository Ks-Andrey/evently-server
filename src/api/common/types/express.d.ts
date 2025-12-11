import { UserJwtPayload } from '@common/types/auth';

declare global {
    interface MemoryUploadedFile {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
        size: number;
    }

    namespace Express {
        interface Request {
            user?: UserJwtPayload;
            file?: MemoryUploadedFile;
            files?: MemoryUploadedFile[];
        }
    }
}
