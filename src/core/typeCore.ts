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

export type BaseModel = {
    id: number;
    addedAt: Date;
    updatedAt: Date;
};
