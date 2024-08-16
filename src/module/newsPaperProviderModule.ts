import { Article, NewsPaperProvider, NewsPaperProviderPayload } from '~/models/articles';
import Table from './table';
import { ApiTable, DatabaseCoreQuery, QuerySearch } from '~/core/coreApiTypes';
import { UserAccessLevel } from '~/core/typeCore';
import MediaModule from './mediaModule';
import { MediaGroupEnum, MediaStatus } from '~/models/media';
import logManager from '~/managers/logManager';

export class NewsPaperProviderModule extends Table<NewsPaperProvider, NewsPaperProviderPayload> {
    protected override Table = ApiTable.NEWSPAPER;
    protected override Level = UserAccessLevel.VISITOR;
    protected override LevelNew = UserAccessLevel.VISITOR;
    protected override LevelUpdate = UserAccessLevel.ADMIN;
    protected override LevelDelete = UserAccessLevel.ADMIN;
    protected override LevelExport = UserAccessLevel.ADMIN;
    protected override SearchContent: QuerySearch<NewsPaperProvider>[] = [{ field: 'title', dbField: 'name', typeWhere: 'LIKE', typeClause: 'EQUALS' }];
    protected override DefaultSort: keyof NewsPaperProvider = 'id';
    protected override SqlFields: string[] = Object.keys(new NewsPaperProvider());
    protected override EnableFile: boolean = true;
    private logAction = 'NewsPaperProvider';

    protected override async performNew(): Promise<void> {
        const inserted = await this.db.insert<NewsPaperProviderPayload, NewsPaperProvider>(this.Payload);
        const mediaModule = new MediaModule(this.Request);
        mediaModule.Payload = {
            type: this.Request.file.mimetype,
            sortOrder: 1,
            isVideo: false,
            status: MediaStatus.REGULAR_PIC,
            mediaGroup: MediaGroupEnum.NEWSPAPER,
            mediaGroupId: inserted.records[0].id,
        };
        await mediaModule.performNewPublic();
        let logTxt = 'Action : New \n\n';
        logTxt += await this.Log();
        await logManager.setLog(this.logAction, logTxt);
    }

    protected override async performUpdate(): Promise<void> {
        const query: DatabaseCoreQuery<NewsPaperProvider> = {
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

    // public --> start region /////////////////////////////////////////////
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}
