export interface IFileStorageManager {
    save(buffer: Buffer, filePath: string, dirname: string): Promise<void>;
    delete(filePath: string, dirname: string): Promise<void>;
}
