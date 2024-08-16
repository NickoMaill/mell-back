import { Comment, CommentPayload } from '~/models/shows';
import Table from './table';
import { ApiTable, DatabaseCoreQuery, QuerySearch } from '~/core/coreApiTypes';
import { UserAccessLevel } from '~/core/typeCore';
import puppeteer from 'puppeteer';
import moment from 'moment';
import { DatabaseCore } from '~/core/dataBaseCore';

class CommentsModule extends Table<Comment, CommentPayload> {
    protected override Table = ApiTable.COMMENT;
    protected override Level = UserAccessLevel.VISITOR;
    protected override LevelNew = UserAccessLevel.ADMIN;
    protected override LevelUpdate = UserAccessLevel.ADMIN;
    protected override LevelDelete = UserAccessLevel.ADMIN;
    protected override LevelExport = UserAccessLevel.ADMIN;
    protected override DefaultSort: keyof Comment = 'id';
    protected override SqlFields: string[] = Object.keys(new Comment());
    protected override SearchContent: QuerySearch<Comment>[] = [{ field: 'showId', dbField: 'showId', typeClause: 'EQUALS', typeWhere: 'EQUALS' }];

    protected override async performNew(): Promise<void> {
        this.db = new DatabaseCore(this.Table, this.SqlFields);
        await this.db.insert<Comment>(this.Request.body, ['rating', 'name', 'showId', 'title', 'description']);
    }

    protected override async performUpdate(): Promise<void> {
        const query: DatabaseCoreQuery<Comment, CommentPayload> = {
            update: this.Payload,
            where: {
                equals: {
                    id: this.Request.params.id,
                },
            },
        };
        await this.db.updateRecord(query);
    }

    protected override async performDelete(): Promise<void> {
        await this.db.deleteRecord(this.Request.params.id);
    }

    // public --> start region /////////////////////////////////////////////
    public async insertComments() {
        const comments = this.Request.body as CommentPayload[];
        for (const comment of comments) {
            this.Request.body = comment;
            await this.performNew();
        }
    }

    public async getFetchedComments(showId: number, url: string): Promise<CommentPayload[]> {
        const com = await this.fetchComments(showId, url);
        return com;
    }
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    private async fetchComments(showId: number, url: string): Promise<CommentPayload[]> {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, {
            waitUntil: 'networkidle2',
        });
        const comments: CommentPayload[] = await page.evaluate(() => {
            const foundedComments: CommentPayload[] = [];
            const critDivs = document.querySelectorAll('.crit');
            Array.from(critDivs).forEach((el: HTMLElement) => {
                let date = (el.children[6] as HTMLElement).innerText.split('le ')[1].trim().split(',')[0].trim();
                if (date.length > 0) {
                    let rawSplitted = date.split('/');
                    if (rawSplitted.length === 3) {
                        date = `20${rawSplitted[2]}-${rawSplitted[1]}-${rawSplitted[0]}`;
                    } else {
                        date = date + ' ' + new Date().getFullYear();
                    }
                }
                const com: CommentPayload = {
                    title: (el.children[1] as HTMLElement).innerText.replace('-', ''),
                    name: (el.children[0].children[0] as HTMLElement).innerText,
                    rating: Number((el.children[2].children[0] as HTMLElement).title.split('/')[0]),
                    description: el.childNodes[8].textContent.trim(),
                    showId: null,
                    date: null,
                    rawDate: date,
                };
                foundedComments.push(com);
            });
            return foundedComments;
        });
        comments.forEach((c) => {
            const format = c.rawDate.trim().match(' ') ? 'DD MMMM YYYY' : 'YYYY-MM-DD';
            c.showId = showId;
            c.date = moment(c.rawDate, format).toDate();
            delete c.rawDate;
        });
        await browser.close();
        return comments;
    }
    // private --> end region //////////////////////////////////////////////
}
export default CommentsModule;
