import { promises } from 'fs';
import { join, dirname } from 'path';

import { IFileStorageManager } from '@application/common';

export class FileStorageManager implements IFileStorageManager {
    private readonly basePath: string;

    constructor(basePath: string = process.cwd()) {
        this.basePath = basePath;
    }

    async moveTo(filePath: string, directory: string): Promise<void> {
        const sourcePath = join(this.basePath, filePath);
        const targetDir = join(this.basePath, directory);
        const targetPath = join(targetDir, this.getFileName(filePath));

        await promises.mkdir(targetDir, { recursive: true });

        await promises.rename(sourcePath, targetPath);
    }

    async delete(filePath: string): Promise<void> {
        const fullPath = join(this.basePath, filePath);

        await promises.unlink(fullPath);

        const parentDir = dirname(fullPath);
        await promises.rmdir(parentDir);
    }

    private getFileName(filePath: string): string {
        const parts = filePath.split(/[/\\]/);
        return parts[parts.length - 1];
    }
}
