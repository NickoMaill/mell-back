import { Router } from 'express';
import logManager from '~/managers/logManager';
import { AppRequest, AppResponse } from '../core/controllerBase';

class DefaultController {
    private readonly Route = Router();
    constructor() {
        this.Route.get("/", this.init);
    }
    private init(_req: AppRequest, res: AppResponse) {
        logManager.info('defaultController.get', 'default init route requested');
        res.json({ message: 'Default init route' });
    }
    public get Router() {
        return this.Route;
    }
}

export default new DefaultController();
