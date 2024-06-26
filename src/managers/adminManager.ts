import path from 'path';
import fs from 'fs';
import { TokenPayload, UserPayloadLogin } from '~/models/users';
import userModule from '~/module/userModule';
import { StandardError } from '~/core/standardError';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import configManager from './configManager';
import { AppRequest } from '~/core/controllerBase';
import Ses from '~/core/ses';
import tools from '~/helpers/tools';
import communicationManager from './communicationManager';
import moment from 'moment';

class AdminManager {
    constructor() {}

    // public --> start region /////////////////////////////////////////////
    public static setInvalidLoginForm(message: string, email: string) {
        let htmlContent = fs.readFileSync(path.join(__dirname, '../views/login.html'), { encoding: 'utf-8' });
        htmlContent = htmlContent.replaceAll('{0}', 'is-invalid').replace('&nbsp;', message).replace('data-value', `value="${email}"`);
        return htmlContent;
    }

    public static setInvalidOtpForm(message: string) {
        let htmlContent = fs.readFileSync(path.join(__dirname, '../views/mfa.html'), { encoding: 'utf-8' });
        htmlContent = htmlContent.replaceAll("{0-1}", "is-invalid");
        htmlContent = htmlContent.replace("&nbsp;", message);
        return htmlContent;
    }

    public static async checkLogin(req: AppRequest<UserPayloadLogin>): Promise<string> {
        if (req.body.username === "" || !req.body.username) throw new StandardError('AdminManager.checkLogin', 'BAD_REQUEST', 'email_required', 'email is required', 'email is required to login');
        if (req.body.password === "" || !req.body.password) throw new StandardError('AdminManager.checkLogin', 'BAD_REQUEST', 'password_required', 'password is required', 'password is required to login');
        // get user admin info
        const founded = await userModule.getOneByEmail(req.body.username);
        // if not founded refuse access
        if (!founded) throw new StandardError('AdminManager.checkLogin', 'BAD_REQUEST', 'invalid_credentials', 'email or password invalid', 'email or password invalid');
        // check password hash
        const isPasswordValid = await bcrypt.compare(req.body.password, founded.password);
        // if not same, then refuse access
        if (!isPasswordValid) throw new StandardError('AdminManager.checkLogin', 'BAD_REQUEST', 'invalid_credentials', 'email or password invalid', 'email or password invalid');

        // if login granted, sign a jwt with => user id, isAuthorizedDevice key and needMfa (two if multifactor auth must be throwed)
        const deviceId = tools.getDeviceId();

        const isDeviceAuthorized = await userModule.isDeviceAuthorized(deviceId, founded.id);
        const token = jwt.sign({ id: founded.id, isDeviceAuthorized: isDeviceAuthorized, deviceId: deviceId }, configManager.getConfig.SECRET_REFRESH, { expiresIn: req.body.remember ? "1y" : "1d" });
        
        // get Session values instances
        const ses = Ses.getInstance();
        // update ses values
        ses.UserEmail = founded.email;
        ses.UserName = founded.firstName + ' ' + founded.lastName.toUpperCase();
        ses.NeedMfa = true;
        ses.DeviceId = deviceId;
        ses.UID = founded.id;
        
        // init token payload
        // const tokenPayload: TokenPayload = {
        //     userId: ses.UID,
        //     userAgent: req.headers['user-agent'],
        //     deviceId: ses.DeviceId,
        //     userIp: req.socket.remoteAddress,
        //     token: token,
        //     isDeviceAuthorized: isDeviceAuthorized,
        //     type: "refresh",
        //     expires: req.body.remember ? moment().add(1, "years").toDate() : moment().add(1, "day").toDate()
        // };

        // save refresh token in db
        // await userModule.InsertToken(tokenPayload);
        // await this.sendOtp(req);
        return token;
    }

    public static async sendOtp(req: AppRequest) {
        const ses = Ses.getInstance();
        const otp = tools.generateOtp();
        // save hashed otp in db for compare
        const hashedOtp = await bcrypt.hash(otp, 5);

        const tokenPayload: TokenPayload = {
            userId: ses.UID,
            userAgent: req.headers['user-agent'],
            deviceId: ses.DeviceId,
            userIp: req.socket.remoteAddress,
            token: hashedOtp,
            type: "otp",
            expires: moment().add(10, "minutes").toDate(),
        };
        userModule.InsertToken(tokenPayload);
        
        // return token and deviceId, to put it in some cookies
        await communicationManager.sendMfa(ses.UserEmail, otp);
    }

    public static async checkOtp(otp: string, token: string): Promise<boolean> {
        const otpData = await userModule.getLastOtp();
        const tokenData = await userModule.getToken(token);
        if (!otpData) throw new StandardError("adminManager.checkOtp", "BAD_REQUEST", "invalid_otp", "otp est invalide");
        const compare = await bcrypt.compare(otp, otpData.token);
        if (!compare) throw new StandardError("adminManager.checkOtp", "BAD_REQUEST", "invalid_otp", "otp invalide");
        if (otpData.expires < new Date()) throw new StandardError("adminManager.checkOtp", "BAD_REQUEST", "otp_expired", "otp expiré");
        await userModule.refreshOtp(tokenData.id);
        return true;
    }

    public static async checkRefresh(token: string) {
        if (token === "" || !token) throw new StandardError('adminManager.checkRefresh', 'BAD_REQUEST', 'no_session', `token not active`, 'token provided is not active');
        let decoded: { id: number; isDeviceAuthorized: boolean; deviceId: string } = null;
        jwt.verify(token, configManager.getConfig.SECRET_REFRESH, (err: jwt.JsonWebTokenError, dec: typeof decoded) => {
            if (err) {
                switch (err.name.toLowerCase()) {
                    case 'tokenexpirederror':
                        throw new StandardError('adminManager.checkRefresh', 'BAD_REQUEST', 'session_expired', `token expired`, 'token provided is invalid');
                    case 'notbeforeerror':
                        throw new StandardError('adminManager.checkRefresh', 'BAD_REQUEST', 'session_not_active', `token not active`, 'token provided is not active');
                    default:
                        throw new StandardError('adminManager.checkRefresh', 'FATAL', 'error_happened', `token => ${token} invalid`, 'token invalid, message => ' + err.message);
                }
            }
            if (dec) {
                decoded = dec;
            }
        });
        if (!decoded) {
            throw new StandardError("adminManager.checkRefresh", "BAD_REQUEST", "no_content", "no content", "no token data");
        }
        if (decoded.id) {
            const founded = await userModule.getOneById(decoded.id);
            // const foundedToken = await userModule.getToken(token);
            if (!founded) {
                throw new StandardError("adminManager.checkRefresh", "UNAUTHORIZED", "no_session", "no session found", "no session fond with id : " + decoded.id);
            }
            const ses = Ses.getInstance();
            // const needMfa = moment(foundedToken.lastOtp).add(1, "day").toDate() < new Date();
            ses.setUserInfo(founded.id, founded.email, false, decoded.deviceId, founded.levelAccess, "");
            // if (ses.NeedMfa) {
            //     throw new StandardError("adminManager.checkRefresh", "UNAUTHORIZED", "need_mfa", "user need 2 MFA", "User need 2MFA to access protected resources");
            // }
        }
    }

    public static async getAccess(): Promise<string> {
        const ses = Ses.getInstance();
        const access = jwt.sign({ id: ses.UID }, configManager.getConfig.SECRET_REFRESH, { expiresIn:  "30m" });
        return access;
    }

    public static async clearSession(): Promise<boolean> {
        const ses = Ses.getInstance();
        ses.clear();
        return true;
    }
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}
export default AdminManager;
