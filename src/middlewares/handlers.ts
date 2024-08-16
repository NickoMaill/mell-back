import { HttpError } from 'http-errors';
import { NextFunction } from 'express';
import configManager from '../managers/configManager';
import logManager from '../managers/logManager';
import { StandardError } from '../core/standardError';
import { AppRequest, AppResponse } from '../core/controllerBase';
class Handlers {
    public async errorHandler(err: any, _req: AppRequest, res: AppResponse, _next: NextFunction) {
        console.log('error handler', err);
        if (err instanceof StandardError) {
            const error = err as StandardError<any>;

            logManager.setLog(error.key, `-> [${error.errorCode}] : ${error.message} -> ${error.detailedMessage}`);
            logManager.setLog(error.key, `-> [${error.errorCode}] : ${error.stack}`);

            if (!res.headersSent) {
                let statusCode: number;

                if (error.status === 'BAD_REQUEST') statusCode = 400;
                else if (error.status === 'UNAUTHORIZED') statusCode = 401;
                else if (error.status === 'FORBIDDEN') statusCode = 403;
                else if (error.status === 'NOT_FOUND') statusCode = 404;
                else if (error.status === 'UNAVAILABLE') statusCode = 503;
                else statusCode = 500;

                if (!configManager.getConfig.SHOW_ERROR_DETAILS) res.status(statusCode).json({ errorCode: error.errorCode, message: error.message, data: error.data });
                else
                    res.status(statusCode).json({
                        errorCode: error.errorCode,
                        message: error.message,
                        detailedMessage: error.detailedMessage,
                        data: error.data,
                    });
            }
        } else if (err instanceof HttpError) {
            const error = err as Error;

            logManager.setLog('AppErrorHandler', `${(err as Error).message} -> ${(err as Error).stack}`);
            res.status(err.status).json({
                errorCode: 'http_error',
                message: configManager.getConfig.SHOW_ERROR_DETAILS ? error.message : `Internal Server Error!`,
            });
        } else {
            const error = err as Error;
            logManager.setLog('AppErrorHandler', `${error.message} -> ${error.stack}`);
            res.status(500).json({
                errorCode: 'internal_error',
                message: configManager.getConfig.SHOW_ERROR_DETAILS ? error.message : `Internal Server Error!`,
            });
        }
    }

    public noCacheMiddleware(err: any, req: AppRequest, res: AppResponse, next: NextFunction) {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        res.set('Surrogate-Control', 'no-store');
        next();
    }
}

export default new Handlers();
