import { AppRequest } from '~/core/controllerBase';
import { ApiTable, DatabaseCoreQuery, Like, QuerySearch } from '~/core/coreApiTypes';
import { DataBaseAppError, DatabaseCore } from '~/core/dataBaseCore';
import { StandardError } from '~/core/standardError';
import { OutputQueryRequest, UserAccessLevel } from '~/core/typeCore';
import tools from '~/helpers/tools';

class Table<T, P> {
    // ------------- default PARAMS -----------------
    protected Table: ApiTable = ApiTable.LOGS;
    protected Level: UserAccessLevel = UserAccessLevel.ADMIN;
    protected LevelNew: UserAccessLevel = this.Level;
    protected LevelUpdate: UserAccessLevel = this.Level;
    protected LevelDelete: UserAccessLevel = this.Level;
    protected LevelExport: UserAccessLevel = this.Level;
    protected ExtraSelect: string[] = null;
    protected DefaultSort: keyof T = null;
    protected DefaultAsc: boolean = true;
    protected DefaultLimit: number = 10;
    protected ExtraFrom: { reference: string; target: string; join: ApiTable; type: 'INNER' | 'LEFT' | ''; joinTarget?: ApiTable }[] = null;
    protected ExtraWhere: { like?: Like<T>; equals?: Partial<T> } = null;
    protected SearchContent: QuerySearch<T>[] = [];
    protected SqlFields: string[] = [];
    protected FormFields: FormField[] = [];
    protected SortCriteria: string = null;
    protected EnableFile: boolean = false;
    // ---------------------------------------
    protected getData: OutputQueryRequest<T>;
    protected Request: AppRequest = null;
    protected db: DatabaseCore;
    // ------------- PRIVATE -----------------
    public Payload: P = null;

    constructor(req?: AppRequest) {
        if (req) {
            this.Request = req;
        }
    }

    protected async validate(): Promise<void> {}

    protected async performUpdate(): Promise<void> {
        throw new StandardError('table.performUpdate', 'BAD_REQUEST', 'unknown_method', 'unknown method requested');
    }
    protected async performNew(): Promise<void> {
        throw new StandardError('table.performNew', 'BAD_REQUEST', 'unknown_method', 'unknown method requested');
    }
    protected async performDelete(): Promise<void> {
        throw new StandardError('table.performDelete', 'BAD_REQUEST', 'unknown_method', 'unknown method requested');
    }

    protected async queryOne(): Promise<void> {
        this.db = new DatabaseCore(this.Table, this.SqlFields);
        this.getData = await this.db.getById<T>(this.Request.params.id);
    }

    protected async queryAll() {
        await this.tableQuery();
    }

    protected async searchByQuery(query: DatabaseCoreQuery<T>): Promise<OutputQueryRequest<T>> {
        await this.tableQuery(query);
        return this.getData;
    }

    private async tableQuery(query: DatabaseCoreQuery<T> = null): Promise<void> {
        if (!query) {
            if (this.ExtraSelect && this.ExtraSelect.length > 0) {
                this.ExtraSelect.unshift(this.Table + '.*');
            }
            const baseQuery: DatabaseCoreQuery = {
                select: this.ExtraSelect,
                join: this.ExtraFrom,
                where: this.ExtraWhere,
            };
            query = tools.buildDbQuery(this.Request.query, this.SearchContent, baseQuery);
        }
        if (!query.order) {
            query.order = this.DefaultSort;
            query.asc = this.DefaultAsc;
        }
        if (!query.limit) {
            query.limit = this.DefaultLimit;
        }
        if (!query.offset) {
            query.offset = 0;
        }

        this.db = new DatabaseCore(this.Table, this.SqlFields);
        this.getData = await this.db.getByQuery(query);
    }

    protected async Log(deleteAction: boolean = false) {
        const oldGetData = !this.getData || this.getData.records.length < 1 ? null : this.getData.records[0];
        await this.queryOne();

        if (deleteAction) {
            return tools.SetGenericActionLog(this.SqlFields, this.getData, null);
        } else {
            return tools.SetGenericActionLog(this.SqlFields, this.getData, oldGetData);
        }
    }

    // -----------------------------------------------------

    // Méthodes publiques pour accéder aux méthodes protégées
    public get publicLevel() {
        return this.Level;
    }
    public get publicLevelNew() {
        return this.LevelNew;
    }
    public get publicLevelUpdate() {
        return this.LevelUpdate;
    }
    public get publicLevelDelete() {
        return this.LevelDelete;
    }
    public get publicLevelExport() {
        return this.LevelExport;
    }
    public setRequest(req: AppRequest) {
        this.Request = req;
    }
    public setPayload(p: P) {
        this.Payload = p;
    }

    public async queryAllPublic() {
        await this.queryAll();
    }

    public async queryOnePublic() {
        await this.queryOne();
    }

    public async performNewPublic() {
        await this.validate();
        this.db = new DatabaseCore(this.Table, this.SqlFields);
        await this.performNew();
    }

    public async performUpdatePublic() {
        await this.validate();
        await this.queryOne();
        this.db = new DatabaseCore(this.Table, this.SqlFields);
        await this.performUpdate();
    }

    public async performDeletePublic() {
        await this.queryOne();
        this.db = new DatabaseCore(this.Table, this.SqlFields);
        await this.performDelete();
    }

    public async searchByQueryPublic(query: DatabaseCoreQuery<T>) {
        return await this.searchByQuery(query);
    }

    public get Data() {
        return this.getData;
    }
    public get IsFileEnable() {
        return this.EnableFile;
    }
}

export default Table;

export type FormField = {
    field: string;
    fieldName: string;
    fieldType: SearchContentTypeEnum;
    isUnique: boolean;
    isRequired: boolean;
};
export enum SearchContentTypeEnum {
    NUM = 0,
    TEXT = 1,
    DATE = 2,
    NONE = 3,
    BOOL = 4,
}
export type GrammarModel = {
    singular: string;
    plural: string;
    singularArticle: string;
    pluralArticle: string;
};
