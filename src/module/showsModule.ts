import { ApiTable, QuerySearch } from '~/core/coreApiTypes';
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
        console.log(this.Request.body);
    }
    protected override async performNew(): Promise<void> {}
    protected override async performDelete(): Promise<void> {}
    // public --> start region /////////////////////////////////////////////
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}
export default ShowsModule;