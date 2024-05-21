export type InsertFormatOut = {
    insert: string;
    values: string;
    data: any[];
};

export type ParamsType = {
    updateString?: string;
    data?: any[];
    where?: string;
    select?: string;
    join?: string;
};
export type Like<T> = {
    [K in keyof T]?: string[];
};
export type DatabaseCoreQuery<T = any> = {
    join?: { reference: string; target: string; join: ApiTable; type: 'INNER' | 'LEFT' | '' }[];
    select?: (keyof T)[];
    like?: string[];
    update?: any;
    where?: {
        like?: Like<T>;
        equals?: Partial<T>;
    };
    order?: keyof T;
    asc?: boolean;
    offset?: number;
    limit?: number;
};

export enum ApiTable {
    ACTORS = 'actors',
    CATEGORIES = 'categories',
    COLLECTIONS = 'collections',
    DIRECTORS = 'directors',
    MOVIES = 'movies',
    MOVIES_ACTORS = 'moviesactors',
    MOVIES_CATEGORIES = 'moviescategories',
    MOVIES_DIRECTORS = 'moviesdirectors',
    USERS = 'users',
}
