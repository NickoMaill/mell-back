import { NextFunction } from 'express';
import { AppRequest, AppResponse } from '~/core/controllerBase';
import Ses from '~/core/ses';
import AdminManager from '~/managers/adminManager';

export const initSes = (req: AppRequest, _res: AppResponse, next: NextFunction) => {
    const ses = Ses.getInstance();
    ses.setSession(req);
    next();
};
