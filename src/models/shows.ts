import { BaseModel } from "~/core/typeCore";

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
}

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
}

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
}