import { promises } from 'fs';
import { join } from 'path';

import {
    FileStorageAccessDeniedException,
    FileStorageDeleteException,
    FileStorageIoException,
} from '@application/common';
import { IFileStorageManager } from '@application/common';
import { getErrorMessage, isError } from '@common/utils/error';
import { log } from '@common/utils/logger';

export class FileStorageManager implements IFileStorageManager {
    private readonly basePath: string;

    constructor(basePath: string = process.cwd()) {
        this.basePath = basePath;
    }

    async save(buffer: Buffer, fileName: string, dirname: string): Promise<void> {
        const targetDir = join(this.basePath, dirname);
        const targetPath = join(targetDir, fileName);

        try {
            await promises.mkdir(targetDir, { recursive: true });
            await promises.writeFile(targetPath, buffer);
        } catch (error: unknown) {
            log.error('Error saving file', {
                targetPath,
                dirname,
                error: log.formatError(error),
            });

            if (isError(error)) {
                const errorMessage = error.message;
                if (errorMessage.includes('EACCES') || errorMessage.includes('permission')) {
                    throw new FileStorageAccessDeniedException({
                        filePath: targetPath,
                        message: errorMessage,
                    });
                }

                if (
                    errorMessage.includes('EISDIR') ||
                    errorMessage.includes('ENOTDIR') ||
                    errorMessage.includes('EEXIST')
                ) {
                    throw new FileStorageIoException({
                        filePath: targetPath,
                        message: errorMessage,
                    });
                }
            }

            throw new FileStorageIoException({
                filePath: targetPath,
                message: getErrorMessage(error),
            });
        }
    }

    async delete(fileName: string, dirname: string): Promise<void> {
        const fullPath = join(this.basePath, dirname, fileName);

        try {
            await promises.unlink(fullPath);
        } catch (error: unknown) {
            log.error('Error deleting file', {
                filePath: fullPath,
                error: log.formatError(error),
            });

            if (isError(error)) {
                const errorMessage = error.message;
                if (errorMessage.includes('ENOENT')) {
                    return;
                }

                if (errorMessage.includes('EACCES') || errorMessage.includes('permission')) {
                    throw new FileStorageAccessDeniedException({
                        filePath: fullPath,
                        message: errorMessage,
                    });
                }
            }

            throw new FileStorageDeleteException({
                filePath: fullPath,
                error: getErrorMessage(error),
            });
        }
    }
}
