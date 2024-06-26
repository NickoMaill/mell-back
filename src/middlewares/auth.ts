import { NextFunction } from 'express';
import { AppRequest, AppResponse } from '~/core/controllerBase';
import Ses from '~/core/ses';
import { StandardError } from '~/core/standardError';
import { UserAccessLevel } from '~/core/typeCore';
import AdminManager from '~/managers/adminManager';

export const checkAuth = async (req: AppRequest, _res: AppResponse, next: NextFunction, level: UserAccessLevel = UserAccessLevel.ADMIN) => {
    const noCheckPath = ['/login/reset'];
    const ses = Ses.getInstance();

    if (!noCheckPath.includes(req.originalUrl)) {
        if (level !== UserAccessLevel.VISITOR) {
            await AdminManager.checkRefresh(req.cookies['refresh']);
            if (ses.AccessLevel !== level) {
                throw new StandardError('auth.checkAuth', 'UNAUTHORIZED', 'unauthorized', 'unauthorized action requested', 'unauthorized action requested');
            }
        }
        next();
    } else {
        next();
    }
};
