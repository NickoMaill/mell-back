import { MediaStatus } from "~/models/media";

export type CloudinaryResponseApi = {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    size: number;
    time: string;
    expiration: string;
    image: {
        filename: string;
        name: string;
        mime: string;
        extension: string;
        url: string;
    };
    thumb: {
        filename: string;
        name: string;
        mime: string;
        extension: string;
        url: string;
    };
    medium: {
        filename: string;
        name: string;
        mime: string;
        extension: string;
        url: string;
    };
    delete_url: string;
};

export type CloudinaryUploadRequest = {
    apiKey?: string;
    name?: string;
    imagePath: string;
    isVideo: boolean;
};

export interface IMediaDto {
    url?: string;
    name?: string;
    type?: string;
    size?: number;
    width?: number;
    height?: number;
    isVideo?: boolean;
    status?: MediaStatus;
    providerId?: string;
}

export enum AssetsInstanceEnum {
    UPLOAD = 0,
    API = 1,
}