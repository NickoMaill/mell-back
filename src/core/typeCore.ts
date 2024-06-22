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

export function AccessLevel(level: UserAccessLevel): MethodDecorator {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        if (!target.__accessLevels) {
            target.__accessLevels = {};
        }
        target.__accessLevels[propertyKey] = level;
    }
}