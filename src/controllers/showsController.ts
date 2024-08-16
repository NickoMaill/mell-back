import { Show, ShowPayloadType } from '~/models/shows';
import TableController from './tableController';
import ShowsModule from '~/module/showsModule';
import { AppParams, AppQuery, AppRequest, AppResponse } from '~/core/controllerBase';
import MediaModule from '~/module/mediaModule';
import { checkAuth } from '~/middlewares/auth';
class ShowsController extends TableController<Show, ShowPayloadType> {
    constructor() {
        super(ShowsModule);
        this.router.get('/:id(\\d+)/checkMainVisu', checkAuth, this.gotMainVisual);
        this.router.get('/current', this.getCurrentShow);
        this.router.get('/full', this.getFullShow);
        this.router.get('/full/:id(\\d+)', this.getFullShowById);
    }
    private gotMainVisual(req: AppParams<{ id: number }>, res: AppResponse) {
        const media = new MediaModule();
        const got = media.getShowMainVisual(req.params.id);
        res.json({ gotMainVisual: got });
    }
    private async getCurrentShow(req: AppRequest, res: AppResponse) {
        const show = new ShowsModule(req);
        await show.getCurrentShow();
        res.json(show.Data);
    }
    private async getFullShow(req: AppRequest, res: AppResponse) {
        const showModule = new ShowsModule(req);
        await showModule.getFullShow();
        res.json(showModule.Data);
    }

    private async getFullShowById(req: AppParams<{ id: number }>, res: AppResponse) {
        const showModule = new ShowsModule(req);
        await showModule.getFullShowById();
        res.json(showModule.Data);
    }
}

export default new ShowsController();
