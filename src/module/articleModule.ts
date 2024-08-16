import { ArticlePayload, Article, NewsPaperProvider } from '~/models/articles';
import Table from './table';
import { ApiTable, DatabaseCoreQuery, InsertFormatOut, Like, QuerySearch } from '~/core/coreApiTypes';
import { UserAccessLevel } from '~/core/typeCore';
import { StandardError } from '~/core/standardError';
import logManager from '~/managers/logManager';

export class ArticleModule extends Table<Article, ArticlePayload> {
    protected override Table = ApiTable.ARTICLES;
    protected override Level = UserAccessLevel.VISITOR;
    protected override LevelNew = UserAccessLevel.ADMIN;
    protected override LevelUpdate = UserAccessLevel.ADMIN;
    protected override LevelDelete = UserAccessLevel.ADMIN;
    protected override LevelExport = UserAccessLevel.ADMIN;
    protected override SearchContent: QuerySearch<Article>[] = [
        { field: 'title', dbField: 'title', typeWhere: 'LIKE', typeClause: 'EQUALS' },
        { field: 'newsPaperId', dbField: 'newsPaperId', typeWhere: 'EQUALS', typeClause: 'IN' },
    ];
    protected override DefaultSort: keyof Article = 'id';
    protected override SqlFields: string[] = Object.keys(new Article());
    protected override EnableFile: boolean = false;
    protected override ExtraFrom: { reference: string; target: string; join: ApiTable; type: 'INNER' | 'LEFT' | ''; joinTarget?: ApiTable }[] = [
        { reference: 'id', target: 'newspaperid', join: ApiTable.NEWSPAPER, type: 'LEFT' },
        { reference: 'mediagroupid', target: 'id', joinTarget: ApiTable.NEWSPAPER, join: ApiTable.MEDIAS, type: 'LEFT' },
    ];
    protected override ExtraWhere: { like?: Like<Article>; equals?: Partial<Article | any> } = {
        equals: {
            mediagroup: 'newsPaper',
        },
    };
    protected override ExtraSelect = ['newspaperprovider.name AS providerName', 'medias.url AS providerImg'];
    private logAction = 'articles';

    protected override async validate(): Promise<void> {
        if ((this.Payload.attachementUrl ?? '') !== '' && (this.Payload.attachementType ?? '') === '') throw new StandardError('validate', 'BAD_REQUEST', 'required_field¤attachementType', 'Type de média requis', 'Vous devez fournir un type de media lorsque vous en fournissez un');
    }

    protected override async performNew(): Promise<void> {
        await this.db.insert(this.Payload);
        let logTxt = 'Action : New \n\n';
        logTxt += await this.Log();
        await logManager.setLog(this.logAction, logTxt);
    }

    protected override async performUpdate(): Promise<void> {
        const query: DatabaseCoreQuery<Article> = {
            update: this.Payload,
            where: {
                equals: {
                    id: this.Request.params.id,
                },
            },
        };
        await this.db.updateRecord(query);
        let logTxt = 'Action : Update \n\n';
        logTxt += await this.Log();
        await logManager.setLog(this.logAction, logTxt);
    }

    protected override async performDelete(): Promise<void> {
        await this.db.deleteRecord(this.Request.params.id);
        let logTxt = 'Action : Delete \n\n';
        logTxt += await this.Log(true);
        await logManager.setLog(this.logAction, logTxt);
    }
}
