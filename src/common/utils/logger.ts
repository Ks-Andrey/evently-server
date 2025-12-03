import winston from 'winston';

import { getErrorMessage } from './error';
import { IS_PROD_MODE } from '../config/app';
import { LOG_DIR, LOG_LEVEL } from '../config/logger';

const { combine, timestamp, errors, json, printf, colorize } = winston.format;

const prettyConsoleFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
    const colors = {
        error: '\x1b[31m',
        warn: '\x1b[33m',
        info: '\x1b[36m',
        debug: '\x1b[35m',
        reset: '\x1b[0m',
    };

    let output = `${timestamp} [${level}]: ${message}`;

    const metaKeys = Object.keys(metadata);
    if (metaKeys.length > 0) {
        const filteredMeta = { ...metadata };
        delete filteredMeta.service;

        if (Object.keys(filteredMeta).length > 0) {
            output += '\n  ' + JSON.stringify(filteredMeta, null, 2).split('\n').join('\n  ');
        }
    }

    if (stack && typeof stack === 'string') {
        output += '\n\n' + colors.error + 'Stack Trace:' + colors.reset;
        const stackLines = stack.split('\n');
        stackLines.forEach((line: string, index: number) => {
            if (index === 0) {
                output += '\n  ' + colors.error + line + colors.reset;
            } else {
                output += '\n  ' + line.replace(/^\s+at\s+/, '  → ');
            }
        });
    }

    return output;
});

export const logger = winston.createLogger({
    level: LOG_LEVEL,
    format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), json()),
    defaultMeta: { service: 'server' },
    transports: [
        new winston.transports.File({
            filename: `${LOG_DIR}/error.log`,
            level: 'error',
            format: combine(timestamp(), json()),
        }),
        new winston.transports.File({
            filename: `${LOG_DIR}/combined.log`,
            format: combine(timestamp(), json()),
        }),
    ],
    exceptionHandlers: [new winston.transports.File({ filename: 'logs/exceptions.log' })],
    rejectionHandlers: [new winston.transports.File({ filename: 'logs/rejections.log' })],
});

if (!IS_PROD_MODE) {
    logger.add(
        new winston.transports.Console({
            format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), prettyConsoleFormat),
        }),
    );
} else {
    logger.add(
        new winston.transports.Console({
            format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), json()),
        }),
    );
}

function formatError(error: unknown): string {
    return getErrorMessage(error) || 'Unknown error';
}

export const log = {
    error: (message: string, ...meta: unknown[]) => logger.error(message, ...meta),
    warn: (message: string, ...meta: unknown[]) => logger.warn(message, ...meta),
    info: (message: string, ...meta: unknown[]) => logger.info(message, ...meta),
    http: (message: string, ...meta: unknown[]) => logger.http(message, ...meta),
    verbose: (message: string, ...meta: unknown[]) => logger.verbose(message, ...meta),
    debug: (message: string, ...meta: unknown[]) => logger.debug(message, ...meta),
    silly: (message: string, ...meta: unknown[]) => logger.silly(message, ...meta),
    formatError,
};
