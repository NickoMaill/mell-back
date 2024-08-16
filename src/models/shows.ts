import { BaseModel } from '~/core/typeCore';
import { Media } from './media';

export class Show extends BaseModel {
    title: string;
    place: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    lat: number;
    long: number;
    startDate: Date;
    endDate: Date;
    schedule: Date;
    description: string;
    subDescription: string;
    showOnLanding: boolean;
    areaLink: string;
    ticketLink: string;
}

export type FullShow = Show & {
    media: Media[];
    cover: Media;
    comments: Comment[];
};

export type ShowPayloadType = {
    title: string;
    place: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    lat: number;
    long: number;
    startDate: Date;
    endDate: Date;
    schedule: Date;
    showUrl: string;
};

export class Comment extends BaseModel {
    showId: number;
    name: string;
    title: string;
    rating: number;
    description: string;
}

export type CommentPayload = {
    showId: number;
    name: string;
    title: string;
    rating: number;
    description: string;
    date: Date;
    rawDate: string;
};
