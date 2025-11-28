import winston from 'winston';

import { LOG_DIR, LOG_LEVEL, NODE_ENV } from '../config/logger';

const { combine, timestamp, errors, json, printf, colorize } = winston.format;

const consoleFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
});

const logLevel = LOG_LEVEL || (NODE_ENV === 'production' ? 'info' : 'debug');

export const logger = winston.createLogger({
    level: logLevel,
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

if (NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), consoleFormat),
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
    return error instanceof Error ? error.message : 'Unknown error';
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
