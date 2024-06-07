import { Router } from 'express';
import ControllerBase, { AppRequest, AppResponse } from '~/core/controllerBase';
import logManager from '~/managers/logManager';
import { checkAuth } from '~/middlewares/auth';
class ShowsController extends ControllerBase {
    constructor() {
        super();
        // ----- global routes
        this.Route.get('/', this.init);
        this.Route.get('/list', this.getShowsList);
        // ----- shows route
        this.Route.get('/:id(\\d+)', this.getShowDetails);
        this.Route.post('/', checkAuth, this.addShow);
        this.Route.put('/:id(\\d+)', checkAuth, this.updateShow);
        this.Route.delete('/:id(\\d+)', checkAuth, this.deleteShow);
        // ------ comment routes
        this.Route.get('/comments', this.getAllComment);
        this.Route.get('/:id(\\d+)/comments', this.getShowComments);
        this.Route.get('/:id(\\d+)/comments/:commentId/(\\d+)', this.getShowComment);
    }
    private init(_req: AppRequest, res: AppResponse) {
        logManager.setLog('ShowsController', 'default init route requested');
        res.json({ message: 'Default init route' });
    }
    private addShow(req: AppRequest, res: AppResponse) {}
    private getShowsList(req: AppRequest, res: AppResponse) {}
    private getShowDetails(req: AppRequest, res: AppResponse) {}
    private updateShow(req: AppRequest, res: AppResponse) {}
    private deleteShow(req: AppRequest, res: AppResponse) {}
    private getShowComments(req: AppRequest, res: AppResponse) {}
    private getShowComment(req: AppRequest, res: AppResponse) {}
    private getAllComment(req: AppRequest, res: AppResponse) {}
}
export default new ShowsController();
