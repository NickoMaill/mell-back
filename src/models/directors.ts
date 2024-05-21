import { BaseModel } from '~/core/typeCore';

export type DirectorPayload = {
    name: string;
    picture: string;
};
export type Director = DirectorPayload & BaseModel;
