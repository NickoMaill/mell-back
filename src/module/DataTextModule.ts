import { DataText } from '~/models/dataText';
import Table from './table';
import { ApiTable, QuerySearch } from '~/core/coreApiTypes';
import { UserAccessLevel } from '~/core/typeCore';

export class DataTextModule extends Table<DataText, null> {
    protected override Table = ApiTable.DATATEXT;
    protected override Level = UserAccessLevel.VISITOR;
    protected override LevelNew = UserAccessLevel.ADMIN;
    protected override LevelUpdate = UserAccessLevel.ADMIN;
    protected override LevelDelete = UserAccessLevel.ADMIN;
    protected override LevelExport = UserAccessLevel.ADMIN;
    protected override DefaultSort: keyof DataText = 'id';
    protected override SqlFields: string[] = Object.keys(new DataText());
    protected override SearchContent: QuerySearch<DataText>[] = [
        { field: 'code', dbField: 'code', typeClause: 'EQUALS', typeWhere: 'EQUALS' },
        { field: 'description', dbField: 'description', typeClause: 'EQUALS', typeWhere: 'LIKE' },
    ];

    // public --> start region /////////////////////////////////////////////
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}
