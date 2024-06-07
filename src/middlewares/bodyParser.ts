import { NextFunction } from "express";
import { AppRequest, AppResponse } from "~/core/controllerBase";

export const bodyParser = (req: AppRequest, _res: AppResponse, next: NextFunction) => {
    for (const entry in req.body) {
        if (!isNaN(req.body[entry])) {
            if (req.body[entry].includes('.')) {
                req.body[entry] = parseFloat(req.body[entry]);
            } else {
                req.body[entry] = parseInt(req.body[entry]);
            }
        }
        if (req.body[entry] === ('true' || 'false')) {
            req.body[entry] = Boolean(req.body[entry]);
        }
    }
    next();
}