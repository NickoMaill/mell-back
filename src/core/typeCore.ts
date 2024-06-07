export type OutputQueryRequest<T> = {
    records: T[];
    totalRecords: number;
    limit?: number;
    offset?: number;
};

export type DeviceDataType = {
    model: string;
    version: string;
    ip: string;
    clientSourceType: string;
    clientSourceName: string;
};

export class BaseModel {
    public id: number;
    public addedAt: Date;
    public updatedAt: Date;
};

export enum UserAccessLevel {
    ADMIN = 0,
    USER = 1,
    VISITOR = 2,
}