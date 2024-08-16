export type InsertFormatOut = {
    insert: string;
    values: string;
    data: any[];
    uniq?: string;
};

export type ParamsType = {
    updateString?: string;
    data?: any[];
    where?: string;
    select?: string;
    join?: string;
};

export type Like<T = any> = {
    [K in keyof T]?: string[];
};

export type DatabaseCoreQuery<T = any, P = any> = {
    join?: { reference: string; target: string; join: ApiTable; type: 'INNER' | 'LEFT' | ''; joinTarget?: ApiTable }[];
    select?: (keyof T)[];
    like?: string[];
    update?: P;
    where?: {
        like?: Like<T>;
        equals?: Partial<T>;
    };
    order?: keyof T;
    asc?: boolean;
    offset?: number;
    limit?: number;
};

export type QuerySearch<T> = {
    field: string;
    dbField: keyof T;
    typeWhere: 'LIKE' | 'EQUALS';
    typeClause: 'IN' | 'EQUALS';
};

export const initCoreQuery: DatabaseCoreQuery<any> = {
    join: null,
    select: null,
    like: null,
    update: null,
    where: null,
    order: null,
    asc: false,
    offset: null,
    limit: null,
};

export enum ApiTable {
    MEDIAS = 'medias',
    USERS = 'users',
    LOGS = 'logs',
    SHOWS = 'shows',
    FEED = 'feed',
    COMMENT = 'comments',
    ARTICLES = 'articles',
    NEWSPAPER = 'newspaperprovider',
    DATATEXT = 'datatext',
}
