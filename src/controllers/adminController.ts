import { Router } from 'express';
import { AppRequest, AppResponse } from '~/core/controllerBase';
import logManager from '~/managers/logManager';
import path from 'path';
import adminManager from '~/managers/adminManager';
import { StandardError } from '~/core/standardError';
import { UserPayloadLogin } from '~/models/users';
import { bodyParser } from '~/middlewares/bodyParser';
import moment from 'moment';
import Ses from '~/core/ses';
import tools from '~/helpers/tools';
class AdminController {
    private readonly Route = Router();
    constructor() {
        this.Route.get('/', this.loginPage);
        this.Route.post('/', bodyParser, this.login);
        this.Route.get('/mfa', this.mfaPage);
        this.Route.post('/mfa', this.checkOtp);
        this.Route.get('/resendOtp', this.resendOtp);
        this.Route.get('/refresh', this.refresh);
    }
    private mfaPage(_req: AppRequest, res: AppResponse) {
        res.sendFile(path.join(__dirname, '../views/mfa.html'));
    }
    private loginPage(_req: AppRequest, res: AppResponse) {
        logManager.setLog("Login", `La page de login a été demandée`);
        res.sendFile(path.join(__dirname, '../views/login.html'));
    }
    private async login(req: AppRequest<UserPayloadLogin>, res: AppResponse) {
        if (req.body.username === "" && req.body.password === "") {
            res.status(200).redirect("/login");
        }
        try {
            const token = await adminManager.checkLogin(req);
            const expires = req.body.remember ? moment().add(1, "years").toDate() : moment().add(1, "days").toDate();
            const ses = Ses.getInstance();
            res.cookie('refresh', token, tools.getCookieOptions(expires));
            if (ses.NeedMfa) {
                res.redirect("/login/mfa");
            }
        } catch (err) {
            let out = `<p>une erreur est survenue, désolé... <br> details de l'erreur : ${JSON.stringify(err)}</p>`;
            if (err instanceof StandardError) {
                if (err.errorCode === 'invalid_credentials') {
                    out = adminManager.setInvalidLoginForm('Email ou mot de passe invalide', req.body.username);
                }
            }
            console.log(err);
            res.status(401).send(out);
        }
    }

    public async checkOtp(req: AppRequest<{otp: string}>, res: AppResponse) {
        try {
            await adminManager.checkOtp(req.body.otp, req.cookies["refresh"]);
            res.status(302).send('<script nonce="YLNVC6eGpoz9BIwWyWTm50GXqOLqgilQ">window.location.href="http://localhost:3000/"</script>');
        } catch (err) {
            let out = '';
            if (err instanceof StandardError) {
                if (err.errorCode === 'invalid_otp') {
                    out = adminManager.setInvalidOtpForm("code invalide, réessayez");
                } else if (err.errorCode === "otp_expired") {
                    out = adminManager.setInvalidOtpForm("code expiré, renvoyer en un autre");
                }
            }
            console.log(err);
            res.status(401).send(out);
        }
    }

    public async resendOtp(req: AppRequest<{otp: string}>, res: AppResponse) {
        await adminManager.sendOtp(req);
        res.json({ success: true })
    }

    public async refresh(req: AppRequest, res: AppResponse) {
        const access = await adminManager.getAccess();
        res.json({ token: access, expires: moment().add(30, "minutes").toDate().getTime() });
    }

    public get Router() {
        return this.Route;
    }
}
export default new AdminController();
