import { BaseModel } from '~/core/typeCore';
import { Category } from './categories';
import { Collection } from './collection';
import { Actor } from './actors';
import { Director } from './directors';

export type MoviePayload = {
    collectionId: number;
    title: string;
    subtitle: string;
    year: number;
    released: Date;
    plot: string;
    country: string;
    poster: string;
    rating: number;
    filename: string;
    isAnime: boolean;
};

export type Movie = BaseModel &
    MoviePayload & {
        categories: Category[];
        collection: Collection;
        actors: Actor[];
        director: Director[];
    };
