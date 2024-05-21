import { BaseModel } from '~/core/typeCore';

export type ActorPayload = {
    name: string;
    picture: string;
};

export type Actor = ActorPayload & BaseModel;
