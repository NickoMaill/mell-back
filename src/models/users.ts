import { BaseModel, UserAccessLevel } from '~/core/typeCore';

export class User extends BaseModel {
    public email: string;
    public password: string;
    public lastOtp: string;
    public firstName: string;
    public lastName: string;
    public levelAccess: UserAccessLevel;
}

export type UserApiModel = {
    id: number;
    name: string;
    userLevel: UserAccessLevel;
    email: string;
    mobile: string;
    token: string;
};

export type UserPayloadLogin = {
    username: string;
    password: string;
    remember: boolean;
};

export class UserToken extends BaseModel {
    public lastOtp: Date;
    public token: string;
    public expires: Date;
}

export type TokenPayload = {
    token: string;
    userIp: string;
    deviceId: string;
    userAgent: string;
    userId: number;
    isDeviceAuthorized?: boolean;
    type: 'otp' | 'refresh';
    expires: Date;
};
