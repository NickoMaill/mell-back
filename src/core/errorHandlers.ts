// =================================================================================== //
// this is a prebuild StandardError object.                                            //
// Invoke this tool when you want to catch a server error.                             //
// =================================================================================== //

import { NextFunction } from 'express';
import { AppRequest, AppResponse } from './controllerBase';
import { HttpError } from 'http-errors';
import { StandardError } from './standardError';
import configManager from '../managers/configManager';
import logManager from '../managers/logManager';
import { DataBaseAppError } from './dataBaseCore';
import { DatabaseError } from 'pg';

class ErrorHandlers {
    public async commonErrorHandler(err: any, req: AppRequest, res: AppResponse, next: NextFunction) {
        if (err instanceof StandardError) {
            const error = err as StandardError<any>;

            logManager.error(error.key, `-> [${error.errorCode}] : ${error.message} -> ${error.detailedMessage}`);
            logManager.error(error.key, `-> [${error.errorCode}] : ${error.stack}`);

            if (!res.headersSent) {
                let statusCode: number;

                if (error.status === 'BAD_REQUEST') statusCode = 400;
                else if (error.status === 'UNAUTHORIZED') statusCode = 401;
                else if (error.status === 'FORBIDDEN') statusCode = 403;
                else if (error.status === 'NOT_FOUND') statusCode = 404;
                else if (error.status === 'UNAVAILABLE') statusCode = 503;
                else statusCode = 500;
            }
        } else if (err instanceof HttpError) {
            const error = err as Error;

            logManager.error('AppErrorHandler', `${(err as Error).message} -> ${(err as Error).stack}`);
            res.status(err.status).json({
                errorCode: 'http_error',
                message: configManager.getConfig.SHOW_ERROR_DETAILS ? error.message : `Internal Server Error!`,
            });
        } else {
            const error = err as Error;

            logManager.error('AppErrorHandler', `${error.message} -> ${error.stack}`);
            res.status(500).json({
                errorCode: 'internal_error',
                message: configManager.getConfig.SHOW_ERROR_DETAILS ? error.message : `Internal Server Error!`,
            });
        }
    }
    public errorSql(stack: string, err: DataBaseAppError, log: boolean = false) {
        if (err instanceof DatabaseError) {
            switch (err.code) {
                case '23000':
                    throw new StandardError(stack, 'BAD_REQUEST', 'integrity_constraint_violation', 'integrity constraint violation', err.message ? err.message : 'integrity constraint violation', log, err);
                case '23001':
                    throw new StandardError(stack, 'BAD_REQUEST', 'restrict_violation', 'restrict violation', err.message ? err.message : 'restrict violation', log, err);
                case '23502':
                    throw new StandardError(stack, 'BAD_REQUEST', 'not_null_violation', 'not null violation', err.message ? err.message : 'not null violation', log, err);
                case '23503':
                    throw new StandardError(stack, 'BAD_REQUEST', 'foreign_key_violation', 'foreign key violation', err.message ? err.message : 'foreign key violation', log, err);
                case '23505':
                    throw new StandardError(stack, 'BAD_REQUEST', 'uniq_violation', 'uniq error violation', err.message ? err.message : 'uniq error violation', log, err);
                case '23514':
                    throw new StandardError(stack, 'BAD_REQUEST', 'check_violation', 'check error violation', err.message ? err.message : 'check error violation', log, err);
                case '42703':
                    throw new StandardError(stack, 'BAD_REQUEST', 'invalid_column_reference', 'invalid column reference', err.message ? err.message : 'invalid column reference', log, err);
                case '42P01':
                    throw new StandardError(stack, 'FATAL', 'undefined_table', 'no relation found', err.message ? err.message : 'undefined table', log, err);
                case '42P10':
                    throw new StandardError(stack, 'FATAL', 'undefined_column', 'undefined column', err.message ? err.message : 'undefined column', log, err);
                default:
                    throw new StandardError(stack, 'FATAL', `sql_code -> ${err.code}`, 'check error violation', err.message ? err.message : 'check error violation', log, err);
            }
        } else {
            throw new StandardError(stack, 'FATAL', 'error_happened', 'an error happened during request', 'an error happened during request', log, err);
        }
    }
}

export default new ErrorHandlers();
