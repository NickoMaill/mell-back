import { ApiTable, DatabaseCoreQuery } from '~/core/coreApiTypes';
import { DatabaseCore } from '~/core/dataBaseCore';
import { ModuleBase } from '~/core/moduleBase';
import { OutputQueryRequest } from '~/core/typeCore';
import { ShowPayloadType } from '~/models/shows';
import { Show } from '~/models/shows';

class ShowsModule extends DatabaseCore implements ModuleBase<Show, ShowPayloadType> {
    constructor(obj: Show) {
        super(ApiTable.SHOWS, Object.keys(obj));
    }

    // public --> start region /////////////////////////////////////////////
    // protected override async validate<T>(payload: T): Promise<void> {
        
    // }
    public async add(dataToInsert: ShowPayloadType): Promise<boolean> {
        await this.insert(dataToInsert);
        return true;
    }

    public async update(payload: ShowPayloadType, id: number): Promise<boolean> {
        const queryClause: DatabaseCoreQuery<Show> = { update: payload, where: { equals: { id: id } } };
        await this.updateRecord(queryClause);
        return true;
    }

    public async getOne(id: number): Promise<OutputQueryRequest<Show>> {
        const result = this.getById<Show>(id);
        return result;
    }

    public async getAny(where: DatabaseCoreQuery<Show>): Promise<OutputQueryRequest<Show>> {
        const results = this.getByQuery(where);
        return results;
    }

    public async getAllTable(): Promise<OutputQueryRequest<Show>> {
        const results = this.getAll<Show>();
        return results;
    }
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}
export default new ShowsModule(new Show());
