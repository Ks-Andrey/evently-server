import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodObject } from 'zod';

import { InvalidInputException, UnknownException } from '@application/common';
import { getErrorMessage } from '@common/utils/error';

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
                    const parsedBody = shape.body.parse(req.body);
                    Object.assign(req.body, parsedBody);
                }
                if (shape.params) {
                    const parsedParams = shape.params.parse(req.params);
                    Object.assign(req.params, parsedParams);
                }
                if (shape.query) {
                    const parsedQuery = shape.query.parse(req.query);
                    Object.assign(req.query, parsedQuery);
                }
            } else {
                const parsedBody = schema.parse(req.body);
                Object.assign(req.body, parsedBody);
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const validationErrors = error.issues.map((issue) => ({
                    message: issue.message,
                    path: issue.path.join('.'),
                }));

                const exception = new InvalidInputException(validationErrors[0].message, { validationErrors });
                const errorResponse = createErrorResponse(exception);
                res.status(errorResponse.status).json(errorResponse);
            } else {
                const exception = new UnknownException(getErrorMessage(error));
                const errorResponse = createErrorResponse(exception);
                res.status(errorResponse.status).json(errorResponse);
            }
        }
    };
}
