import { Router } from 'express';
import { AppRequest, AppResponse } from '~/core/controllerBase';
import logManager from '~/managers/logManager';

class MediasController {
    private readonly Route = Router();
    constructor() {
        this.Route.get('/', this.init);
        // this.Route.get('/:id(\\d+)');
    }
    private init(_req: AppRequest, res: AppResponse) {
        logManager.info('defaultController.get', 'default init route requested');
        res.json({ message: 'Default init route' });
    }
    public get Router() {
        return this.Route;
    }
}
export default new MediasController();
