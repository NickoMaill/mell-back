import { Request } from 'express';
import { Session, SessionData } from 'express-session';
import { UserAccessLevel } from './typeCore';
import { AppRequest } from './controllerBase';

class Ses {
    private static instance: Ses;
    private session: Session & Partial<SessionData> | null = null;
    //#region UID
    public get UID(): number { return this.isSessionAvailable ? this.session.ses.UID : null; }
    public set UID(value: number) { if (this.isSessionAvailable) this.session.ses.UID = value; }
    //#endregion

    //#region UserEmail
    public get UserEmail(): string { return this.isSessionAvailable ? this.session.ses.userEmail : null; }
    public set UserEmail(value: string) { if (this.isSessionAvailable) this.session.ses.userEmail = value; }
    //#endregion

    //#region NeedMfa
    public get NeedMfa() { return this.isSessionAvailable ? this.session.ses.needMfa : true; }
    public set NeedMfa(value: boolean) { if (this.isSessionAvailable) this.session.ses.needMfa = value; }
    //#endregion

    //#region UserName
    public get UserName() { return this.isSessionAvailable ? this.session.ses.userName : null; }
    public set UserName(value: string) { if (this.isSessionAvailable) this.session.ses.userName = value; }
    //#endregion

    //#region IP
    public get IpAddress() { return this.isSessionAvailable ? this.session.ipAddress : null; }
    public set IpAddress(value: string) { if (this.isSessionAvailable) this.session.ipAddress = value; }
    //#endregion

    //#region Device Id
    public get DeviceId() { return this.isSessionAvailable ? this.session.ses.deviceId : null; }
    public set DeviceId(value: string) { if (this.isSessionAvailable) this.session.ses.deviceId = value; }
    //#endregion

    constructor() {}

    public static getInstance(): Ses {
        if (!Ses.instance) Ses.instance = new Ses();
        return Ses.instance;
    }

    public setSession(req: AppRequest) { 
        this.initValues(req);
        this.session = req.session; 
    }
    public setUserInfo(id: number, email: string, needMfa: boolean, deviceId: string) {
        this.UID = id;
        this.UserEmail = email;
        this.NeedMfa = needMfa;
        this.DeviceId = deviceId;
    }
    public exists(key: string) { return !!this.session[key]; }
    public set<T>(key: string, value: T) { this.session[key] = value; }
    public get<T>(key: string): T { return this.session[key]; }
    private get isSessionAvailable() { return !!this.session; } 
    private initValues(req: Request) {
        if (!req.session.ses) {
            req.session.ses = {
                UID: null,
                userAccess: UserAccessLevel.VISITOR,
                userEmail: null,
                userMobile: null,
                userName: null,
                needMfa: true,
                deviceId: null,
            }
            req.session.ipAddress = req.ip;
        }
    }
}

export default Ses;