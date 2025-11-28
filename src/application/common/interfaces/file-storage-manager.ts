export interface IFileStorageManager {
    moveTo(filePath: string, directory: string): Promise<void>;
    delete(filePath: string): Promise<void>;
}
