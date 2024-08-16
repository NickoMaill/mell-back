import { ApiTable, DatabaseCoreQuery, QuerySearch } from '~/core/coreApiTypes';
import { OutputQueryRequest, UserAccessLevel } from '~/core/typeCore';
import { Comment, FullShow, Show, ShowPayloadType } from '~/models/shows';
import Table from './table';
import MediaModule from './mediaModule';
import { Media } from '~/models/media';
import CommentsModule from './commentsModule';

class ShowsModule extends Table<Show, ShowPayloadType> {
    protected override Table = ApiTable.SHOWS;
    protected override Level = UserAccessLevel.VISITOR;
    protected override LevelNew = UserAccessLevel.ADMIN;
    protected override LevelUpdate = UserAccessLevel.ADMIN;
    protected override LevelDelete = UserAccessLevel.ADMIN;
    protected override LevelExport = UserAccessLevel.ADMIN;
    protected override SearchContent: QuerySearch<Show>[] = [
        { field: 'title', dbField: 'title', typeWhere: 'LIKE', typeClause: 'EQUALS' },
        { field: 'startAt', dbField: 'startDate', typeWhere: 'EQUALS', typeClause: 'EQUALS' },
        { field: 'showOnLanding', dbField: 'showOnLanding', typeWhere: 'EQUALS', typeClause: 'EQUALS' },
    ];
    protected override DefaultSort: keyof Show = 'id';
    protected override SqlFields: string[] = Object.keys(new Show());

    protected override async performUpdate(): Promise<void> {
        const payload = this.Request.body as ShowPayloadType;

        if (!isNaN(payload.lat)) payload.lat = parseFloat(payload.lat.toString());
        if (!isNaN(payload.long)) payload.long = parseFloat(payload.long.toString());

        const query: DatabaseCoreQuery<Show> = {
            update: payload,
            where: { equals: { id: this.Request.params.id } },
        };
        await this.db.updateRecord(query);
    }

    protected override async performNew(): Promise<void> {}
    protected override async performDelete(): Promise<void> {}

    public async getFullShowById() {
        this.Request.query.id = this.Request.params.id;
        await this.getFullShow();
    }

    public async getFullShow() {
        await this.queryAll();
        for (const s of this.getData.records as FullShow[]) {
            const mediaModule = new MediaModule();
            const commentModule = new CommentsModule();
            const mediaQuery: DatabaseCoreQuery<Media> = {
                where: {
                    equals: {
                        mediaGroupId: s.id,
                    },
                },
            };
            const commentQuery: DatabaseCoreQuery<Comment> = {
                where: {
                    equals: {
                        showId: s.id,
                    },
                },
            };
            const media = await mediaModule.searchByQueryPublic(mediaQuery);
            const comments = await commentModule.searchByQueryPublic(commentQuery);
            s.media = media.totalRecords > 0 ? media.records.filter((m) => !m.isMain) : [];
            s.cover = media.records.find((m) => m.isMain);
            s.comments = comments.records;
        }
    }

    public async getCurrentShow(): Promise<OutputQueryRequest<FullShow>> {
        this.Request.query.showOnLanding = 'true';
        await this.getFullShow();
        return this.Data as OutputQueryRequest<FullShow>;
    }
    // public --> start region /////////////////////////////////////////////
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}
export default ShowsModule;
