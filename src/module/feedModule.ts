import { ApiTable, DatabaseCoreQuery, QuerySearch } from '~/core/coreApiTypes';
import { OutputQueryRequest, UserAccessLevel } from '~/core/typeCore';
import { Post, PostPayload } from '~/models/posts';
import { Show } from '~/models/shows';
import Table from './table';
import App from '~/core/appCore';

class FeedModule extends Table<Post, PostPayload> {
    protected override Table = ApiTable.FEED;
    protected override Level = UserAccessLevel.VISITOR;
    protected override LevelNew = UserAccessLevel.ADMIN;
    protected override LevelUpdate = UserAccessLevel.ADMIN;
    protected override LevelDelete = UserAccessLevel.ADMIN;
    protected override LevelExport = UserAccessLevel.ADMIN;
    protected override SearchContent: QuerySearch<Post>[] = [
        { field: "id", dbField: "id", typeWhere: "EQUALS", typeClause: "EQUALS"},
        { field: "postId", dbField: "postId", typeWhere: "EQUALS", typeClause: "EQUALS"},
    ];
    protected override DefaultSort: keyof Post = "date";
    protected override DefaultAsc: boolean = false;
    protected override DefaultLimit: number = 5;
    protected override SqlFields: string[] = Object.keys(new Post());

    protected override async performNew(): Promise<void> {
        await this.db.insert<PostPayload>(this.Payload);
    }
    protected override async performDelete(): Promise<void> {
        await App.query("DELETE FROM Feed");
    }

    // public --> start region /////////////////////////////////////////////
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}
export default FeedModule;
