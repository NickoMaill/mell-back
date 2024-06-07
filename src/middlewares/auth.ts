import { NextFunction } from 'express';
import { AppRequest, AppResponse } from '~/core/controllerBase';
import { StandardError } from '~/core/standardError';
import AdminManager from '~/managers/adminManager';
import configManager from '~/managers/configManager';

export const checkAuth = async (req: AppRequest, res: AppResponse, next: NextFunction) => {
    const urlData = new URL(req.originalUrl, `${configManager.getConfig.HTTPS ? "https" : "http"}://${req.headers.host}`);
    const noCheckPath = ["/login/reset"];
    const isLoginPage = urlData.pathname === "/login";
    const isMfaPage = urlData.pathname === "/login/mfa";

    if (!noCheckPath.includes(req.originalUrl)) {
        try {
            await AdminManager.checkRefresh(req.cookies["refresh"]);
            if (isLoginPage || isMfaPage) {
                res.status(302).send('<script nonce="YLNVC6eGpoz9BIwWyWTm50GXqOLqgilQ">window.location.href="http://localhost:3000/"</script>');
                return;
            }
            next();
        } catch (err) {
            let target = "";

            if (err instanceof StandardError && err.errorCode === "need_otp") {
                if (!isMfaPage) {
                    AdminManager.sendOtp(req);
                    res.redirect("/login/mfa" + target);
                    return;
                }
            } else {
                if (!isLoginPage && !isMfaPage) {
                    res.redirect("/login" + target);
                    return;
                }
            }
            next();
        }
    } else {
        next();
    }
};
