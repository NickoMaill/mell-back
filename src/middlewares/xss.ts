import { NextFunction, Request, Response } from 'express';
import xss from 'xss';

export const sanitizeXss = (req: Request, _res: Response, next: NextFunction) => {
    if (req.body && typeof req.body === 'object') {
        sanitizeObject(req.body);
    } else if (typeof req.body === 'string') {
        req.body = xss(req.body);
    }
    next();
};

const sanitizeObject = (object: any) => {
    for (let key in object) {
        if (typeof object[key] === 'string') {
            object[key] = xss(object[key]);
        }

        if (typeof object[key] === 'object') {
            sanitizeObject(object[key]);
        }
    }
};
