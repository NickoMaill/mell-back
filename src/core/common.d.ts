import session from "express-session";
import { UserAccessLevel } from "./typeCore";

declare module "express-session" {
    interface SessionData {
        ipAddress: string;
        ses: {
            userEmail: string,
            UID: number,
            needMfa: boolean;
            userName: string;
            userAccess: UserAccessLevel;
            userMobile: string;
            deviceId: string;
        }
        [key: string]: any;
    }
}