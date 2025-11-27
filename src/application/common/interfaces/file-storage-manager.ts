export interface IFileStorageManager {
    moveToPermanentStorage(fileName: string, subdirectory: string): Promise<void>;
    deleteFromTempStorage(fileName: string): Promise<void>;
    deleteFromPermanentStorage(fileName: string): Promise<void>;
}
