import { UUID } from 'crypto';

export interface FileUploadResult {
    url: string;
    fileName: string;
}

export interface IFileStorage {
    uploadAvatar(userId: UUID, file: Buffer, mimeType: string, fileName: string): Promise<FileUploadResult>;
    uploadGalleryPhoto(eventId: UUID, file: Buffer, mimeType: string, fileName: string): Promise<FileUploadResult>;
    deleteFile(url: string): Promise<void>;
}
