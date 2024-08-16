import { ApiTable, DatabaseCoreQuery, QuerySearch } from '~/core/coreApiTypes';
import { DatabaseCore } from '~/core/dataBaseCore';
import { ModuleBase } from '~/core/moduleBase';
import { OutputQueryRequest, UserAccessLevel } from '~/core/typeCore';
import { Log, LogPayload } from '~/models/logs';
import Table from './table';

class LogsModule extends Table<Log, null> {
    protected override Table = ApiTable.LOGS;
    protected override Level = UserAccessLevel.ADMIN;
    protected override SearchContent: QuerySearch<Log>[] = [
        { field: 'addedAt', dbField: 'addedAt', typeWhere: 'EQUALS', typeClause: 'EQUALS' },
        { field: 'description', dbField: 'description', typeWhere: 'LIKE', typeClause: 'EQUALS' },
        { field: 'action', dbField: 'action', typeWhere: 'LIKE', typeClause: 'EQUALS' },
    ];
    protected override DefaultSort: keyof Log = 'addedAt';
    protected override DefaultAsc: boolean = false;
    protected override SqlFields: string[] = Object.keys(new Log());
}

export default LogsModule;
