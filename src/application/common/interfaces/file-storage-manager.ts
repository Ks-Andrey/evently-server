export interface IFileStorageManager {
    moveToPermanentStorage(fileId: string, subdirectory: string): Promise<string>;
    deleteFromTempStorage(fileId: string): Promise<void>;
    deleteFromPermanentStorage(filePath: string): Promise<void>;
}
