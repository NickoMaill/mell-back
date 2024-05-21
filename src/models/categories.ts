import { BaseModel } from '~/core/typeCore';

export type CategoryPayload = {
    name: string;
};

export type Category = CategoryPayload &
    BaseModel & {
        movieId: number;
    };
