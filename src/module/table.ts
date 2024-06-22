import { AppRequest } from '~/core/controllerBase';
import { ApiTable, DatabaseCoreQuery, Like, QuerySearch } from '~/core/coreApiTypes';
import { DatabaseCore } from '~/core/dataBaseCore';
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
    protected ExtraSelect: (keyof T)[] = null;
    protected DefaultSort: keyof T = null;
    protected DefaultAsc: boolean = true;
    protected DefaultLimit: number = 10;
    protected ExtraFrom: { reference: string; target: string; join: ApiTable; type: 'INNER' | 'LEFT' | '' }[] = null;
    protected ExtraWhere: { like?: Like<T>; equals?: Partial<T> } = null;
    protected SearchContent: QuerySearch<T>[] = [];
    protected SqlFields: string[] = [];
    protected FormFields: FormField[] = [];
    protected SortCriteria: string = null;
    // ---------------------------------------
    protected getData: OutputQueryRequest<T>;
    protected Request: AppRequest = null;
    // ------------- PRIVATE -----------------
    private db: DatabaseCore;
    protected Payload: P;

    protected validate(): { key: string; message: string } {
        return null;
    }

    protected async performUpdate(): Promise<void> {}
    protected async performNew(): Promise<void> {}
    protected async performDelete(): Promise<void> {}

    protected async queryOne(): Promise<void> {
        this.db = new DatabaseCore(this.Table, this.SqlFields);
        this.getData = await this.db.getById(this.Request.params.id);
    }

    protected async queryAll() {
        await this.tableQuery();
    }

    private async tableQuery(): Promise<void> {
        const baseQuery: DatabaseCoreQuery = {
            select: this.ExtraSelect,
            join: this.ExtraFrom,
            where: this.ExtraWhere,
        };
        const query = tools.buildDbQuery(this.Request.query, this.SearchContent, baseQuery);
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

    // -----------------------------------------------------

    // Méthodes publiques pour accéder aux méthodes protégées
    public setRequest(req: AppRequest) {
        this.Request = req;
        this.Payload = req.body;
    }

    public setPayload(payload: P) {
        this.Payload = payload;
    }

    public async queryAllPublic() {
        await this.queryAll();
    }

    public async queryOnePublic() {
        await this.queryOne();
    }

    public async performNewPublic() {
        await this.performNew();
    }

    public async performUpdatePublic() {
        await this.performUpdate();
    }

    public async performDeletePublic() {
        await this.performDelete();
    }

    public get Data() {
        return this.getData;
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
