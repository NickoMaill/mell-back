export class Media {
    public id: number;
    public externalId: string;
    public url: string;
    public type: string;
    public size: number;
    public isVideo: boolean;
    public width: number;
    public height: number;
    public sortOrder: number;
    public addedAt: Date;
    public updatedAt: Date;
}

export interface MediaPayloadType {
    name: string;
    type: string;
    sortOrder: number;
    isVideo: boolean;
    status: MediaStatus;
};

export enum MediaType {
    JPEG = 'jpeg',
    PNG = 'png',
    WEBP = 'webp',
}

export enum MediaStatus {
    BACKGROUND = 1,
    REGULAR_PIC = 2,
    SHOWS = 3,
}
