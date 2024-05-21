import { DatabaseCoreQuery } from './coreApiTypes';
import { OutputQueryRequest } from './typeCore';

export interface ModuleBase<T, P> {
    add: (payload: P) => Promise<boolean>;
    update: (payload: P, id: number) => Promise<boolean>;
    delete?: (id: number) => Promise<boolean>;
    getOne: (id: number) => Promise<OutputQueryRequest<T>>;
    getAny: (query: DatabaseCoreQuery<T>) => Promise<OutputQueryRequest<T>>;
    getAllTable: () => Promise<OutputQueryRequest<T>>;
}
