import { BaseModel } from "~/core/typeCore";
export class Log extends BaseModel {
    public action: string;
    public description: string;
    public target: string;
    public call: string;
    public userId: number;
    public ipAddress: string;
}

export type LogPayload = {
    action: string;
    description: string;
    target: string;
    call: string;
    userId: number;
    ipAddress: string;
}