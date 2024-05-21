import { BaseModel } from '~/core/typeCore';

export type CollectionPayload = {
    title: string;
    picture: string;
};

export type Collection = CollectionPayload & BaseModel;
