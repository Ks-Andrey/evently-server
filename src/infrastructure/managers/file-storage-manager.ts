import { promises } from 'fs';
import { join, dirname } from 'path';

import {
    FileStorageAccessDeniedException,
    FileStorageDeleteException,
    FileStorageFileNotFoundException,
    FileStorageIoException,
    FileStorageMoveException,
} from '@application/common';
import { IFileStorageManager } from '@application/common';
import { getErrorMessage, isError } from '@common/utils/error';
import { log } from '@common/utils/logger';

export class FileStorageManager implements IFileStorageManager {
    private readonly basePath: string;

    constructor(basePath: string = process.cwd()) {
        this.basePath = basePath;
    }

    async moveTo(filePath: string, directory: string): Promise<void> {
        const sourcePath = join(this.basePath, filePath);
        const targetDir = join(this.basePath, directory);
        const targetPath = join(targetDir, this.getFileName(filePath));

        try {
            await promises.mkdir(targetDir, { recursive: true });
            await promises.rename(sourcePath, targetPath);
        } catch (error: unknown) {
            log.error('Error moving file', {
                sourcePath,
                targetPath,
                error: log.formatError(error),
            });

            if (isError(error)) {
                const errorMessage = error.message;
                if (errorMessage.includes('ENOENT')) {
                    throw new FileStorageFileNotFoundException({
                        filePath: sourcePath,
                        message: errorMessage,
                    });
                }

                if (errorMessage.includes('EACCES') || errorMessage.includes('permission')) {
                    throw new FileStorageAccessDeniedException({
                        filePath: sourcePath,
                        message: errorMessage,
                    });
                }

                if (
                    errorMessage.includes('EISDIR') ||
                    errorMessage.includes('ENOTDIR') ||
                    errorMessage.includes('EEXIST')
                ) {
                    throw new FileStorageIoException({
                        filePath: sourcePath,
                        message: errorMessage,
                    });
                }
            }

            throw new FileStorageMoveException({
                filePath: sourcePath,
                targetPath,
                error: getErrorMessage(error),
            });
        }
    }

    async delete(filePath: string): Promise<void> {
        const fullPath = join(this.basePath, filePath);

        try {
            await promises.unlink(fullPath);

            const parentDir = dirname(fullPath);
            await promises.rmdir(parentDir);
        } catch (error: unknown) {
            log.error('Error deleting file', {
                filePath: fullPath,
                error: log.formatError(error),
            });

            if (isError(error)) {
                const errorMessage = error.message;
                if (errorMessage.includes('ENOENT')) {
                    throw new FileStorageFileNotFoundException({
                        filePath: fullPath,
                        message: errorMessage,
                    });
                }

                if (errorMessage.includes('EACCES') || errorMessage.includes('permission')) {
                    throw new FileStorageAccessDeniedException({
                        filePath: fullPath,
                        message: errorMessage,
                    });
                }

                if (errorMessage.includes('ENOTEMPTY') || errorMessage.includes('EBUSY')) {
                    // Игнорируем ошибки при удалении директории, если она не пуста
                    return;
                }
            }

            throw new FileStorageDeleteException({
                filePath: fullPath,
                error: getErrorMessage(error),
            });
        }
    }

    private getFileName(filePath: string): string {
        const parts = filePath.split(/[/\\]/);
        return parts[parts.length - 1];
    }
}
