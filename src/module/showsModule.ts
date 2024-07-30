import { ApiTable, DatabaseCoreQuery, QuerySearch } from '~/core/coreApiTypes';
import { UserAccessLevel } from '~/core/typeCore';
import { Show, ShowPayloadType } from '~/models/shows';
import Table from './table';

class ShowsModule extends Table<Show, ShowPayloadType> {
    protected override Table = ApiTable.SHOWS;
    protected override Level = UserAccessLevel.VISITOR;
    protected override LevelNew = UserAccessLevel.ADMIN;
    protected override LevelUpdate = UserAccessLevel.ADMIN;
    protected override LevelDelete = UserAccessLevel.ADMIN;
    protected override LevelExport = UserAccessLevel.ADMIN;
    protected override SearchContent: QuerySearch<Show>[] = [
        { field: "title", dbField: "title", typeWhere: "LIKE", typeClause: "EQUALS"},
        { field: "startat", dbField: "startDate", typeWhere: "EQUALS", typeClause: "EQUALS"},
    ];
    protected override DefaultSort: keyof Show = "id";
    protected override SqlFields: string[] = Object.keys(new Show());

    protected override async performUpdate(): Promise<void> {
        const payload = this.Request.body as ShowPayloadType;
        
        if (!isNaN(payload.lat)) payload.lat = parseFloat(payload.lat.toString());
        if (!isNaN(payload.long)) payload.long = parseFloat(payload.long.toString());

        const query: DatabaseCoreQuery<Show> = {
            update: payload,
            where: { equals : { id: this.Request.params.id } }
        }
        console.log(payload);
        await this.db.updateRecord(query);
    }
    protected override async performNew(): Promise<void> {}
    protected override async performDelete(): Promise<void> {}
    // public --> start region /////////////////////////////////////////////
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}
export default ShowsModule;