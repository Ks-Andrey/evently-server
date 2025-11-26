import { UserJwtPayload } from '@common/types/auth';

declare global {
    namespace Express {
        interface Request {
            user?: UserJwtPayload;
            fileData?: {
                buffer: Buffer;
                mimeType: string;
                fileName: string;
                dimensions: { width: number; height: number };
            };
        }
    }
}
