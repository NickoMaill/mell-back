import { ApiTable, DatabaseCoreQuery } from '~/core/coreApiTypes';
import { DatabaseCore } from '~/core/dataBaseCore';
import { ModuleBase } from '~/core/moduleBase';
import { OutputQueryRequest } from '~/core/typeCore';
import { MoviePayload, Movie } from '~/models/movies';

class MoviesModule extends DatabaseCore implements ModuleBase<Movie, MoviePayload> {
    constructor() {
        super(ApiTable.MOVIES);
    }

    // public --> start region /////////////////////////////////////////////
    protected override async validate<T>(payload: T): Promise<void> {
        
    }
    public async add(dataToInsert: MoviePayload): Promise<boolean> {
        await this.insert(dataToInsert);
        return true;
    }

    public async update(payload: MoviePayload, id: number): Promise<boolean> {
        const queryClause: DatabaseCoreQuery<Movie> = { update: payload, where: { equals: { id: id } } };
        await this.updateRecord(queryClause);
        return true;
    }

    public async getOne(id: number): Promise<OutputQueryRequest<Movie>> {
        const result = this.getById<Movie>(id);
        return result;
    }

    public async getAny(where: DatabaseCoreQuery<Movie>): Promise<OutputQueryRequest<Movie>> {
        const results = this.getByQuery(where);
        return results;
    }

    public async getAllTable(): Promise<OutputQueryRequest<Movie>> {
        const results = this.getAll<Movie>();
        return results;
    }
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}
export default new MoviesModule();
