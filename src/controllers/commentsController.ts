import { AppRequest, AppResponse } from '~/core/controllerBase';
import TableController from './tableController';
import CommentsModule from '~/module/commentsModule';
import { Comment, CommentPayload } from '~/models/shows';

class CommentsController extends TableController<Comment, CommentPayload> {
    constructor() {
        super(CommentsModule);
        this.router.post('/fetchComments', this.getComments);
        this.router.post('/addMultiple', this.addMultipleComments);
    }
    public async getComments(req: AppRequest, res: AppResponse) {
        const comments = await new CommentsModule().getFetchedComments(req.body.showId, req.body.url);
        res.json(comments);
    }

    public async addMultipleComments(req: AppRequest<CommentPayload[]>, res: AppResponse) {
        const commentModule = new CommentsModule(req);
        await commentModule.insertComments();
        res.json({ success: true });
    }
}
export default new CommentsController();
