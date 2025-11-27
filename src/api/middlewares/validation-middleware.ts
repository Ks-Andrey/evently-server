import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodObject } from 'zod';

import { InvalidInputException, UnknownException } from '@application/common';

import { createErrorResponse } from '../common';

type ValidationSchema =
    | ZodSchema
    | ZodObject<{
          body?: ZodSchema;
          params?: ZodSchema;
          query?: ZodSchema;
      }>;

export function validate(schema: ValidationSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            if (schema instanceof ZodObject) {
                const shape = schema.shape;
                if (shape.body) {
                    req.body = shape.body.parse(req.body);
                }
                if (shape.params) {
                    req.params = shape.params.parse(req.params);
                }
                if (shape.query) {
                    req.query = shape.query.parse(req.query);
                }
            } else {
                req.body = schema.parse(req.body);
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const validationErrors = error.issues.map((issue) => ({
                    message: issue.message,
                    path: issue.path.join('.'),
                }));

                const exception = new InvalidInputException(undefined, { validationErrors });
                const errorResponse = createErrorResponse(exception);
                res.status(errorResponse.status).json(errorResponse);
            } else {
                const exception = new UnknownException();
                const errorResponse = createErrorResponse(exception);
                res.status(errorResponse.status).json(errorResponse);
            }
        }
    };
}
