import { Router } from 'express';
import { AppRequest, AppResponse } from '~/core/controllerBase';
import adminManager from '~/managers/adminManager';
import { StandardError } from '~/core/standardError';
import { UserApiModel, UserPayloadLogin } from '~/models/users';
import moment from 'moment';
import Ses from '~/core/ses';
import tools from '~/helpers/tools';
import { checkAuth } from '~/middlewares/auth';
class AdminController {
    private readonly Route = Router();
    constructor() {
        this.Route.post('/', this.login);
        this.Route.get('/refresh', checkAuth, this.refresh);
        this.Route.post('/logout', checkAuth, this.logout);
        this.Route.post('/test-form', this.test);
        // this.Route.post('/mfa', upload.none(), this.checkOtp);
        // this.Route.get('/resendOtp', this.resendOtp);
    }
    private async login(req: AppRequest<UserPayloadLogin>, res: AppResponse) {
        const token = await adminManager.checkLogin(req);
        const expires = req.body.remember ? moment().add(1, 'years').toDate() : moment().add(1, 'days').toDate();
        const ses = Ses.getInstance();
        const userInfo: UserApiModel = {
            id: ses.UID,
            name: ses.UserName,
            email: ses.UserEmail,
            userLevel: ses.AccessLevel,
            mobile: ses.UserMobile,
            token: null,
        };
        res.cookie('refresh', token, tools.getCookieOptions(expires));
        res.json(userInfo);
    }

    public async refresh(_req: AppRequest, res: AppResponse) {
        const access = await adminManager.getAccess();
        res.json({ token: access, expires: moment().add(30, 'minutes').toDate().getTime() });
    }
    public test(req, res) {
        console.log(req.body);
        res.send(`Received form data: ${JSON.stringify(req.body)}`);
    }
    public async logout(_req: AppRequest, res: AppResponse) {
        await adminManager.clearSession();
        res.clearCookie('refresh');
        res.json({ success: true });
    }

    public get Router() {
        return this.Route;
    }
}
export default new AdminController();
